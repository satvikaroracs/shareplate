// Small helper for calling the SharePlate API
const API = '/api';

function getToken() { return localStorage.getItem('token'); }

function getUser() {
  try { return JSON.parse(localStorage.getItem('user')); }
  catch (e) { return null; }
}

async function api(path, options = {}) {
  const res = await fetch(API + path, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(getToken() ? { Authorization: 'Bearer ' + getToken() } : {}),
      ...(options.headers || {})
    }
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    alert(data.message || 'Something went wrong');
    throw new Error(data.message);
  }
  return data;
}

function logout() {
  localStorage.clear();
  window.location.href = 'login.html';
}

// Protect a page: only the given role may view it
function requireRole(role) {
  const user = getUser();
  if (!user) { window.location.href = 'login.html'; return null; }
  if (user.role !== role) { window.location.href = user.role + '.html'; return null; }
  return user;
}
