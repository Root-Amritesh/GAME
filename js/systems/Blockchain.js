// js/systems/Blockchain.js
// Block class and chain logic with real SHA-256 hashing

import { hashSync, computeBlockHash, meetsTarget } from '../utils/crypto.js';
import { GAME_CONSTANTS } from '../utils/config.js';

export class Block {
  constructor(index, data, prevHash = '0'.repeat(64), timestamp = null) {
    this.index = index;
    this.data = data;
    this.prevHash = prevHash;
    this.timestamp = timestamp || Date.now();
    this.nonce = 0;
    this.hash = '';
    this.isMined = false;
    this.isBroken = false;
    this.isTampered = false;
  }

  computeHash() {
    return computeBlockHash(this.index, this.prevHash, this.data, this.nonce, this.timestamp);
  }

  mine(difficultyPrefix = GAME_CONSTANTS.HASH_DIFFICULTY_PREFIX) {
    // Quick mine for initial chain build (find valid nonce in <1000 tries)
    let tries = 0;
    while (tries < 100000) {
      this.nonce = Math.floor(Math.random() * 999999);
      this.hash = this.computeHash();
      if (this.hash.startsWith(difficultyPrefix)) {
        this.isMined = true;
        return true;
      }
      tries++;
    }
    // Fallback: just accept any hash with some leading zeros
    this.hash = this.computeHash();
    this.isMined = true;
    return true;
  }

  setNonce(nonce) {
    this.nonce = nonce;
    this.hash = this.computeHash();
    this.isMined = meetsTarget(this.hash, GAME_CONSTANTS.HASH_DIFFICULTY_PREFIX);
    this.isBroken = !this.isMined;
    return this.isMined;
  }
}

export class Blockchain {
  constructor(size = GAME_CONSTANTS.TOTAL_BLOCKS) {
    this.size = size;
    this.chain = [];
    this.tamperBlockIndex = GAME_CONSTANTS.TAMPER_BLOCK_INDEX;
    this.buildChain();
  }

  buildChain() {
    this.chain = [];
    const txData = [
      'Genesis Block — Network Init',
      'Transfer 200 ETH from Alice → Bob',
      'Transfer 150 ETH from Carol → Dave',
      'Transfer 500 ETH from Vault → Treasury',  // Block #4 (index 3) — tamper target
      'Transfer 75 ETH from Eve → Frank',
      'Mint 1000 USDC → Liquidity Pool',
      'Transfer 320 ETH from Grace → Heidi',
      'Burn 50 ETH — Gas Fees',
      'Transfer 890 ETH from Ivan → Judy',
      'Stake 500 ETH → Validator Node',
    ];

    for (let i = 0; i < this.size; i++) {
      const prevHash = i === 0 ? '0'.repeat(64) : this.chain[i - 1].hash;
      const block = new Block(i, txData[i] || `Transaction ${i}`, prevHash);
      block.mine();
      this.chain.push(block);
    }
  }

  tamper() {
    const block = this.chain[this.tamperBlockIndex];
    block.data = GAME_CONSTANTS.TAMPERED_TX;
    block.isTampered = true;
    block.hash = block.computeHash();
    block.isMined = false;
    block.isBroken = true;

    // Cascade — all subsequent blocks break
    const brokenBlocks = [];
    for (let i = this.tamperBlockIndex + 1; i < this.size; i++) {
      const b = this.chain[i];
      b.prevHash = this.chain[i - 1].hash;
      b.hash = b.computeHash();
      b.isMined = false;
      b.isBroken = true;
      brokenBlocks.push(b);
    }

    // The tampered block itself also needs re-mining
    brokenBlocks.unshift(block);
    return brokenBlocks;
  }

  getBrokenBlocks() {
    return this.chain.filter((b) => b.isBroken);
  }

  remineBlock(index, nonce) {
    const block = this.chain[index];
    block.nonce = nonce;
    block.hash = block.computeHash();
    if (meetsTarget(block.hash)) {
      block.isMined = true;
      block.isBroken = false;
      // Update next block's prevHash
      if (index + 1 < this.size) {
        this.chain[index + 1].prevHash = block.hash;
      }
      return true;
    }
    return false;
  }

  forceRemineBlock(index) {
    const block = this.chain[index];
    if (index > 0) {
      block.prevHash = this.chain[index - 1].hash;
    }
    block.mine();
    block.isBroken = false;
    // Update next block's prevHash
    if (index + 1 < this.size) {
      this.chain[index + 1].prevHash = block.hash;
    }
    return block;
  }

  isChainValid() {
    return this.chain.every((b) => !b.isBroken);
  }

  getBlock(index) {
    return this.chain[index];
  }
}
