const api = 'https://justus-backend.onrender.com';
const errorEl = document.getElementById('errorMessage');

document.getElementById("year").textContent = new Date().getFullYear();

document.addEventListener('DOMContentLoaded', () => {
  showUsername();
  loadPendingRequests();
  loadFriendList();
  loadInbox();
});

document.getElementById('friendRequestForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const form = e.target;
  const res = await fetch(`${api}/friend-request`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ to: form.to.value })
  });

  const msg = document.getElementById('friendRequestMessage');
  if (res.ok) {
    msg.textContent = 'Friend request sent!';
    form.reset();
    loadPendingRequests();
  } else {
    const error = await res.text();
    msg.textContent = error;
  }
});

async function loadPendingRequests() {
  const res = await fetch(`${api}/friend-requests`, { credentials: 'include' });
  if (!res.ok) return;

  const requests = await res.json();
  const container = document.getElementById('incomingRequests');
  if (!requests.length) {
    container.innerHTML = '<p>No pending requests</p>';
    return;
  }

  container.innerHTML = requests.map(r => `
    <div>
      <b>${r.fromUsername}</b> wants to be friends.
      <button onclick="respondFriendRequest(${r.id}, 'accepted')">Accept</button>
      <button onclick="respondFriendRequest(${r.id}, 'rejected')">Reject</button>
    </div>
  `).join('');
}

async function loadFriendList() {
  const res = await fetch(`${api}/friends`, { credentials: 'include' });
  if (!res.ok) return;

  const friends = await res.json();
  const list = document.getElementById('friendList');

  if (!friends.length) {
    list.innerHTML = '<li>No friends yet.</li>';
    return;
  }

  list.innerHTML = friends.map(f => `
    <li class="friend-entry">
      <span>${f.username}</span>
      <span class="status accepted">✓ Friend</span>
    </li>
  `).join('');
}

async function respondFriendRequest(requestId, action) {
  const res = await fetch(`${api}/friend-request/respond`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ requestId, action })
  });

  if (res.ok) {
    loadPendingRequests();
  } else {
    alert('Error processing request');
  }
}

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
      emotion: form.emotion.value,
      message: form.message.value,
      type: form.type?.value || 'note'
    })
  });
  if (res.ok) {
    form.reset();
    loadInbox();
  } else showError('Failed to send message. Please try again.');
});

const emotionMap = {
  happy: "😊 Happy",
  love: "❤️ Love",
  thankful: "🙏 Thankful",
  sad: "😢 Sad",
  angry: "😠 Angry",
  excited: "🎉 Excited",
  worried: "😟 Worried",
  note: "🗨️ Note"
};

async function loadInbox() {
  const res = await fetch(`${api}/inbox`, { credentials: 'include' });
  if (!res.ok) return;

  const inbox = await res.json();
  const container = document.getElementById('inbox');

  container.innerHTML = inbox.map(m => {
    const emotionLabel = emotionMap[m.emotion] || m.emotion;

    return `
      <div class="message-card">
        <div><b>From:</b> ${m.from}</div>
        <div><b>Emotion:</b> ${emotionLabel}</div>
        <div>${m.message}</div>
      </div>
    `;
  }).join('');
}
loadInbox();

function goToLogin() {
  location.href = 'index.html';
}

function goToMessages() {
  location.href = 'messages.html';
}

function goToLanding() {
  location.href = 'landing.html';
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