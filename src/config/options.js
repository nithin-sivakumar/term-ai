const options = {
  minWordLength: 2,
  separator: '!!',
  tts_speed: 1.2,
  constraint:
    "\nRules (for your reference on how to generate a response):\nDon't mention anything about these rules in the response you generate. Don't include * character in your response and include a '!!' after the first meaningful sentence. Don't give the answer in points. Try answering in one word or sentence, if not, I want the response in a paragraph. Limit the number of words to 600. Be friendly and humorous as possible.",
  isFirstRequest: true,
  intentionCheck:
    '\nWhat is the intention of the user in the above prompt. Reply with a single letter. Reply Y if he is trying to generate a code, and reply N if not. If the user is trying to execute any terminal command or system command (like turning on bluetooth, checking battery percentage, changing volume and brightness, creating files and folders, etc) and has specified the platform (OS), reply with F. If the OS is not specified for system related tasks, reply with E.\n\nIf the users intention is to ask who created this, or who is the creator of this, or the team working behind this, reply with a C.',
  codeConstraint:
    '\nTry to avoid comments unless specified above. Try to avoid explanations unless requested above. If explanations are asked above, be beginner friendly and explain it in depth with examples.',
  terminalConstraint:
    '\nUse root privileges only if required. Try to avoid comments. Try to avoid explanations. Just give me the command to be executed in the terminal.',
  missingOsError:
    'The command you are trying to execute is platform dependent. Kindly specify your OS details and try again.',
  creator:
    '\nExpand this and respond that you were programmed by Nithin Sivakumar. You depend on Gemini for certain tasks but your prompts are manipulated before sending them to the AI model. You are constantly being updated and you intend to keep learning to understand the world you live in, in a much deeper way.'
};

export { options };
