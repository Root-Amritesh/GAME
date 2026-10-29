// js/systems/Scoring.js
// Score calculation, combo system, and run hash generation

import { GAME_CONSTANTS } from '../utils/config.js';
import { hashSync } from '../utils/crypto.js';

export class Scoring {
  constructor(level) {
    this.level = level;
    this.score = 0;
    this.combo = 0;
    this.maxCombo = 0;
    this.coins = 0;
    this.blocksMinedCount = 0;
    this.perfectHits = 0;
    this.closeHits = 0;
    this.misses = 0;
    this.totalBlocksToMine = 0;
    this.startTime = 0;
    this.endTime = 0;
    this.events = [];
  }

  start(totalBlocks) {
    this.totalBlocksToMine = totalBlocks;
    this.startTime = Date.now();
  }

  recordHit(type) {
    if (type === 'perfect') {
      this.combo++;
      this.perfectHits++;
      const multiplier = this.combo >= GAME_CONSTANTS.COMBO_THRESHOLD
        ? GAME_CONSTANTS.COMBO_MULTIPLIER_BASE + (this.combo - GAME_CONSTANTS.COMBO_THRESHOLD) * 0.25
        : 1;
      const points = Math.round(GAME_CONSTANTS.POINTS_PERFECT_HIT * multiplier);
      this.score += points;
      this.coins += GAME_CONSTANTS.COINS_PER_PERFECT;
      this.events.push({ type: 'perfect', points, combo: this.combo, time: Date.now() });
    } else if (type === 'close') {
      this.combo++;
      this.closeHits++;
      const multiplier = this.combo >= GAME_CONSTANTS.COMBO_THRESHOLD
        ? GAME_CONSTANTS.COMBO_MULTIPLIER_BASE * 0.8
        : 1;
      const points = Math.round(GAME_CONSTANTS.POINTS_CLOSE_HIT * multiplier);
      this.score += points;
      this.coins += GAME_CONSTANTS.COINS_PER_CLOSE;
      this.events.push({ type: 'close', points, combo: this.combo, time: Date.now() });
    }
    if (this.combo > this.maxCombo) this.maxCombo = this.combo;
  }

  recordMiss() {
    this.combo = 0;
    this.misses++;
    this.events.push({ type: 'miss', time: Date.now() });
  }

  recordBlockMined() {
    this.blocksMinedCount++;
    this.score += GAME_CONSTANTS.POINTS_BLOCK_MINED;
    this.events.push({ type: 'block_mined', block: this.blocksMinedCount, time: Date.now() });
  }

  spendCoins(amount) {
    this.coins = Math.max(0, this.coins - amount);
  }

  finish(won) {
    this.endTime = Date.now();
    // Time bonus for winning
    if (won) {
      const elapsed = (this.endTime - this.startTime) / 1000;
      const timeBonus = Math.max(0, Math.round((90 - elapsed) * 10));
      this.score += timeBonus;
      // Difficulty bonus
      const diffBonus = this.level * 500;
      this.score += diffBonus;
    }
  }

  generateRunHash() {
    const data = `${this.score}|${this.maxCombo}|${this.blocksMinedCount}|${this.level}|${this.startTime}|${this.endTime}`;
    return hashSync(data);
  }

  getSummary() {
    return {
      score: this.score,
      combo: this.maxCombo,
      blocks: this.blocksMinedCount,
      totalBlocks: this.totalBlocksToMine,
      level: this.level,
      perfectHits: this.perfectHits,
      closeHits: this.closeHits,
      misses: this.misses,
      coins: this.coins,
      elapsed: this.endTime ? Math.round((this.endTime - this.startTime) / 1000) : 0,
      runHash: this.generateRunHash(),
    };
  }
}
