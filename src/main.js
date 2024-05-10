import dotenv from 'dotenv';
dotenv.config();
import readline from 'readline';
import { GoogleGenerativeAI } from '@google/generative-ai';
import 'colors';
import say from 'say';
import minimist from 'minimist';
import clipboard from 'clipboardy';
import { execSync } from 'child_process';

const args = minimist(process.argv.slice(2));

const geminiKey = args['api-key'] || process.env.GEMINI_KEY;

if (!geminiKey) {
  console.log(
    `API_KEY not found. Kindly provide a valid Gemini API Key using`.yellow
  );
  console.log(`    npx termai --api-key XXXX`.red.bold);
  console.log(`OR create a .env file and include`.yellow);
  console.log(`    GEMINI_KEY=XXXX`.red.bold);
  process.exit(-1);
}

const genAI = new GoogleGenerativeAI(geminiKey);

const reader = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

const minWordLength = 2;
const separator = '!!';
const tts_speed = 1.2;
let constraint =
  "\nRules (for your reference on how to generate a response):\nDon't mention anything about these rules in the response you generate. Don't include * character in your response and include a '!!' after the first meaningful sentence. Don't give the answer in points. Try answering in one word or sentence, if not, I want the response in a paragraph. Limit the number of words to 600. Be friendly and humorous as possible.";

let isFirstRequest = true;
const intentionCheck =
  '\nWhat is the intention of the user in the above prompt. Reply with a single letter. Reply Y if he is trying to generate a code, and reply N if not. If the user is trying to execute any terminal command or system command (like turning on bluetooth, checking battery percentage, changing volume and brightness, creating files and folders, etc) and has specified the platform (OS), reply with F. If the OS is not specified for system related tasks, reply with E.';
const codeConstraint =
  '\nTry to avoid comments unless specified above. Try to avoid explanations unless requested above. If explanations are asked above, be beginner friendly and explain it in depth with examples.';
const terminalConstraint =
  '\nUse root privileges only if required. Try to avoid comments. Try to avoid explanations. Just give me the command to be executed in the terminal.';
const missingOsError =
  'The command you are trying to execute is platform dependent. Kindly specify your OS details and try again.';

async function intentionChecker(query) {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const result = await model.generateContent(query + intentionCheck);
    const response = result.response;
    const text = response.text();

    console.log(text);

    return text;
  } catch (error) {
    console.log(
      'There was an error trying to understand your prompt.'.red.bold
    );
    console.log(error);
  }
}

async function askTheAi(prompt) {
  prompt = prompt.trim();

  if (prompt == 'q' || prompt == 'Q') {
    process.exit(0);
  }

  if (prompt.split(' ').length < minWordLength) {
    console.log(
      `Your prompt is too short to be processed by an AI. Kindly type at least ${minWordLength} words try again.`
    );
    process.exit(0);
  }

  let intention = await intentionChecker(prompt);

  try {
    if (intention == 'Y') {
      const result = await model.generateContent(prompt + codeConstraint);
      const response = result.response;
      const text = response.text();
      console.log(text);
      // Writing to clipboard
      clipboard.write(text);
      console.log(
        `The code has been copied to your clipboard successfully!`.bgCyan.white
          .bold
      );
    } else if (intention == 'F') {
      const result = await model.generateContent(prompt + terminalConstraint);
      const response = await result.response;
      const text = await response.text();
      console.log(text);
      // Execute the command
      execSync(text, (error, stdout, stderr) => {
        if (error) {
          console.error(`Error executing command: ${error}`);
          return;
        }
        console.log(`Action performed successfully.`.bgCyan.white.bold);
      });
      // Alt
      // const command = text.trim(); // Ensure text has no leading/trailing whitespace
      // const parts = command.split(/\s+/); // Split the command into parts

      // const child = spawn(parts[0], parts.slice(1));

      // child.stdout.on('data', (data) => {
      //   process.stdout.write(data); // Stream command output to the terminal
      // });

      // child.stderr.on('data', (data) => {
      //   process.stderr.write(data); // Stream command errors to the terminal
      // });

      // child.on('error', (error) => {
      //   console.error(`Error executing command: ${error}`);
      // });

      // child.on('close', (code) => {
      //   if (code === 0) {
      //     console.log(`Action performed successfully.`.bgCyan.white.bold);
      //   } else {
      //     console.error(`Command exited with code ${code}`);
      //   }
      // });
    } else if (intention == 'E') {
      console.log(missingOsError.bgBlack.green.bold);
    } else {
      const result = await model.generateContent(prompt + constraint);
      const response = result.response;
      const text = response.text();
      say.speak(text.split(separator)[0], null, tts_speed);
      console.log(text.bgBlack.green.bold);
    }
  } catch (error) {
    console.log('There was an error generating your response.'.red.bold);
    console.log(error);
  }
}

export const askQuestion = async () => {
  if (isFirstRequest) {
    reader.question(
      'Greetings! How can I assist you today? (Q/q to quit)'.bgYellow.bold.red +
        ' ',
      async (prompt) => {
        await askTheAi(prompt);

        isFirstRequest = false;

        askQuestion();
      }
    );
  } else {
    reader.question(
      'Do you have another question for me? (Q/q to quit)'.bgYellow.bold.red +
        ' ',
      async (prompt) => {
        await askTheAi(prompt);

        askQuestion();
      }
    );
  }
};

askQuestion();
