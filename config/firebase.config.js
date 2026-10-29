// config/firebase.config.js
// Fill in your Firebase credentials to enable cloud leaderboard sync.
// If left as-is, the game falls back to localStorage + server JSON.

export const firebaseConfig = {
  apiKey: '',
  authDomain: '',
  projectId: '',
  storageBucket: '',
  messagingSenderId: '',
  appId: '',
};

export const isFirebaseConfigured = () =>
  Object.values(firebaseConfig).every((v) => v && v.length > 0);
