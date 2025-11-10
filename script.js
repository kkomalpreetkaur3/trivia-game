// Initial fetch skeleton
function showLoading(isLoading) {
  document.getElementById("loading-container").classList = isLoading ? "" : "hidden";
  document.getElementById("question-container").classList = isLoading ? "hidden" : "";
}

function createQuestionElement(questionObj, index) {
  const wrapper = document.createElement('div');
  const p = document.createElement('p');
  p.textContent = questionObj.question;
  wrapper.appendChild(p);

  const answers = [questionObj.correct_answer, ...questionObj.incorrect_answers]
    .map(a => ({ text: a }))
    .sort(() => Math.random() - 0.5);

  answers.forEach(ans => {
    const label = document.createElement('label');
    const input = document.createElement('input');
    input.type = 'radio';
    input.name = `answer${index}`;
    input.value = ans.text;
    if (ans.text === questionObj.correct_answer) input.dataset.correct = 'true';
    label.appendChild(input);
    label.append(document.createTextNode(ans.text));
    wrapper.appendChild(label);
  });

  return wrapper;
}

function fetchQuestions() {
  showLoading(true);
  fetch('https://opentdb.com/api.php?amount=10&type=multiple')
    .then(r => r.json())
    .then(data => {
      const questions = data.results || [];
      const container = document.getElementById('question-container');
      container.innerHTML = '';
      questions.forEach((q, i) => {
        const qEl = createQuestionElement(q, i);
        container.appendChild(qEl);
      });
      showLoading(false);
    })
    .catch(err => {
      console.error('Error fetching questions:', err);
      showLoading(false);
    });
}

document.addEventListener("DOMContentLoaded", () => {
  fetchQuestions();
});