/*
 Initializes the Trivia Game when the DOM is fully loaded.
*/
document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("trivia-form");
    const questionContainer = document.getElementById("question-container");
    const newPlayerButton = document.getElementById("new-player");
    const usernameInput = document.getElementById("username");

    // Initialize the game
    checkUsername();
    fetchQuestions();
    displayScores();

    /*
    COOKIE MANAGEMENT
    */
    function setCookie(name, value, days = 7) {
        const date = new Date();
        date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
        document.cookie = `${name}=${value}; expires=${date.toUTCString()}; path=/`;
    }

    function getCookie(name) {
        return document.cookie
            .split("; ")
            .find((row) => row.startsWith(name + "="))
            ?.split("=")[1];
    }

    function deleteCookie(name) {
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`;
    }

    /*
    USER SESSION CHECK
    */
    function checkUsername() {
        const savedUsername = getCookie("username");

        // Only treat cookie as valid if it's non-empty
        if (savedUsername && savedUsername.trim() !== "") {
            usernameInput.classList.add("hidden");
            newPlayerButton.classList.remove("hidden");
            usernameInput.value = savedUsername; // keeps UI consistent
        } else {
            usernameInput.classList.remove("hidden");
            newPlayerButton.classList.add("hidden");
            usernameInput.value = "";
        }
    }

    /*
    FETCH QUESTIONS
    */
    function fetchQuestions() {
        showLoading(true);

        fetch("https://opentdb.com/api.php?amount=10&type=multiple")
            .then((response) => response.json())
            .then((data) => {
                // Store correct answers temporarily
                const correctAnswers = data.results.map(q => q.correct_answer);
                sessionStorage.setItem("correctAnswers", JSON.stringify(correctAnswers));

                displayQuestions(data.results);
                showLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching questions:", error);
                showLoading(false);
            });
    }

    /*
    LOADING STATE
    */
    function showLoading(isLoading) {
        document.getElementById("loading-container").classList =
            isLoading ? "" : "hidden";
        document.getElementById("question-container").classList =
            isLoading ? "hidden" : "";
    }

    /*
    DISPLAY QUESTIONS
    */
    function displayQuestions(questions) {
        questionContainer.innerHTML = "";
        questions.forEach((question, index) => {
            const questionDiv = document.createElement("div");
            questionDiv.innerHTML = `
                <p>${question.question}</p>
                ${createAnswerOptions(
                    question.correct_answer,
                    question.incorrect_answers,
                    index
                )}
            `;
            questionContainer.appendChild(questionDiv);
        });
    }

    function createAnswerOptions(correctAnswer, incorrectAnswers, index) {
        const allAnswers = [correctAnswer, ...incorrectAnswers].sort(
            () => Math.random() - 0.5
        );

        return allAnswers
            .map(
                (answer) => `
            <label>
                <input type="radio" name="answer${index}" value="${answer}">
                ${answer}
            </label>
        `
            )
            .join("");
    }

    /*
    FORM SUBMISSION HANDLER
    */
    form.addEventListener("submit", handleFormSubmit);

    function handleFormSubmit(event) {
        event.preventDefault();

        let username = usernameInput.value.trim();

        // Use cookie username only if non-empty
        const saved = getCookie("username");
        if (saved && saved.trim() !== "") {
            username = saved;
        }

        // Require username
        if (!username || username.trim() === "") {
            alert("Please enter your name.");
            return;
        }

        // Save username to cookie if new
        if (!getCookie("username") && username.trim() !== "") {
            setCookie("username", username, 7);
        }

        const score = calculateScore();
        saveScore(username, score);
        displayScores();

        fetchQuestions(); // Refresh questions for next game
    }

    /*
    SCORE CALCULATION
    */
    function calculateScore() {
        let score = 0;

        const correctAnswers = JSON.parse(
            sessionStorage.getItem("correctAnswers")
        );

        correctAnswers.forEach((correct, index) => {
            const selected = document.querySelector(
                `input[name="answer${index}"]:checked`
            );
            if (selected && selected.value === correct) {
                score++;
            }
        });

        return score;
    }

    /*
    SCORE SAVING + DISPLAYING
    */
    function saveScore(username, score) {
        let scores = JSON.parse(localStorage.getItem("scores")) || [];

        scores.push({
            username: username,
            score: score,
            date: new Date().toLocaleString()
        });

        localStorage.setItem("scores", JSON.stringify(scores));
    }

    function displayScores() {
        const scores = JSON.parse(localStorage.getItem("scores")) || [];
        const tableBody = document.querySelector("#score-table tbody");

        tableBody.innerHTML = "";

        scores.forEach((entry) => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${entry.username}</td>
                <td>${entry.score}</td>
                <td>${entry.date}</td>
            `;
            tableBody.appendChild(row);
        });
    }

    /*
    NEW PLAYER
    */
    newPlayerButton.addEventListener("click", newPlayer);

    function newPlayer() {
        deleteCookie("username");
        usernameInput.value = "";
        usernameInput.classList.remove("hidden");
        newPlayerButton.classList.add("hidden");
    }
});
