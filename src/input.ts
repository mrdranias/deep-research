import * as fs from 'fs/promises';
import * as readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

//added a function so can ask long questions (Chatgpt https://chatgpt.com/c/67bf83e1-818c-800f-9151-a2d6bf8f0896?model=gpt-4o)
function askMultiLineQuestion(query: string): Promise<string> {
  return new Promise(resolve => {
    console.log(query);
    let response = "";
    rl.on("line", line => {
      if (!line.trim()) {  // Stop reading on empty line
        rl.removeAllListeners("line");
        resolve(response.trim());
      } else {
        response += (response ? "\n" : "") + line;
      }
    });
  });
}


// Helper function to get user input
function askQuestion(query: string): Promise<string> {
  return new Promise(resolve => {
    rl.question(query, answer => {
      resolve(answer);
    });
  });
}


// run the agent
// calls these major functions: askQuestion, generateFeedback, deepResearch, writeFinalReport, writeFile
async function run() {

  // 1. SET UP REPORT TOPIC
  // Get initial query
  // replace the original askQuestion function with Multiline-- it is believed new line characters cause bugs.
  // const initialQuery = await askQuestion('What would you like to research? ');
  const initialQuery = await askMultiLineQuestion("What would you like to research? (Enter blank line to finish)");

  // Get breath and depth parameters
  const breadth =
    parseInt(
      await askQuestion(
        'Enter research breadth (recommended 2-10, default 4): ',
      ),
      10,
    ) || 4;
  const depth =
    parseInt(
      await askQuestion('Enter research depth (recommended 1-5, default 2): '),
      10,
    ) || 2;

  log(`Creating research plan...`);
  log(`${initialQuery} `)
  log(`breadth=${breadth}, depth=${depth} `)
  rl.close();
}

run().catch(console.error);
