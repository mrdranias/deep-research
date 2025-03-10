import asyncio
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.pydantic_v1 import Field, create_model
from typing import List
from systemprompt import system_prompt_1
import os

# Function to dynamically create JSON Schema Definition using Pydantic
def create_followup_model(max_questions: int):
    return create_model(
        'FollowUpQuestions',
        questions=(List[str], Field(description="List of follow-up questions.", max_items=max_questions))
    )

# Setup the Langchain Chat Model explicitly using GPT-4 JSON mode
llm = ChatOpenAI(
    model=os.getenv("OPENAI_MODEL", "o3-mini"),
    base_url=os.getenv("OPENAI_BASE_URL", "https://api.openai.com/v1"),
    api_key=os.getenv("OPENAI_API_KEY"),
    temperature=0.5,
    model_kwargs={"response_format": {"type": "json_object"}, "reasoning_effort": "medium"}}
)

# Prompt Templates
user_template = "Given the following query from the user, ask some follow-up questions to clarify the research direction. Return a maximum of {num_questions} questions. User query: {query}"

prompt = ChatPromptTemplate.from_messages([
    ("system", system_prompt_1()),
    ("human", user_template)
])

# Async function to generate follow-up questions
async def generate_feedback(query: str, num_questions: int = 3) -> List[str]:
    FollowUpQuestions = create_followup_model(num_questions)
    chain = prompt | llm.with_structured_output(FollowUpQuestions)
    response = await chain.ainvoke({"query": query, "num_questions": num_questions})
    return response.questions[:num_questions]

# Async helper function for multiline user input
async def ask_multi_line_question(question: str) -> str:
    print(question)
    print("(Submit an empty line to finish your answer.)")
    lines = []
    while True:
        line = input()
        if not line.strip():
            break
        lines.append(line)
    return "\n".join(lines).strip()

# Main script execution
async def run():
    initial_query = "can pigs fly"
    breadth = 3
    depth = 2

    # Generate follow-up questions
    follow_up_questions = await generate_feedback(initial_query, breadth)

    # Collect user answers
    answers = []
    for question in follow_up_questions:
        answer = await ask_multi_line_question(f"\n{question}\nYour answer:")
        answers.append(answer)

    # Combine query with user answers
    combined_query = f"Initial query: {initial_query}\n"
    combined_query += "\n".join(f"Q: {q}\nA: {a}" for q, a in zip(follow_up_questions, answers))

    print("\nPrinting User Prompt with Q & A...")
    print(combined_query)
    print(f"breadth={breadth}, depth={depth}")

if __name__ == "__main__":
    asyncio.run(run())
