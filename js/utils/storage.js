// js/utils/storage.js
// Triple-layer storage: Server API + BroadcastChannel + localStorage

const BC_CHANNEL_NAME = 'chain_heist_channel';
let broadcastChannel = null;
let onMessageCallbacks = [];

// ── BroadcastChannel (same-machine zero-config sync) ──
function getBroadcastChannel() {
  if (!broadcastChannel && typeof BroadcastChannel !== 'undefined') {
    broadcastChannel = new BroadcastChannel(BC_CHANNEL_NAME);
    broadcastChannel.onmessage = (ev) => {
      onMessageCallbacks.forEach((cb) => cb(ev.data));
    };
  }
  return broadcastChannel;
}

export function broadcastEvent(type, payload) {
  const bc = getBroadcastChannel();
  if (bc) bc.postMessage({ type, payload, ts: Date.now() });
  // Also mirror to localStorage for maximum compat
  try {
    localStorage.setItem('chain_heist_last_event', JSON.stringify({ type, payload, ts: Date.now() }));
  } catch {}
}

export function onBroadcast(callback) {
  getBroadcastChannel();
  onMessageCallbacks.push(callback);
  // Also listen to localStorage changes (cross-tab without BroadcastChannel)
  window.addEventListener('storage', (e) => {
    if (e.key === 'chain_heist_last_event' && e.newValue) {
      try { callback(JSON.parse(e.newValue)); } catch {}
    }
  });
}

// ── localStorage leaderboard ──
const LS_KEY = 'chain_heist_leaderboard';

export function getLocalLeaderboard() {
  try {
    return JSON.parse(localStorage.getItem(LS_KEY) || '[]');
  } catch { return []; }
}

export function saveLocalScore(entry) {
  const lb = getLocalLeaderboard();
  lb.push(entry);
  lb.sort((a, b) => b.score - a.score);
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(lb.slice(0, 100)));
  } catch {}
  broadcastEvent('leaderboard:update', { leaderboard: lb.slice(0, 20), newEntry: entry });
  return lb;
}

// ── Server API ──
const API_BASE = window.location.origin;

export async function fetchLeaderboard() {
  try {
    const res = await fetch(`${API_BASE}/api/leaderboard`);
    if (res.ok) return await res.json();
  } catch {}
  // Fallback to localStorage
  return getLocalLeaderboard().slice(0, 20);
}

export async function submitScore(entry) {
  // Always save locally first
  saveLocalScore(entry);

  try {
    const res = await fetch(`${API_BASE}/api/leaderboard`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(entry),
    });
    if (res.ok) {
      const data = await res.json();
      return data;
    }
  } catch {}

  // Return local rank
  const lb = getLocalLeaderboard();
  const rank = lb.findIndex((e) => e.score === entry.score && e.name === entry.name) + 1;
  return { rank: rank || lb.length, entry };
}

// ── Socket.io connection helper ──
let socketInstance = null;

export async function getSocket() {
  if (socketInstance) return socketInstance;
  try {
    const { io } = await import('socket.io-client');
    socketInstance = io(API_BASE, { transports: ['websocket', 'polling'] });
    return socketInstance;
  } catch {
    return null;
  }
}
