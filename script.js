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

function loadScores() {
  try {
    const raw = localStorage.getItem('trivia_scores');
    return raw ? JSON.parse(raw) : [];
  } catch (e) { console.error('Error parsing scores from localStorage', e); return []; }
}

function saveScores(scores) {
  localStorage.setItem('trivia_scores', JSON.stringify(scores));
}

function displayScores() {
  const tbody = document.querySelector('#score-table tbody');
  tbody.innerHTML = '';
  const scores = loadScores();
  if (scores.length === 0) {
    const tr = document.createElement('tr');
    tr.innerHTML = '<td colspan="3">No scores yet</td>';
    tbody.appendChild(tr);
    return;
  }
  scores.sort((a,b) => b.score - a.score);
  scores.forEach(({name, score, date}) => {
    const tr = document.createElement('tr');
    const nameTd = document.createElement('td'); nameTd.textContent = name;
    const scoreTd = document.createElement('td'); scoreTd.textContent = String(score);
    const dateTd = document.createElement('td'); dateTd.textContent = date;
    tr.append(nameTd, scoreTd, dateTd);
    tbody.appendChild(tr);
  });
}

function calculateScore() {
  const questionContainer = document.getElementById('question-container');
  const questionDivs = Array.from(questionContainer.children);
  let correct = 0;
  questionDivs.forEach((qDiv, idx) => {
    const selector = `input[name="answer${idx}"]:checked`;
    const selected = qDiv.querySelector(selector);
    if (selected && selected.dataset && selected.dataset.correct === 'true') correct++;
  });
  return correct;
}

function saveScore(name, score) {
  const scores = loadScores();
  const entry = { name, score, date: new Date().toLocaleString() };
  scores.push(entry);
  saveScores(scores);
}

function clearErrors() {
  const errorMessages = document.querySelectorAll('.error-message');
  errorMessages.forEach(e => { e.textContent = ''; e.classList.remove('error-visible'); });
}

function showError(fieldName, message) {
  const errorFieldId = `${fieldName}Error`;
  const errorField = document.getElementById(errorFieldId);
  if (!errorField) return;
  errorField.textContent = message;
  errorField.classList.add('error-visible');
}

function handleFormSubmit(event) {
  event.preventDefault();
  clearErrors();
  const usernameInput = document.getElementById('username');
  let username = getCookie('trivia_username');

  if (!username) {
    const nameVal = (usernameInput.value || '').trim();
    if (!nameVal) {
      showError('username', 'Please enter your name');
      return;
    }
    username = nameVal;
    setCookie('trivia_username', username, 30);
    checkUsername();
  }

  const score = calculateScore();
  saveScore(username, score);
  displayScores();
  fetchQuestions();
}

function newPlayer() {
  deleteCookie('trivia_username');
  sessionStorage.removeItem('currentAnswers');
  document.getElementById('username').value = '';
  document.getElementById('username').classList.remove('hidden');
  document.getElementById('username').removeAttribute('aria-hidden');
  document.getElementById('new-player').classList.add('hidden');
  document.getElementById('new-player').setAttribute('aria-hidden','true');
  checkUsername();
}

document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('trivia-form');
  const newPlayerButton = document.getElementById('new-player');
  form.addEventListener('submit', handleFormSubmit);
  newPlayerButton.addEventListener('click', newPlayer);

  checkUsername();
  fetchQuestions();
  displayScores();
});
