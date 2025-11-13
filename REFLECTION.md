# REFLECTION.md

## Can I explain what my code does?

My code builds an interactive Trivia Game web application that allows players to answer multiple-choice questions, record their score, and store their results for future sessions.
The key components work together as follows:

HTML provides the structure for the form, question container, and scoreboard.
CSS defines the layout and adds visual styling, including a skeleton loader that appears while questions load from the API.
JavaScript handles the game logic:
Fetches trivia questions from the Open Trivia Database API.
Stores correct answers temporarily in sessionStorage.
Saves each player’s name in a browser cookie for returning users.
Calculates and records scores in localStorage with the player name, score, and date.
Dynamically updates the scoreboard by reading data from localStorage.
These parts combine to create a complete, user-friendly trivia experience that remembers each player and displays their history of game sessions.

## What was my coding process?

I began by reviewing the starter files and understanding how the form, API calls, and display areas were connected. Then I built the code step by step:

Session Setup: Implemented cookie handling (setCookie, getCookie, and deleteCookie) to remember returning players.
Question Fetching: Added the fetchQuestions() function to retrieve and display 10 random multiple-choice questions from the API.
Score Logic: Wrote calculateScore() to compare the user’s answers with the correct answers stored in sessionStorage.
Data Storage: Used localStorage to persist player scores between sessions and update the scoreboard automatically.
Debugging: Inserted three debugger; breakpoints and console logs to trace the program flow, inspect variables, and confirm that cookies, localStorage, and DOM updates were working correctly.
Refinement: Verified loading states, improved code comments, and ensured accessibility attributes like aria-live were set properly.

I committed my changes regularly and organized each major feature into clear Git commits for review.

## What challenges did I have?

The main challenges I encountered were:

Handling browser storage properly: At first, cookies and localStorage conflicted because empty cookie values were being reused. I fixed this by validating that saved usernames were non-empty before using them.
Debugging asynchronous code: Since fetch() runs asynchronously, I had to pause execution at the right time to inspect data flow. The debugger; statements helped me confirm when questions were loaded and displayed.
Each challenge improved my understanding of how web storage and event-driven JavaScript work together.

## What would I do differently now?

If I were to start this project again, I would:

Modularize the JavaScript by splitting the cookie, API, and scoring logic into separate files for better readability and maintenance.
Add input validation and error handling, such as disabling the submit button until all questions are answered and displaying clearer error messages if the API fails.
Improve UX design, possibly by adding score animations or showing immediate feedback (correct/incorrect) after each question.
Use async/await instead of .then() for cleaner asynchronous code flow.
Through this project, I learned how to manage user data with cookies and localStorage, debug with precision, and build a complete front-end application that integrates API data dynamically.
