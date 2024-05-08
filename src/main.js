import dotenv from 'dotenv';
dotenv.config();
import readline from 'readline';
import { GoogleGenerativeAI } from '@google/generative-ai';
import 'colors';
import say from 'say';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_KEY);

const reader = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

const separator = '!!';
const tts_speed = 1.2;
const constraint =
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

        const result = await model.generateContent(prompt + constraint);
        const response = result.response;
        const text = response.text();
        say.speak(text.split(separator)[0], null, tts_speed);
        console.log(text.bgBlack.green.bold);

        // const result = await model.generateContentStream([prompt]);

        // let text = '';
        // for await (const chunk of result.stream) {
        //   const chunkText = chunk.text();
        //   console.log(chunkText.bgWhite.red.bold);
        //   text += chunkText;
        // }

        isFirstRequest = false;
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

        // const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

        const result = await model.generateContent(prompt + constraint);
        const response = result.response;
        const text = response.text();
        say.speak(text.split(separator)[0], null, tts_speed);
        console.log(text.bgBlack.green.bold);

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
