
import * as fs from 'fs/promises';
import * as readline from 'readline';

import { o3MiniModel } from './ai/providers';
import { generateObject } from 'ai';
import { z } from 'zod';

import { systemPrompt } from './prompt';



// Helper function for consistent logging
function log(...args: any[]) {
  console.log(...args);
}


export async function generateFeedback({
  query,
  numQuestions = 3,
}: {
  query: string;
  numQuestions?: number;
}) {
  const userFeedback = await generateObject({
    model: getModel(),
    system: systemPrompt(),
    prompt: `Given the following query from the user, ask some follow up questions to clarify the research direction. Return a maximum of ${numQuestions} questions, but feel free to return less if the original query is clear: <query>${query}</query>`,
    schema: z.object({
      questions: z
        .array(z.string())
        .describe(
          `Follow up questions to clarify the research direction, max of ${numQuestions}`,
        ),
    }),
  });

  return userFeedback.object.questions.slice(0, numQuestions);
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
