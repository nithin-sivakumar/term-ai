import dotenv from 'dotenv';
dotenv.config();
import readline from 'readline';
import { GoogleGenerativeAI } from '@google/generative-ai';
import 'colors';
import say from 'say';
import minimist from 'minimist';

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

let code_words = ['api', 'code', 'program'];
let isCode = false;
const separator = '!!';
const tts_speed = 1.2;
let constraint =
  " .Don't include * character in your response and include a '!!' after the first meaningful sentence. Don't give the answer in points. Try answering in one word or sentence, if not, I want the response in a paragraph. Limit the number of words to 600. Be friendly and witty, and as savage and humorous as possible.";

let isFirstRequest = true;

export const askQuestion = async () => {
  if (isFirstRequest) {
    reader.question(
      'How can I assist you today? (Q/q to quit)'.bgYellow.bold.red + ' ',
      async (prompt) => {
        if (prompt == 'q' || prompt == 'Q') {
          process.exit(0);
        }

        let words = prompt.split('');

        words.map((ele) => {
          if (code_words.includes(ele.toLowerCase())) {
            constraint =
              ' . Generate just the code. No explanation needed. Do not include comments';
            isCode = true;
          }
        });

        const result = await model.generateContent(prompt + constraint);
        const response = result.response;
        const text = response.text();

        if (isCode) {
          console.log(text);
        } else {
          say.speak(text.split(separator)[0], null, tts_speed);
          console.log(text.bgBlack.green.bold);
        }

        // const result = await model.generateContentStream([prompt]);

        // let text = '';
        // for await (const chunk of result.stream) {
        //   const chunkText = chunk.text();
        //   console.log(chunkText.bgWhite.red.bold);
        //   text += chunkText;
        // }

        isFirstRequest = false;
        isCode = false;

        askQuestion();
      }
    );
  } else {
    reader.question(
      'Do you have another question for me? (Q/q to quit)'.bgYellow.bold.red +
        ' ',
      async (prompt) => {
        if (prompt == 'q' || prompt == 'Q') {
          process.exit(0);
        }

        let words = prompt.split('');

        words.map((ele) => {
          if (code_words.includes(ele.toLowerCase())) {
            constraint =
              ' . Generate just the code. No explanation needed. Do not include comments';
            isCode = true;
          }
        });

        // const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

        const result = await model.generateContent(prompt + constraint);
        const response = result.response;
        const text = response.text();

        if (isCode) {
          console.log(text);
        } else {
          say.speak(text.split(separator)[0], null, tts_speed);
          console.log(text.bgBlack.green.bold);
        }

        isCode = false;
        // const result = await model.generateContentStream([prompt]);

        // let text = '';
        // for await (const chunk of result.stream) {
        //   const chunkText = chunk.text();
        //   console.log(chunkText.bgWhite.red.bold);
        //   text += chunkText;
        // }

        askQuestion();
      }
    );
  }
};

askQuestion();
