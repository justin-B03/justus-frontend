const api = 'https://justus-backend.onrender.com';
const errorEl = document.getElementById('errorMessage');

document.addEventListener('DOMContentLoaded', showUsername);

function showError(msg) {
  if (errorEl) {
    errorEl.textContent = msg;
    errorEl.style.display = 'block';
  }
}

async function signup() {
  const form = document.getElementById('loginForm');
  const res = await fetch(`${api}/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({
      username: form.username.value,
      password: form.password.value
    })
  });
  if (res.ok) {
    location.href = 'landing.html';
    errorEl.style.display = 'none';
  }
  else {
    showError('Signup failed. Please try again.');
  }
}

document.getElementById('loginForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const form = e.target;
  const res = await fetch(`${api}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({
      username: form.username.value,
      password: form.password.value
    })
  });
  if (res.ok) {
    location.href = 'landing.html';
    errorEl.style.display = 'none';
  }
  else {
    showError('Login failed. Please check your credentials.');
  }
});

document.getElementById('messageForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const form = e.target;
  const res = await fetch(`${api}/message`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({
      to: form.to.value,
      message: form.message.value,
      type: form.type?.value || 'note'
    })
  });
  if (res.ok) {
    form.reset();
    loadInbox();
  } else showError('Failed to send message. Please try again.');
});

async function loadInbox() {
  const res = await fetch(`${api}/inbox`, { credentials: 'include' });
  if (!res.ok) return;
  const inbox = await res.json();
  const container = document.getElementById('inbox');
  container.innerHTML = inbox.map(m => `
    <div><b>From:</b> ${m.from}<br>${m.message}</div><hr>
  `).join('');
}
loadInbox();

function goToLogin() {
  location.href = 'index.html';
}

function goToMessages() {
  location.href = 'messages.html';
}

function logout() {
  fetch(`${api}/logout`, {
    method: 'POST',
    credentials: 'include'
  }).then(() => location.href = 'index.html');
}

async function showUsername() {
  const res = await fetch(`${api}/me`, { credentials: 'include' });
  if (res.ok) {
    const data = await res.json();
    const el = document.getElementById('usernameDisplay');
    if (el) el.textContent = data.username;
  }
}