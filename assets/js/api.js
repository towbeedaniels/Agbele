const headers = { 'Content-Type': 'application/json' };

export const api = {
  // News
  listNews: () => fetch('/api/news').then(r => r.json()),
  createNews: (payload) => fetch('/api/news', { method: 'POST', headers, body: JSON.stringify(payload) }).then(r => r.json()),
  updateNews: (id, payload) => fetch(`/api/news/${id}`, { method: 'PUT', headers, body: JSON.stringify(payload) }).then(r => r.json()),
  deleteNews: (id) => fetch(`/api/news/${id}`, { method: 'DELETE' }),

  // Events
  listEvents: () => fetch('/api/events').then(r => r.json()),
  createEvent: (payload) => fetch('/api/events', { method: 'POST', headers, body: JSON.stringify(payload) }).then(r => r.json()),
  updateEvent: (id, payload) => fetch(`/api/events/${id}`, { method: 'PUT', headers, body: JSON.stringify(payload) }).then(r => r.json()),
  deleteEvent: (id) => fetch(`/api/events/${id}`, { method: 'DELETE' }),

  // Members
  listMembers: () => fetch('/api/members').then(r => r.json()),
  createMember: (payload) => fetch('/api/members', { method: 'POST', headers, body: JSON.stringify(payload) }).then(r => r.json()),
  updateMember: (id, payload) => fetch(`/api/members/${id}`, { method: 'PUT', headers, body: JSON.stringify(payload) }).then(r => r.json()),
  deleteMember: (id) => fetch(`/api/members/${id}`, { method: 'DELETE' }),

  // Messages
  listMessages: () => fetch('/api/messages').then(r => r.json()),
  createMessage: (payload) => fetch('/api/messages', { method: 'POST', headers, body: JSON.stringify(payload) }).then(r => r.json()),
  deleteMessage: (id) => fetch(`/api/messages/${id}`, { method: 'DELETE' })
};


