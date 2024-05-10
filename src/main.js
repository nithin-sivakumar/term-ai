import { options } from './config/options.js';
import { reader } from './jobs/init.js';
import { askTheAi } from './tasks/ai.js';

export const askQuestion = async () => {
  const questionPrompt = options.isFirstRequest
    ? 'Greetings! How can I assist you today? (Q/q to quit)'
    : 'Do you have another question for me? (Q/q to quit)';

  reader.question(questionPrompt.bgYellow.bold.red + ' ', async (prompt) => {
    await askTheAi(prompt);

    askQuestion();
  });
};

askQuestion();

// async function askTheAi(prompt) {
//   prompt = prompt.trim();

//   if (prompt == 'q' || prompt == 'Q') {
//     process.exit(0);
//   }

//   if (prompt.split(' ').length < minWordLength) {
//     console.log(
//       `Your prompt is too short to be processed by an AI. Kindly type at least ${minWordLength} words try again.`
//     );
//     process.exit(0);
//   }

//   let intention = await intentionChecker(prompt);

//   try {
//     if (intention == 'Y') {
//       const result = await model.generateContent(prompt + codeConstraint);
//       const response = result.response;
//       const text = response.text();
//       console.log(text);
//       // Writing to clipboard
//       clipboard.write(text);
//       console.log(
//         `The code has been copied to your clipboard successfully!`.bgCyan.white
//           .bold
//       );
//     } else if (intention == 'F') {
//       const result = await model.generateContent(prompt + terminalConstraint);
//       const response = await result.response;
//       const text = await response.text();
//       console.log(text);
//       // Execute the command
//       execSync(text, (error, stdout, stderr) => {
//         if (error) {
//           console.error(`Error executing command: ${error}`);
//           return;
//         }
//         console.log(`Action performed successfully.`.bgCyan.white.bold);
//       });
//       // Alt
//       // const command = text.trim(); // Ensure text has no leading/trailing whitespace
//       // const parts = command.split(/\s+/); // Split the command into parts

//       // const child = spawn(parts[0], parts.slice(1));

//       // child.stdout.on('data', (data) => {
//       //   process.stdout.write(data); // Stream command output to the terminal
//       // });

//       // child.stderr.on('data', (data) => {
//       //   process.stderr.write(data); // Stream command errors to the terminal
//       // });

//       // child.on('error', (error) => {
//       //   console.error(`Error executing command: ${error}`);
//       // });

//       // child.on('close', (code) => {
//       //   if (code === 0) {
//       //     console.log(`Action performed successfully.`.bgCyan.white.bold);
//       //   } else {
//       //     console.error(`Command exited with code ${code}`);
//       //   }
//       // });
//     } else if (intention == 'E') {
//       console.log(missingOsError.bgBlack.green.bold);
//     } else if (intention == 'C') {
//       const result = await model.generateContent(prompt + creator);
//       const response = await result.response;
//       const text = await response.text();
//       console.log(text.bgBlack.green.bold);
//     } else {
//       const result = await model.generateContent(prompt + constraint);
//       const response = result.response;
//       const text = response.text();
//       say.speak(text.split(separator)[0], null, tts_speed);
//       console.log(text.bgBlack.green.bold);
//     }
//   } catch (error) {
//     console.log('There was an error generating your response.'.red.bold);
//     console.log(error);
//   }
// }

// export const askQuestion = async () => {
//   if (isFirstRequest) {
//     reader.question(
//       'Greetings! How can I assist you today? (Q/q to quit)'.bgYellow.bold.red +
//         ' ',
//       async (prompt) => {
//         await askTheAi(prompt);

//         isFirstRequest = false;

//         askQuestion();
//       }
//     );
//   } else {
//     reader.question(
//       'Do you have another question for me? (Q/q to quit)'.bgYellow.bold.red +
//         ' ',
//       async (prompt) => {
//         await askTheAi(prompt);

//         askQuestion();
//       }
//     );
//   }
// };
