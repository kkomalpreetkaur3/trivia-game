// script.js — initial fetch skeleton
function showLoading(isLoading) {
  document.getElementById("loading-container").classList = isLoading ? "" : "hidden";
  document.getElementById("question-container").classList = isLoading ? "hidden" : "";
}

function fetchQuestions() {
  showLoading(true);
  fetch("https://opentdb.com/api.php?amount=10&type=multiple")
    .then(res => res.json())
    .then(data => {
      // placeholder for rendering
      console.log("questions fetched", data);
      showLoading(false);
    })
    .catch(err => {
      console.error("fetch error", err);
      showLoading(false);
    });
}

document.addEventListener("DOMContentLoaded", () => {
  fetchQuestions();
});
