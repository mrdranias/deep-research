#!/usr/bin/env python3

def ask_multiline_question(query: str) -> str:
    """
    Ask a question that can span multiple lines.
    The user enters lines until a blank line is entered.
    """
    print(query)
    lines = []
    while True:
        line = input()
        if not line.strip():  # Stop reading on an empty line
            break
        lines.append(line)
    return "\n".join(lines).strip()


def ask_question(query: str) -> str:
    """Ask a single-line question and return the answer."""
    return input(query)


def run():
    # 1. SET UP REPORT TOPIC
    # Get initial multi-line query from the user
    initial_query = ask_multiline_question(
        "What would you like to research? (Enter blank line to finish)"
    )

    # Get breadth parameter (with default of 4 if input is empty or invalid)
    breadth_input = ask_question("Enter research breadth (recommended 2-10, default 4): ")
    try:
        breadth = int(breadth_input)
    except ValueError:
        breadth = 4

    # Get depth parameter (with default of 2 if input is empty or invalid)
    depth_input = ask_question("Enter research depth (recommended 1-5, default 2): ")
    try:
        depth = int(depth_input)
    except ValueError:
        depth = 2

    print("Creating research plan...")
    print(initial_query)
    print(f"breadth={breadth}, depth={depth}")


if __name__ == "__main__":
    run()
