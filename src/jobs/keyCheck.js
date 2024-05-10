import minimist from 'minimist';
import 'colors';

export const checkApiKey = () => {
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

  return geminiKey;
};
