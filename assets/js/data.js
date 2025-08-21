import { STORAGE_KEYS, seedIfEmpty } from './storage.js';

const defaultNews = [
  {
    id: crypto.randomUUID(),
    title: 'Welcome to Our Community Hub',
    content: 'This website is the central place for updates, events, and connections. Explore the pages to learn more and get involved.',
    date: new Date().toISOString(),
    author: 'Community Team'
  },
  {
    id: crypto.randomUUID(),
    title: 'Monthly Cleanup Drive',
    content: 'Join us this Saturday for a neighborhood cleanup and picnic afterwards at the park.',
    date: new Date(Date.now() - 86400000 * 7).toISOString(),
    author: 'Events Committee'
  }
];

const defaultEvents = [
  {
    id: crypto.randomUUID(),
    title: 'Community Meeting',
    date: new Date(Date.now() + 86400000 * 3).toISOString().slice(0,10),
    time: '18:00',
    location: 'Town Hall',
    description: 'Monthly community meeting to discuss initiatives and updates.'
  },
  {
    id: crypto.randomUUID(),
    title: 'Park Potluck',
    date: new Date(Date.now() + 86400000 * 10).toISOString().slice(0,10),
    time: '12:30',
    location: 'Central Park',
    description: 'Bring a dish to share. Games and music provided.'
  }
];

const defaultMembers = [
  {
    id: crypto.randomUUID(),
    name: 'Alex Johnson',
    bio: 'Organizer and long-time resident passionate about community building.',
    avatar: 'https://placehold.co/96x96/1F2937/F3F4F6?text=AJ'
  },
  {
    id: crypto.randomUUID(),
    name: 'Priya Singh',
    bio: 'Leads sustainability projects and neighborhood events.',
    avatar: 'https://placehold.co/96x96/1F2937/F3F4F6?text=PS'
  },
  {
    id: crypto.randomUUID(),
    name: 'Miguel Torres',
    bio: 'Volunteer coordinator and youth programs mentor.',
    avatar: 'https://placehold.co/96x96/1F2937/F3F4F6?text=MT'
  }
];

seedIfEmpty(STORAGE_KEYS.news, defaultNews);
seedIfEmpty(STORAGE_KEYS.events, defaultEvents);
seedIfEmpty(STORAGE_KEYS.members, defaultMembers);


