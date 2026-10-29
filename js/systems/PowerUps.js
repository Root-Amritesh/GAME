// js/systems/PowerUps.js
// Hashpower rental and validator bribe mechanics

import { GAME_CONSTANTS } from '../utils/config.js';

export class PowerUps {
  constructor(levelConfig) {
    this.enabled = levelConfig.powerUpsEnabled;
    this.hashpowerCost = GAME_CONSTANTS.POWERUP_HASHPOWER_COST;
    this.hashpowerDuration = GAME_CONSTANTS.POWERUP_HASHPOWER_DURATION;
    this.bribeCost = GAME_CONSTANTS.POWERUP_BRIBE_COST;
    this.hashpowerActive = false;
    this.hashpowerExpiry = 0;
    this.onPurchase = null;
  }

  canAffordHashpower(coins) {
    return this.enabled && coins >= this.hashpowerCost && !this.hashpowerActive;
  }

  canAffordBribe(coins) {
    return this.enabled && coins >= this.bribeCost;
  }

  buyHashpower(coins, honestNetwork) {
    if (!this.canAffordHashpower(coins)) return { success: false, coins };
    this.hashpowerActive = true;
    this.hashpowerExpiry = performance.now() + this.hashpowerDuration;
    honestNetwork.slowDown(this.hashpowerDuration);
    setTimeout(() => { this.hashpowerActive = false; }, this.hashpowerDuration);
    if (this.onPurchase) this.onPurchase('hashpower');
    return { success: true, coins: coins - this.hashpowerCost };
  }

  buyBribe(coins) {
    if (!this.canAffordBribe(coins)) return { success: false, coins, skip: false };
    if (this.onPurchase) this.onPurchase('bribe');
    return { success: true, coins: coins - this.bribeCost, skip: true };
  }
}
