// js/systems/HonestNetwork.js
// The AI race bar that competes against the player

export class HonestNetwork {
  constructor(levelConfig, totalBlocksToMine) {
    this.speed = levelConfig.honestNetworkSpeed;
    this.totalBlocks = totalBlocksToMine;
    this.progress = 0; // 0 to totalBlocks
    this.isActive = false;
    this.isPaused = false;
    this.lastTick = 0;
    this.slowdownUntil = 0; // Timestamp when slowdown expires
    this.onProgress = null;
    this.onOvertake = null;
  }

  start() {
    this.isActive = true;
    this.lastTick = performance.now();
  }

  update(now) {
    if (!this.isActive || this.isPaused) return;

    const dt = (now - this.lastTick) / 1000;
    this.lastTick = now;

    let currentSpeed = this.speed;
    if (now < this.slowdownUntil) {
      currentSpeed *= 0.3; // Hashpower powerup slows to 30%
    }

    // Progress increases based on speed (blocks per second scaled)
    this.progress += currentSpeed * dt * 0.15;

    if (this.onProgress) {
      this.onProgress(this.progress, this.totalBlocks);
    }

    if (this.progress >= this.totalBlocks && this.onOvertake) {
      this.onOvertake();
    }
  }

  slowDown(durationMs = 5000) {
    this.slowdownUntil = performance.now() + durationMs;
  }

  getProgressRatio() {
    return Math.min(1, this.progress / this.totalBlocks);
  }

  stop() {
    this.isActive = false;
  }
}
