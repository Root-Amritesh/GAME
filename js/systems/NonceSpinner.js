// js/systems/NonceSpinner.js
// Timing mini-game: scroll real SHA-256 hashes, hit SPACE on the valid one

import { hashSync, meetsTarget } from '../utils/crypto.js';
import { GAME_CONSTANTS } from '../utils/config.js';

export class NonceSpinner {
  constructor(levelConfig) {
    this.scrollSpeed = levelConfig.nonceScrollSpeed;
    this.targetWindow = levelConfig.nonceTargetWindow; // ms
    this.currentNonce = Math.floor(Math.random() * 100000);
    this.currentHash = '';
    this.targetNonce = 0;
    this.targetHash = '';
    this.isTargetVisible = false;
    this.targetStartTime = 0;
    this.scrollInterval = null;
    this.hashHistory = [];
    this.onHashUpdate = null;
    this.onTargetAppear = null;
    this.onTargetExpire = null;
    this.blockIndex = 0;
    this.blockPrevHash = '';
    this.blockData = '';
    this.blockTimestamp = Date.now();
    this.isActive = false;
    this._scrollTimer = 0;
    this._targetTimer = null;
    this._injectInterval = null;
  }

  setBlock(block) {
    this.blockIndex = block.index;
    this.blockPrevHash = block.prevHash;
    this.blockData = block.data;
    this.blockTimestamp = block.timestamp;
    this.currentNonce = Math.floor(Math.random() * 100000);
  }

  _computeHash(nonce) {
    return hashSync(`${this.blockIndex}${this.blockPrevHash}${this.blockData}${nonce}${this.blockTimestamp}`);
  }

  _findValidNonce() {
    // Pre-compute a valid nonce for this block
    let nonce = Math.floor(Math.random() * 900000) + 100000;
    for (let i = 0; i < 200000; i++) {
      const hash = this._computeHash(nonce);
      if (meetsTarget(hash, GAME_CONSTANTS.HASH_DIFFICULTY_PREFIX)) {
        return { nonce, hash };
      }
      nonce++;
    }
    // Fallback: just generate one by trying random values
    for (let i = 0; i < 500000; i++) {
      nonce = Math.floor(Math.random() * 9999999);
      const hash = this._computeHash(nonce);
      if (meetsTarget(hash, GAME_CONSTANTS.HASH_DIFFICULTY_PREFIX)) {
        return { nonce, hash };
      }
    }
    // Ultimate fallback: force a hash
    return { nonce: 99999, hash: '0000' + hashSync(String(Math.random())).slice(4) };
  }

  start() {
    this.isActive = true;
    this._precomputeTarget();
    this._startScrolling();
    this._scheduleTargetInjection();
  }

  _precomputeTarget() {
    const result = this._findValidNonce();
    this.targetNonce = result.nonce;
    this.targetHash = result.hash;
  }

  _startScrolling() {
    const baseInterval = Math.max(30, 150 - this.scrollSpeed * 15);
    this.scrollInterval = setInterval(() => {
      if (!this.isActive) return;
      this.currentNonce += Math.floor(Math.random() * 3) + 1;
      this.currentHash = this._computeHash(this.currentNonce);
      this.hashHistory.unshift({ nonce: this.currentNonce, hash: this.currentHash, isTarget: false });
      if (this.hashHistory.length > 8) this.hashHistory.pop();
      if (this.onHashUpdate) this.onHashUpdate(this.currentNonce, this.currentHash, false);
    }, baseInterval);
  }

  _scheduleTargetInjection() {
    // Inject target every 2-4 seconds
    const delay = 1500 + Math.random() * 2500;
    this._injectInterval = setTimeout(() => {
      if (!this.isActive) return;
      this._injectTarget();
    }, delay);
  }

  _injectTarget() {
    if (!this.isActive) return;
    this.isTargetVisible = true;
    this.targetStartTime = performance.now();
    this.currentNonce = this.targetNonce;
    this.currentHash = this.targetHash;
    this.hashHistory.unshift({ nonce: this.targetNonce, hash: this.targetHash, isTarget: true });
    if (this.hashHistory.length > 8) this.hashHistory.pop();
    if (this.onHashUpdate) this.onHashUpdate(this.targetNonce, this.targetHash, true);
    if (this.onTargetAppear) this.onTargetAppear(this.targetNonce, this.targetHash);

    // Target window expires
    this._targetTimer = setTimeout(() => {
      if (!this.isActive) return;
      this.isTargetVisible = false;
      if (this.onTargetExpire) this.onTargetExpire();
      // Pre-compute next target
      this._precomputeTarget();
      // Schedule next injection
      this._scheduleTargetInjection();
    }, this.targetWindow);
  }

  /**
   * Player attempts to lock the nonce.
   * Returns: 'perfect' | 'close' | 'miss'
   */
  attempt() {
    if (!this.isActive) return 'miss';

    if (this.isTargetVisible) {
      const elapsed = performance.now() - this.targetStartTime;
      const ratio = elapsed / this.targetWindow;
      // Perfect: within first 60% of window
      if (ratio <= 0.6) {
        this.stop();
        return 'perfect';
      }
      // Close: within the rest of the window
      this.stop();
      return 'close';
    }

    return 'miss';
  }

  getTargetNonce() {
    return this.targetNonce;
  }

  getTargetHash() {
    return this.targetHash;
  }

  stop() {
    this.isActive = false;
    if (this.scrollInterval) clearInterval(this.scrollInterval);
    if (this._targetTimer) clearTimeout(this._targetTimer);
    if (this._injectInterval) clearTimeout(this._injectInterval);
    this.scrollInterval = null;
    this._targetTimer = null;
    this._injectInterval = null;
  }

  destroy() {
    this.stop();
    this.onHashUpdate = null;
    this.onTargetAppear = null;
    this.onTargetExpire = null;
  }
}
