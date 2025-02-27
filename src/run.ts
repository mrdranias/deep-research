import * as fs from 'fs/promises';
import * as readline from 'readline';

import { deepResearch, writeFinalReport } from './deep-research';
import { generateFeedback } from './feedback';
import { OutputManager } from './output-manager';

const output = new OutputManager();

// Helper function for consistent logging
function log(...args: any[]) {
  output.log(...args);
}

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
async function run() {
  // Get initial query
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

  // Generate follow-up questions
  const followUpQuestions = await generateFeedback({
    query: initialQuery,
  });

  log(
    '\nTo better understand your research needs, please answer these follow-up questions:',
  );

  // Collect answers to follow-up questions
  const answers: string[] = [];
  for (const question of followUpQuestions) {
    const answer = await askQuestion(`\n${question}\nYour answer: `);
    answers.push(answer);
  }

  // Combine all information for deep research
  const combinedQuery = `
Initial Query: ${initialQuery}
Follow-up Questions and Answers:
${followUpQuestions.map((q: string, i: number) => `Q: ${q}\nA: ${answers[i]}`).join('\n')}
`;

  log('\nResearching your topic...');

  log('\nStarting research with progress tracking...\n');
  
  const { learnings, visitedUrls } = await deepResearch({
    query: combinedQuery,
    breadth,
    depth,
    onProgress: (progress) => {
      output.updateProgress(progress);
    },
  });

  log(`\n\nLearnings:\n\n${learnings.join('\n')}`);
  log(
    `\n\nVisited URLs (${visitedUrls.length}):\n\n${visitedUrls.join('\n')}`,
  );
  log('Writing final report...');

  const report = await writeFinalReport({
    prompt: combinedQuery,
    learnings,
    visitedUrls,
  });

  // Save report to file
  await fs.writeFile('output.md', report, 'utf-8');

  console.log(`\n\nFinal Report:\n\n${report}`);
  console.log('\nReport has been saved to output.md');
  rl.close();
}

run().catch(console.error);
