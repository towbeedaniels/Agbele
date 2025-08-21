import { STORAGE_KEYS, getItems, saveItems } from './storage.js';
import { api } from './api.js';
import { formatDate } from './common.js';

const ADMIN_CRED_KEY = 'community_admin_credentials';
const ADMIN_AUTH_SESSION = 'community_admin_authed';
const DEFAULT_CREDS = { username: 'admin', password: 'admin123' };

function ensureCreds() {
  if (!localStorage.getItem(ADMIN_CRED_KEY)) {
    localStorage.setItem(ADMIN_CRED_KEY, JSON.stringify(DEFAULT_CREDS));
  }
}

function checkCreds(username, password) {
  try {
    const saved = JSON.parse(localStorage.getItem(ADMIN_CRED_KEY) || '{}');
    return username.trim() === (saved.username || '').trim() && password === (saved.password || '');
  } catch {
    return false;
  }
}

function showPanel() {
  document.getElementById('admin-gate').classList.add('d-none');
  document.getElementById('admin-panel').classList.remove('d-none');
}

function handleGate() {
  ensureCreds();
  const form = document.getElementById('login-form');
  if (!form) return;
  // If already authenticated this session, show panel immediately
  if (sessionStorage.getItem(ADMIN_AUTH_SESSION) === 'true') {
    showPanel();
    renderAll();
  }
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const username = document.getElementById('admin-username').value;
    const password = document.getElementById('admin-password').value;
    const error = document.getElementById('login-error');
    error?.classList.add('d-none');
    if (checkCreds(username, password)) {
      // mark session as authenticated and prevent returning to pre-auth state
      sessionStorage.setItem(ADMIN_AUTH_SESSION, 'true');
      history.replaceState({ authed: true }, '', location.href);
      showPanel();
      renderAll();
    } else {
      if (error) error.classList.remove('d-none');
    }
  });

  const resetBtn = document.getElementById('reset-creds');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      if (!confirm('Reset admin credentials to default?')) return;
      localStorage.setItem(ADMIN_CRED_KEY, JSON.stringify(DEFAULT_CREDS));
      const error = document.getElementById('login-error');
      error?.classList.add('d-none');
      const u = document.getElementById('admin-username');
      const p = document.getElementById('admin-password');
      if (u) u.value = '';
      if (p) p.value = '';
      alert('Credentials reset to default (admin / admin123)');
    });
  }

  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      // clear auth session and redirect (replace) to block back navigation to authed view
      sessionStorage.removeItem(ADMIN_AUTH_SESSION);
      document.getElementById('admin-panel').classList.add('d-none');
      document.getElementById('admin-gate').classList.remove('d-none');
      const u = document.getElementById('admin-username');
      const p = document.getElementById('admin-password');
      if (u) u.value = '';
      if (p) p.value = '';
      const error = document.getElementById('login-error');
      error?.classList.add('d-none');
      // Replace current history entry to avoid navigating back to an authed state
      location.replace('admin.html');
    });
  }
}

// Rendering helpers
async function renderNews() {
  const container = document.getElementById('admin-news');
  const items = await api.listNews();
  container.innerHTML = items.map(n => `
    <div class="col-12">
      <div class="card">
        <div class="card-body">
          <div class="d-flex align-items-start justify-content-between">
            <div class="me-3">
              <h3 class="h6 mb-1">${n.title}</h3>
              <div class="text-muted small">${formatDate(n.date)} · ${n.author}</div>
            </div>
            <div class="btn-group btn-group-sm">
              <button class="btn btn-outline-secondary" data-type="news" data-id="${n.id}" data-action="edit"><i class="bi bi-pencil"></i></button>
              <button class="btn btn-outline-danger" data-type="news" data-id="${n.id}" data-action="delete"><i class="bi bi-trash"></i></button>
            </div>
          </div>
          <p class="mb-0 mt-2">${n.content}</p>
        </div>
      </div>
    </div>
  `).join('');
}

async function renderEvents() {
  const container = document.getElementById('admin-events');
  const items = await api.listEvents();
  container.innerHTML = items.map(e => `
    <div class="col-12">
      <div class="card">
        <div class="card-body d-flex align-items-start justify-content-between">
          <div class="me-3">
            <h3 class="h6 mb-1">${e.title}</h3>
            <div class="text-muted small">${e.date} ${e.time ? '· ' + e.time : ''} ${e.location ? '· ' + e.location : ''}</div>
            <p class="mb-0 mt-2">${e.description || ''}</p>
          </div>
          <div class="btn-group btn-group-sm">
            <button class="btn btn-outline-secondary" data-type="events" data-id="${e.id}" data-action="edit"><i class="bi bi-pencil"></i></button>
            <button class="btn btn-outline-danger" data-type="events" data-id="${e.id}" data-action="delete"><i class="bi bi-trash"></i></button>
          </div>
        </div>
      </div>
    </div>
  `).join('');
}

async function renderMembers() {
  const container = document.getElementById('admin-members');
  const items = await api.listMembers();
  container.innerHTML = items.map(m => `
    <div class="col-12">
      <div class="card">
        <div class="card-body d-flex align-items-start justify-content-between">
          <div class="me-3 d-flex gap-3">
            <img class="avatar" src="${m.avatar || 'https://placehold.co/96x96/1F2937/F3F4F6?text=?'}" alt="${m.name}">
            <div>
              <h3 class="h6 mb-1">${m.name}</h3>
              <p class="mb-0 small text-muted">${m.bio || ''}</p>
            </div>
          </div>
          <div class="btn-group btn-group-sm">
            <button class="btn btn-outline-secondary" data-type="members" data-id="${m.id}" data-action="edit"><i class="bi bi-pencil"></i></button>
            <button class="btn btn-outline-danger" data-type="members" data-id="${m.id}" data-action="delete"><i class="bi bi-trash"></i></button>
          </div>
        </div>
      </div>
    </div>
  `).join('');
}

async function renderMessages() {
  const container = document.getElementById('admin-messages');
  const items = await api.listMessages();
  if (items.length === 0) {
    container.innerHTML = '<div class="col-12"><div class="alert alert-light border">No messages yet.</div></div>';
    return;
  }
  container.innerHTML = items.map(msg => `
    <div class="col-12">
      <div class="card">
        <div class="card-body">
          <div class="d-flex align-items-center justify-content-between">
            <h3 class="h6 mb-0">${msg.name} <span class="text-muted small">&lt;${msg.email}&gt;</span></h3>
            <div class="btn-group btn-group-sm">
              <button class="btn btn-outline-danger" data-type="messages" data-id="${msg.id}" data-action="delete"><i class="bi bi-trash"></i></button>
            </div>
          </div>
          <div class="text-muted small mb-2">${formatDate(msg.date)}</div>
          <p class="mb-0">${msg.message}</p>
        </div>
      </div>
    </div>
  `).join('');
}

function renderAll() {
  renderNews();
  renderEvents();
  renderMembers();
  renderMessages();
}

// Add buttons
document.getElementById('add-news')?.addEventListener('click', () => openEditor('news'));
document.getElementById('add-event')?.addEventListener('click', () => openEditor('events'));
document.getElementById('add-member')?.addEventListener('click', () => openEditor('members'));
document.getElementById('clear-messages')?.addEventListener('click', async () => {
  if (!confirm('Clear all messages?')) return;
  const items = await api.listMessages();
  await Promise.all(items.map(m => api.deleteMessage(m.id)));
  renderMessages();
});

// Listeners for edit/delete
document.addEventListener('click', (e) => {
  const btn = e.target.closest('[data-action]');
  if (!btn) return;
  const action = btn.getAttribute('data-action');
  const type = btn.getAttribute('data-type');
  const id = btn.getAttribute('data-id');
  if (action === 'delete') return handleDelete(type, id);
  if (action === 'edit') return openEditor(type, id);
});

async function handleDelete(type, id) {
  if (!confirm('Delete this item?')) return;
  if (type === 'news') await api.deleteNews(id);
  if (type === 'events') await api.deleteEvent(id);
  if (type === 'members') await api.deleteMember(id);
  if (type === 'messages') await api.deleteMessage(id);
  renderByType(type);
}

function renderByType(type) {
  if (type === 'news') return renderNews();
  if (type === 'events') return renderEvents();
  if (type === 'members') return renderMembers();
  if (type === 'messages') return renderMessages();
}

// Modal Editor
const editModal = new bootstrap.Modal(document.getElementById('editModal'));
const editForm = document.getElementById('edit-form');
let currentEdit = { type: null, id: null };

async function openEditor(type, id = null) {
  currentEdit = { type, id };
  document.getElementById('edit-title').textContent = (id ? 'Edit ' : 'Add ') + type.slice(0,1).toUpperCase() + type.slice(1);
  const body = document.getElementById('edit-body');
  let existing = {};
  if (id) {
    if (type === 'news') existing = (await api.listNews()).find(x => x.id === id) || {};
    if (type === 'events') existing = (await api.listEvents()).find(x => x.id === id) || {};
    if (type === 'members') existing = (await api.listMembers()).find(x => x.id === id) || {};
  }

  if (type === 'news') {
    body.innerHTML = `
      <div class="mb-3">
        <label class="form-label">Title</label>
        <input class="form-control" id="f-title" value="${existing.title || ''}" required>
      </div>
      <div class="mb-3">
        <label class="form-label">Content</label>
        <textarea class="form-control" id="f-content" rows="5" required>${existing.content || ''}</textarea>
      </div>
      <div class="row g-3">
        <div class="col-md-6">
          <label class="form-label">Date</label>
          <input type="date" class="form-control" id="f-date" value="${(existing.date || '').slice(0,10)}" required>
        </div>
        <div class="col-md-6">
          <label class="form-label">Author</label>
          <input class="form-control" id="f-author" value="${existing.author || ''}" required>
        </div>
      </div>`;
  }

  if (type === 'events') {
    body.innerHTML = `
      <div class="mb-3">
        <label class="form-label">Title</label>
        <input class="form-control" id="f-title" value="${existing.title || ''}" required>
      </div>
      <div class="row g-3">
        <div class="col-md-6">
          <label class="form-label">Date</label>
          <input type="date" class="form-control" id="f-date" value="${existing.date || ''}" required>
        </div>
        <div class="col-md-6">
          <label class="form-label">Time</label>
          <input type="time" class="form-control" id="f-time" value="${existing.time || ''}">
        </div>
      </div>
      <div class="mb-3 mt-3">
        <label class="form-label">Location</label>
        <input class="form-control" id="f-location" value="${existing.location || ''}">
      </div>
      <div class="mb-3">
        <label class="form-label">Description</label>
        <textarea class="form-control" id="f-description" rows="4">${existing.description || ''}</textarea>
      </div>`;
  }

  if (type === 'members') {
    body.innerHTML = `
      <div class="mb-3">
        <label class="form-label">Name</label>
        <input class="form-control" id="f-name" value="${existing.name || ''}" required>
      </div>
      <div class="mb-3">
        <label class="form-label">Bio</label>
        <textarea class="form-control" id="f-bio" rows="3">${existing.bio || ''}</textarea>
      </div>
      <div class="mb-3">
        <label class="form-label">Avatar URL</label>
        <input class="form-control" id="f-avatar" value="${existing.avatar || ''}">
      </div>`;
  }

  editModal.show();
}

editForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const { type, id } = currentEdit;
  let updated;

  if (type === 'news') {
    updated = {
      id: id || crypto.randomUUID(),
      title: document.getElementById('f-title').value.trim(),
      content: document.getElementById('f-content').value.trim(),
      date: document.getElementById('f-date').value,
      author: document.getElementById('f-author').value.trim(),
    };
  }
  if (type === 'events') {
    updated = {
      id: id || crypto.randomUUID(),
      title: document.getElementById('f-title').value.trim(),
      date: document.getElementById('f-date').value,
      time: document.getElementById('f-time').value,
      location: document.getElementById('f-location').value.trim(),
      description: document.getElementById('f-description').value.trim(),
    };
  }
  if (type === 'members') {
    updated = {
      id: id || crypto.randomUUID(),
      name: document.getElementById('f-name').value.trim(),
      bio: document.getElementById('f-bio').value.trim(),
      avatar: document.getElementById('f-avatar').value.trim(),
    };
  }

  if (type === 'news') id ? await api.updateNews(id, updated) : await api.createNews(updated);
  if (type === 'events') id ? await api.updateEvent(id, updated) : await api.createEvent(updated);
  if (type === 'members') id ? await api.updateMember(id, updated) : await api.createMember(updated);
  editModal.hide();
  renderByType(type);
});

document.addEventListener('DOMContentLoaded', handleGate);
// Fallback in case the DOM event was missed
if (document.readyState === 'complete' || document.readyState === 'interactive') {
  try { handleGate(); } catch {}
}

// Ensure that navigating back to admin page enforces auth state (handles bfcache)
window.addEventListener('pageshow', () => {
  const authed = sessionStorage.getItem(ADMIN_AUTH_SESSION) === 'true';
  const gate = document.getElementById('admin-gate');
  const panel = document.getElementById('admin-panel');
  if (gate && panel) {
    if (authed) {
      panel.classList.remove('d-none');
      gate.classList.add('d-none');
    } else {
      panel.classList.add('d-none');
      gate.classList.remove('d-none');
    }
  }
});


