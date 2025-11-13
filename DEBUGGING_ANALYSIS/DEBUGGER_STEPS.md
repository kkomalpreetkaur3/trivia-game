# Debugging Analysis - Trivia Game 

## Breakpoint 1: Form Submission 

- Location

Inside the handleFormSubmit(event) function — right after the line event.preventDefault();

- Purpose

To inspect what happens when the form is submitted — confirming that:

The username is correctly retrieved from either the input field or the cookie.
The function proceeds only if a valid username exists.
The score calculation process starts properly.

- Reflection

At this breakpoint, I verified that form submission correctly captures the username before processing the game results. The variables in scope matched the expected values, proving that cookie handling and input validation worked properly before saving scores.

## Breakpoint 2: Fetch Flow

- Location

Inside the fetchQuestions() function — right before the line:

- Purpose

To inspect the beginning of the question fetching process:

Ensure that showLoading(true) runs before the network request.
Observe the fetch request being prepared.
Verify that the API URL is correct and properly formatted.

- Reflection

This breakpoint confirmed that the loading skeleton activates before data retrieval, and the API request is correctly formatted and triggered. It validated proper asynchronous control in the fetch function.

## Breakpoint 3: Score Display

- Location

At the very start of the displayScores() function.

- Purpose

To examine how data from localStorage is parsed and rendered into the table.

- Reflection

This breakpoint validated that saved scores were correctly retrieved from localStorage and rendered dynamically into the scoreboard table. It confirmed DOM updates were successful, matching expected user data.