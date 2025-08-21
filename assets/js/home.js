import { STORAGE_KEYS, getItems } from './storage.js';
import { formatDate } from './common.js';

function renderNews() {
  const container = document.getElementById('home-news');
  const news = getItems(STORAGE_KEYS.news)
    .slice()
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 3);

  if (news.length === 0) {
    container.innerHTML = '<p class="text-muted">No news yet. Check back soon.</p>';
    return;
  }

  container.innerHTML = news.map(n => `
    <div class="d-flex align-items-start mb-3">
      <div class="flex-grow-1">
        <h3 class="h6 mb-1">${n.title}</h3>
        <div class="text-muted small mb-1">${formatDate(n.date)} · ${n.author}</div>
        <p class="mb-0">${n.content.substring(0, 120)}${n.content.length > 120 ? '…' : ''}</p>
      </div>
    </div>
  `).join('');
}

function renderEvents() {
  const container = document.getElementById('home-events');
  const today = new Date().toISOString().slice(0,10);
  const events = getItems(STORAGE_KEYS.events)
    .filter(e => e.date >= today)
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 3);

  if (events.length === 0) {
    container.innerHTML = '<p class="text-muted">No upcoming events scheduled.</p>';
    return;
  }

  container.innerHTML = events.map(e => `
    <div class="d-flex align-items-start mb-3">
      <span class="badge rounded-pill badge-brand me-3">${formatDate(e.date)}</span>
      <div class="flex-grow-1">
        <h3 class="h6 mb-1">${e.title}</h3>
        <div class="text-muted small">${e.time || ''} ${e.location ? '· ' + e.location : ''}</div>
        <p class="mb-0">${e.description.substring(0, 120)}${e.description.length > 120 ? '…' : ''}</p>
      </div>
    </div>
  `).join('');
}

document.addEventListener('DOMContentLoaded', () => {
  renderNews();
  renderEvents();
});


