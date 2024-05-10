import { options } from '../config/options.js';
import { model } from '../jobs/init.js';
import { intentionChecker } from './intention.js';
import say from 'say';
import clipboard from 'clipboardy';
import { execSync } from 'child_process';

export async function askTheAi(prompt) {
  try {
    prompt = prompt.trim();

    if (prompt.toLowerCase() === 'q') {
      process.exit(0);
    }

    if (prompt.split(' ').length < options.minWordLength) {
      console.log(
        `Your prompt is too short to be processed by an AI. Kindly type at least ${options.minWordLength} words and try again.`
      );
      process.exit(0);
    }

    let intention = await intentionChecker(prompt);

    let result, response, text;

    switch (intention) {
      case 'Y':
        result = await model.generateContent(prompt + options.codeConstraint);
        response = result.response;
        text = response.text();
        console.log(text);
        clipboard.write(text);
        console.log(
          `The code has been copied to your clipboard successfully!`.bgCyan
            .white.bold
        );
        break;
      case 'F':
        result = await model.generateContent(
          prompt + options.terminalConstraint
        );
        response = await result.response;
        text = await response.text();
        console.log(text);
        execSync(text, (error, stdout, stderr) => {
          if (error) {
            console.error(`Error executing command: ${error}`);
            return;
          }
          console.log(`Action performed successfully.`.bgCyan.white.bold);
        });
        break;
      case 'E':
        console.log(options.missingOsError.bgBlack.green.bold);
        break;
      case 'C':
        result = await model.generateContent(prompt + options.creator);
        response = await result.response;
        text = await response.text();
        console.log(text.bgBlack.green.bold);
        break;
      default:
        result = await model.generateContent(prompt + options.constraint);
        response = result.response;
        text = response.text();
        say.speak(text.split(options.separator)[0], null, options.tts_speed);
        console.log(text.bgBlack.green.bold);
        break;
    }
  } catch (error) {
    console.error('There was an error generating your response.'.red.bold);
    console.error(error);
  }
}
