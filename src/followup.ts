
import * as fs from 'fs/promises';
import * as readline from 'readline';

import { getModel } from './ai/providers';

// Helper function for consistent logging
function log(...args: any[]) {
  console.log(...args);
}


async function run() {
  const initialQuery = "can pigs fly"
  const breadth = 3
  const depth = 2
  
  log(
    '\nTo better understand your research needs, please answer these follow-up questions:',
  );

  // Collect answers to follow-up questions
  // ts arrays are pushed (FIFO) and popped (LIFO) or can be pulled by index like python.
  const answers: string[] = [];
  for (const question of followUpQuestions) {
    const answer = await askQuestion(`\n${question}\nYour answer: `);
    answers.push(answer);
  }

  // Combine all information for deep research
  // the var combinedQuery joins the initial query and Q&A for insertion in future prompts.
  // the spacing is unfortunate and reflects that spacing is decorative in ts.
  const combinedQuery = `
Initial Query: ${initialQuery}
Follow-up Questions and Answers:
${followUpQuestions.map((q: string, i: number) => `Q: ${q}\nA: ${answers[i]}`).join('\n')}
`;

  log(`Printing User Prompt with Q & A...`);
  log(`${combinedQuery} `)
  log(`breadth=${breadth}, depth=${depth} `)
  rl.close();
}

run().catch(console.error);
