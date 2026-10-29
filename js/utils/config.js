// js/utils/config.js
// All game constants, theme colors, and runtime settings

import difficultyData from '../../config/difficulty.json';

export const THEME = {
  BG_PRIMARY: '#0a0a0f',
  BG_SECONDARY: '#12121a',
  BLOCK_VALID: '#00ff41',
  BLOCK_BROKEN: '#ff0040',
  BLOCK_MINING: '#ffaa00',
  TEXT_HASH: '#00f0ff',
  ACCENT_PURPLE: '#bf00ff',
  ACCENT_CYAN: '#00f0ff',
  UI_BORDER: '#1a1a2e',
  NETWORK_BAR: '#ff6600',
  GHOST_WHITE: '#e0e0e0',
  AMBER_WARNING: '#ffaa00',
};

export const GAME_CONSTANTS = {
  TOTAL_BLOCKS: 10,
  TAMPER_BLOCK_INDEX: 3, // 0-based => Block #4
  ORIGINAL_TX: 'Transfer 500 ETH from Vault → Treasury',
  TAMPERED_TX: 'Transfer 500 ETH from Vault → YOUR_WALLET',
  HASH_DIFFICULTY_PREFIX: '0000',
  COMBO_THRESHOLD: 3,
  COMBO_MULTIPLIER_BASE: 1.5,
  POWERUP_HASHPOWER_COST: 50,
  POWERUP_HASHPOWER_DURATION: 5000,
  POWERUP_BRIBE_COST: 100,
  POINTS_PERFECT_HIT: 200,
  POINTS_CLOSE_HIT: 80,
  POINTS_BLOCK_MINED: 500,
  TIME_PENALTY_MISS: 3,
  COINS_PER_PERFECT: 25,
  COINS_PER_CLOSE: 10,
};

export const DIFFICULTY = difficultyData.levels;

export function getLevelConfig(level = 1) {
  return DIFFICULTY[String(level)] || DIFFICULTY['1'];
}
