const api = 'https://justus-backend.onrender.com';

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
  if (res.ok) location.href = 'messages.html';
  else alert('Signup failed');
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
  if (res.ok) location.href = 'messages.html';
  else alert('Login failed');
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
  } else alert('Message failed');
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
  location.href = 'login.html';
}

function logout() {
  fetch(`${api}/logout`, {
    method: 'POST',
    credentials: 'include'
  }).then(() => location.href = 'login.html');
}
