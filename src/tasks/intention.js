import { options } from '../config/options.js';
import { model } from '../jobs/init.js';

export async function intentionChecker(query) {
  try {
    const result = await model.generateContent(query + options.intentionCheck);
    const response = result.response;
    const text = response.text();

    // console.log(text);

    return text;
  } catch (error) {
    console.log(
      'There was an error trying to understand your prompt.'.red.bold
    );
    console.log(error);
  }
}
