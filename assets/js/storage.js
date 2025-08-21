export const STORAGE_KEYS = {
  news: 'community_news',
  events: 'community_events',
  members: 'community_members',
  messages: 'community_messages'
};

export function getItems(key) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.error('Failed to read from localStorage', key, err);
    return [];
  }
}

export function saveItems(key, items) {
  try {
    localStorage.setItem(key, JSON.stringify(items));
  } catch (err) {
    console.error('Failed to write to localStorage', key, err);
  }
}

export function seedIfEmpty(key, defaults) {
  const existing = getItems(key);
  if (!Array.isArray(existing) || existing.length === 0) {
    saveItems(key, defaults);
  }
}


