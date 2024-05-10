import readline from 'readline';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { checkApiKey } from './keyCheck.js';

const key = checkApiKey();

const genAI = new GoogleGenerativeAI(key);

const reader = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

export { reader, model };
