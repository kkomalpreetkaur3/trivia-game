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

// --- Cookie helpers ---
function setCookie(name, value, days) {
  const expires = days ? "; expires=" + new Date(Date.now() + days * 864e5).toUTCString() : "";
  document.cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value || "")}${expires}; path=/`;
}

function getCookie(name) {
  const cookies = document.cookie.split('; ').map(c => c.split('='));
  for (const [k, v] of cookies) {
    if (decodeURIComponent(k) === name) return decodeURIComponent(v || '');
  }
  return undefined;
}

function deleteCookie(name) {
  document.cookie = `${encodeURIComponent(name)}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`;
}

// UI helpers
function checkUsername() {
  const usernameInput = document.getElementById('username');
  const newPlayerBtn = document.getElementById('new-player');
  const stored = getCookie('trivia_username');
  if (stored) {
    usernameInput.classList.add('hidden');
    usernameInput.setAttribute('aria-hidden', 'true');
    newPlayerBtn.classList.remove('hidden');
    newPlayerBtn.removeAttribute('aria-hidden');
  } else {
    usernameInput.classList.remove('hidden');
    usernameInput.removeAttribute('aria-hidden');
    newPlayerBtn.classList.add('hidden');
    newPlayerBtn.setAttribute('aria-hidden', 'true');
  }
}
