// js/main.js — Game initialization and full gameplay loop controller
import Phaser from 'phaser';
import { THEME, GAME_CONSTANTS, getLevelConfig } from './utils/config.js';
import { Blockchain } from './systems/Blockchain.js';
import { NonceSpinner } from './systems/NonceSpinner.js';
import { HonestNetwork } from './systems/HonestNetwork.js';
import { PowerUps } from './systems/PowerUps.js';
import { Scoring } from './systems/Scoring.js';
import * as Audio from './utils/audio.js';
import { submitScore, broadcastEvent, getSocket } from './utils/storage.js';
import QRCode from 'qrcode';

// ── Game State ──
const state = {
  playerName: 'ANON',
  level: 2,
  phase: 'splash', // splash | tamper | race | result
  blockchain: null,
  spinner: null,
  honestNetwork: null,
  powerUps: null,
  scoring: null,
  levelConfig: null,
  brokenBlocks: [],
  currentBlockIdx: 0,
  timer: 0,
  timerInterval: null,
  gameLoopId: null,
  won: false,
  socket: null,
};

// ── DOM Elements ──
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

const splashScreen = $('#splash-screen');
const tamperScreen = $('#tamper-screen');
const raceScreen = $('#race-screen');
const resultScreen = $('#result-screen');
const hud = $('#hud');
const chainDisplay = $('#chain-display');
const spinnerContainer = $('#spinner-container');
const hashDisplay = $('#hash-display');
const networkBarFill = $('#network-bar-fill');
const targetLabel = $('#target-label');
const powerupBar = $('#powerup-bar');

// ── Phaser Background Scene ──
class CyberGridScene extends Phaser.Scene {
  constructor() { super({ key: 'CyberGrid' }); }

  create() {
    this.cameras.main.setBackgroundColor(THEME.BG_PRIMARY);
    this.gridGraphics = this.add.graphics();
    this.particles = [];
    this.drawGrid();
  }

  drawGrid() {
    const g = this.gridGraphics;
    g.clear();
    const w = this.cameras.main.width;
    const h = this.cameras.main.height;
    const spacing = 40;

    g.lineStyle(1, 0x1a1a2e, 0.3);
    for (let x = 0; x < w; x += spacing) {
      g.beginPath();
      g.moveTo(x, 0);
      g.lineTo(x, h);
      g.strokePath();
    }
    for (let y = 0; y < h; y += spacing) {
      g.beginPath();
      g.moveTo(0, y);
      g.lineTo(w, y);
      g.strokePath();
    }

    // Neon accent lines
    g.lineStyle(1, 0x00f0ff, 0.06);
    for (let x = 0; x < w; x += spacing * 4) {
      g.beginPath();
      g.moveTo(x, 0);
      g.lineTo(x, h);
      g.strokePath();
    }
  }

  spawnParticleBurst(x, y, color = 0x00ff41, count = 20) {
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + Math.random() * 0.3;
      const speed = 100 + Math.random() * 200;
      const circle = this.add.circle(x, y, 2 + Math.random() * 3, color, 1);
      this.tweens.add({
        targets: circle,
        x: x + Math.cos(angle) * speed,
        y: y + Math.sin(angle) * speed,
        alpha: 0,
        scale: 0.2,
        duration: 400 + Math.random() * 300,
        ease: 'Power2',
        onComplete: () => circle.destroy(),
      });
    }
  }

  shakeCamera() {
    this.cameras.main.shake(300, 0.01);
  }

  update() {}
}

// ── Initialize Phaser ──
const phaserGame = new Phaser.Game({
  type: Phaser.AUTO,
  parent: 'phaser-canvas',
  width: window.innerWidth,
  height: window.innerHeight,
  transparent: true,
  scene: [CyberGridScene],
  scale: {
    mode: Phaser.Scale.RESIZE,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  audio: { noAudio: true },
});

function getPhaserScene() {
  return phaserGame.scene.getScene('CyberGrid');
}

// ── Connect Socket.io ──
(async () => {
  try {
    state.socket = await getSocket();
  } catch {}
})();

// ── Difficulty Selection ──
$$('.diff-btn').forEach((btn) => {
  btn.addEventListener('click', () => {
    $$('.diff-btn').forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');
    state.level = parseInt(btn.dataset.level, 10);
  });
});

// ── Audio Toggle ──
$('#btn-mute').addEventListener('click', () => {
  const muted = Audio.toggleMute();
  $('#btn-mute').textContent = muted ? '🔇' : '🔊';
  $('#btn-mute').classList.toggle('muted', muted);
});

// ── Start Game ──
$('#btn-start').addEventListener('click', () => {
  Audio.initAudio();
  Audio.play('bgm_ambient');
  state.playerName = ($('#player-name').value.trim() || 'ANON').slice(0, 20);
  startTamperPhase();
});

// ── PHASE: Tamper ──
function startTamperPhase() {
  state.phase = 'tamper';
  state.levelConfig = getLevelConfig(state.level);
  state.blockchain = new Blockchain();
  state.scoring = new Scoring(state.level);

  splashScreen.style.display = 'none';
  resultScreen.classList.remove('visible');
  tamperScreen.classList.add('visible');

  renderTamperChain();
}

function renderTamperChain() {
  const container = $('#tamper-chain');
  container.innerHTML = '';

  state.blockchain.chain.forEach((block, i) => {
    const card = document.createElement('div');
    card.className = 'block-card' + (i === GAME_CONSTANTS.TAMPER_BLOCK_INDEX ? ' target' : '');
    card.innerHTML = `
      <div class="block-title">Block #${i + 1}</div>
      <div class="block-field"><span class="label">Prev:</span> ${block.prevHash.slice(0, 10)}...</div>
      <div class="block-field"><span class="label">Data:</span> ${block.data.length > 30 ? block.data.slice(0, 30) + '...' : block.data}</div>
      <div class="block-field"><span class="label">Nonce:</span> ${block.nonce}</div>
      <div class="block-field"><span class="label">Hash:</span> ${block.hash.slice(0, 12)}...</div>
      <div class="block-status valid">🟢 VALID</div>
    `;

    if (i === GAME_CONSTANTS.TAMPER_BLOCK_INDEX) {
      card.addEventListener('click', () => executeTamper(card));
    }

    container.appendChild(card);
  });
}

function executeTamper(clickedCard) {
  Audio.play('sfx_tamper');
  const scene = getPhaserScene();
  if (scene) scene.shakeCamera();

  // Tamper the chain
  const brokenBlocks = state.blockchain.tamper();
  state.brokenBlocks = brokenBlocks;

  // Update the tampered block card
  const tamperIdx = GAME_CONSTANTS.TAMPER_BLOCK_INDEX;
  const block = state.blockchain.getBlock(tamperIdx);
  clickedCard.querySelector('.block-field:nth-child(3)').innerHTML =
    `<span class="label">Data:</span> <span style="color:var(--block-broken)">${GAME_CONSTANTS.TAMPERED_TX.slice(0, 30)}...</span>`;
  clickedCard.querySelector('.block-status').className = 'block-status broken';
  clickedCard.querySelector('.block-status').textContent = '🔴 TAMPERED';
  clickedCard.classList.remove('target');
  clickedCard.classList.add('broken', 'block-shatter');

  // Cascade red crack animation
  const allCards = $$('#tamper-chain .block-card');
  let delay = 200;
  for (let i = tamperIdx + 1; i < allCards.length; i++) {
    setTimeout(() => {
      Audio.play('sfx_chain_break');
      allCards[i].classList.add('broken', 'block-shatter');
      allCards[i].querySelector('.block-status').className = 'block-status broken';
      allCards[i].querySelector('.block-status').textContent = '🔴 BROKEN';
      const b = state.blockchain.getBlock(i);
      allCards[i].querySelector('.block-field:nth-child(5)').innerHTML =
        `<span class="label">Hash:</span> <span style="color:var(--block-broken)">${b.hash.slice(0, 12)}...</span>`;
    }, delay);
    delay += 250;
  }

  // After cascade, start race
  setTimeout(() => startRacePhase(), delay + 500);
}

// ── PHASE: Race ──
function startRacePhase() {
  state.phase = 'race';
  tamperScreen.classList.remove('visible');
  raceScreen.classList.add('visible');
  hud.classList.add('visible');
  chainDisplay.classList.add('visible');

  const config = state.levelConfig;
  state.timer = config.roundTime;
  state.currentBlockIdx = 0;
  state.won = false;

  // Initialize systems
  state.honestNetwork = new HonestNetwork(config, config.blocksToMine);
  state.powerUps = new PowerUps(config);
  state.scoring.start(config.blocksToMine);

  // Show/hide power-ups
  powerupBar.style.display = config.powerUpsEnabled ? 'flex' : 'none';

  // Build chain mini-display
  buildChainMiniDisplay();

  // Start timer
  updateHUD();
  state.timerInterval = setInterval(() => {
    state.timer--;
    updateHUD();
    if (state.timer <= 10 && state.timer > 0) {
      Audio.play('sfx_heartbeat');
      if (state.timer <= 5) Audio.play('sfx_alarm');
    }
    if (state.timer <= 0) {
      endGame(false);
    }
  }, 1000);

  // Start honest network
  state.honestNetwork.start();
  state.honestNetwork.onOvertake = () => {
    if (state.phase === 'race') endGame(false);
  };

  // Start game loop
  state.gameLoopId = requestAnimationFrame(gameLoop);

  // Start mining first broken block
  startMiningBlock();

  // Broadcast player started
  broadcastEvent('player:progress', { name: state.playerName, phase: 'race', level: state.level });
  if (state.socket) state.socket.emit('player:progress', { name: state.playerName, phase: 'race', level: state.level });
}

function gameLoop(now) {
  if (state.phase !== 'race') return;

  // Update honest network
  state.honestNetwork.update(now);
  const ratio = state.honestNetwork.getProgressRatio();
  networkBarFill.style.width = `${ratio * 100}%`;

  // Update power-up button states
  updatePowerUpButtons();

  state.gameLoopId = requestAnimationFrame(gameLoop);
}

function startMiningBlock() {
  if (state.currentBlockIdx >= state.brokenBlocks.length) {
    endGame(true);
    return;
  }

  const block = state.brokenBlocks[state.currentBlockIdx];
  $('#spinner-block-label').textContent = `RE-MINING BLOCK #${block.index + 1}`;

  // Update chain mini-display
  updateChainMiniDisplay();

  // Create spinner
  if (state.spinner) state.spinner.destroy();
  state.spinner = new NonceSpinner(state.levelConfig);
  state.spinner.setBlock(block);

  // Hash display updates
  state.spinner.onHashUpdate = (nonce, hash, isTarget) => {
    renderHashDisplay(nonce, hash, isTarget);
    Audio.play('sfx_nonce_scroll');
  };

  state.spinner.onTargetAppear = () => {
    targetLabel.style.display = 'block';
  };

  state.spinner.onTargetExpire = () => {
    targetLabel.style.display = 'none';
  };

  state.spinner.start();
}

function renderHashDisplay(currentNonce, currentHash, isTarget) {
  const history = state.spinner.hashHistory.slice(0, 5);
  hashDisplay.innerHTML = history
    .map((h, i) => {
      const isFirst = i === 0;
      const cls = h.isTarget && isFirst ? 'hash-row target' : 'hash-row';
      const opacity = 1 - i * 0.15;
      return `<div class="${cls}" style="opacity:${opacity}">
        <span class="hash-nonce">${h.nonce}</span>
        <span class="hash-value">${h.hash.slice(0, 32)}...</span>
      </div>`;
    })
    .join('');
}

function attemptNonce() {
  if (state.phase !== 'race' || !state.spinner) return;

  const result = state.spinner.attempt();

  if (result === 'perfect') {
    Audio.play('sfx_nonce_hit');
    state.scoring.recordHit('perfect');
    mineCurrentBlock();
    showComboFlash(state.scoring.combo);
    showPointsPopup(`+${GAME_CONSTANTS.POINTS_PERFECT_HIT}`, '#00ff41');
    const scene = getPhaserScene();
    if (scene) {
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      scene.spawnParticleBurst(cx, cy, 0x00ff41, 25);
    }
  } else if (result === 'close') {
    Audio.play('sfx_nonce_hit');
    state.scoring.recordHit('close');
    mineCurrentBlock();
    showPointsPopup(`+${GAME_CONSTANTS.POINTS_CLOSE_HIT}`, '#ffaa00');
  } else {
    Audio.play('sfx_nonce_miss');
    state.scoring.recordMiss();
    state.timer -= GAME_CONSTANTS.TIME_PENALTY_MISS;
    if (state.timer <= 0) {
      endGame(false);
      return;
    }
    const scene = getPhaserScene();
    if (scene) scene.shakeCamera();
    document.body.classList.add('screen-shake');
    setTimeout(() => document.body.classList.remove('screen-shake'), 300);
    showPointsPopup(`-${GAME_CONSTANTS.TIME_PENALTY_MISS}s`, '#ff0040');
  }

  updateHUD();
}

function mineCurrentBlock() {
  const block = state.brokenBlocks[state.currentBlockIdx];
  state.blockchain.forceRemineBlock(block.index);
  state.scoring.recordBlockMined();
  Audio.play('sfx_block_mined');

  if (state.scoring.combo >= GAME_CONSTANTS.COMBO_THRESHOLD && state.scoring.combo % 3 === 0) {
    Audio.play('sfx_combo');
  }

  targetLabel.style.display = 'none';
  state.currentBlockIdx++;

  // Broadcast progress
  broadcastEvent('block:mined', {
    name: state.playerName,
    block: block.index + 1,
    progress: state.currentBlockIdx,
    total: state.brokenBlocks.length,
    score: state.scoring.score,
  });
  if (state.socket) {
    state.socket.emit('block:mined', {
      name: state.playerName,
      block: block.index + 1,
      progress: state.currentBlockIdx,
      total: state.brokenBlocks.length,
      score: state.scoring.score,
    });
  }

  updateChainMiniDisplay();
  updateHUD();

  // Next block
  setTimeout(() => startMiningBlock(), 400);
}

// ── Power-Ups ──
$('#btn-hashpower').addEventListener('click', () => {
  if (!state.powerUps || state.phase !== 'race') return;
  const result = state.powerUps.buyHashpower(state.scoring.coins, state.honestNetwork);
  if (result.success) {
    state.scoring.coins = result.coins;
    updateHUD();
    showPointsPopup('⚡ HASHPOWER!', '#bf00ff');
  }
});

$('#btn-bribe').addEventListener('click', () => {
  if (!state.powerUps || state.phase !== 'race') return;
  const result = state.powerUps.buyBribe(state.scoring.coins);
  if (result.success && result.skip) {
    state.scoring.coins = result.coins;
    // Auto-mine current block
    if (state.spinner) state.spinner.stop();
    mineCurrentBlock();
    showPointsPopup('🤝 BRIBED!', '#bf00ff');
  }
});

function updatePowerUpButtons() {
  if (!state.powerUps) return;
  $('#btn-hashpower').disabled = !state.powerUps.canAffordHashpower(state.scoring.coins);
  $('#btn-bribe').disabled = !state.powerUps.canAffordBribe(state.scoring.coins);
}

// ── Input Handlers ──
document.addEventListener('keydown', (e) => {
  if (e.code === 'Space' && state.phase === 'race') {
    e.preventDefault();
    attemptNonce();
  }
});

$('#spinner-container').addEventListener('click', (e) => {
  if (state.phase === 'race') {
    attemptNonce();
  }
});

// ── End Game ──
function endGame(won) {
  state.phase = 'result';
  state.won = won;

  // Stop everything
  if (state.timerInterval) clearInterval(state.timerInterval);
  if (state.gameLoopId) cancelAnimationFrame(state.gameLoopId);
  if (state.spinner) state.spinner.destroy();
  if (state.honestNetwork) state.honestNetwork.stop();

  Audio.stop('bgm_ambient');
  won ? Audio.play('sfx_win') : Audio.play('sfx_lose');

  state.scoring.finish(won);
  const summary = state.scoring.getSummary();

  // Hide race UI
  raceScreen.classList.remove('visible');
  hud.classList.remove('visible');
  chainDisplay.classList.remove('visible');

  // Show result
  showResultScreen(won, summary);

  // Submit score
  const entry = {
    name: state.playerName,
    score: summary.score,
    combo: summary.combo,
    blocks: summary.blocks,
    level: summary.level,
    runHash: summary.runHash,
  };

  submitScore(entry).then((res) => {
    if (res && res.rank) {
      $('#result-rank').textContent = `You ranked #${res.rank}`;
      if (res.rank === 1) {
        Audio.play('sfx_whale_alert');
        broadcastEvent('whale:alert', { entry });
        if (state.socket) state.socket.emit('whale:alert', { entry });
      }
    }
  });

  // Generate QR
  generateQR(summary);
}

function showResultScreen(won, summary) {
  resultScreen.classList.add('visible');

  const title = $('#result-title');
  title.textContent = won ? 'YOU REWROTE HISTORY' : 'INVALID CHAIN';
  title.className = `result-title ${won ? 'win' : 'lose'} glitch`;
  title.setAttribute('data-text', title.textContent);

  $('#result-subtitle').textContent = won
    ? 'Your fork was accepted by the network. The heist is complete.'
    : `The Network Rejected Your Fork. ${summary.blocks}/${summary.totalBlocks} blocks re-mined.`;

  if (!won) {
    const stamp = document.createElement('div');
    stamp.className = 'stamp-rejected';
    stamp.textContent = 'REJECTED';
    title.parentElement.insertBefore(stamp, title.nextSibling);
  }

  const statsContainer = $('#result-stats');
  statsContainer.innerHTML = '';
  const stats = [
    { label: 'Score', value: summary.score.toLocaleString() },
    { label: 'Max Combo', value: `${summary.combo}x` },
    { label: 'Blocks', value: `${summary.blocks}/${summary.totalBlocks}` },
    { label: 'Perfect Hits', value: summary.perfectHits },
    { label: 'Time', value: `${summary.elapsed}s` },
    { label: 'Level', value: state.levelConfig.name },
  ];

  stats.forEach((s, i) => {
    const card = document.createElement('div');
    card.className = 'stat-card fade-in-up';
    card.style.animationDelay = `${i * 0.1}s`;
    card.innerHTML = `
      <div class="stat-label">${s.label}</div>
      <div class="stat-value">${s.value}</div>
    `;
    statsContainer.appendChild(card);
  });

  $('#result-hash').textContent = `Proof-of-Heist: ${summary.runHash}`;
}

async function generateQR(summary) {
  try {
    const cardUrl = `${window.location.origin}/card.html?name=${encodeURIComponent(state.playerName)}&score=${summary.score}&combo=${summary.combo}&level=${summary.level}&hash=${summary.runHash}`;
    const canvas = $('#qr-canvas');
    await QRCode.toCanvas(canvas, cardUrl, {
      width: 150,
      margin: 1,
      color: { dark: '#00f0ff', light: '#0a0a0f' },
    });
  } catch (e) {
    console.warn('QR generation failed:', e);
  }
}

// ── HUD Updates ──
function updateHUD() {
  const timerEl = $('#hud-timer');
  timerEl.textContent = Math.max(0, state.timer);
  timerEl.className = 'hud-value timer' + (state.timer <= 10 ? ' danger' : state.timer <= 20 ? ' warning' : '');

  $('#hud-score').textContent = state.scoring ? state.scoring.score.toLocaleString() : '0';
  $('#hud-combo').textContent = state.scoring ? `${state.scoring.combo}x` : '0x';
  $('#hud-blocks').textContent = state.scoring
    ? `${state.scoring.blocksMinedCount}/${state.levelConfig.blocksToMine}`
    : '0/0';
  $('#hud-coins').textContent = state.scoring ? state.scoring.coins : '0';
}

// ── Chain Mini Display ──
function buildChainMiniDisplay() {
  chainDisplay.innerHTML = '';
  state.blockchain.chain.forEach((block, i) => {
    if (i > 0) {
      const link = document.createElement('div');
      link.className = 'chain-link' + (block.isBroken ? ' broken' : '');
      link.id = `chain-link-${i}`;
      chainDisplay.appendChild(link);
    }
    const mini = document.createElement('div');
    mini.className = 'mini-block';
    mini.id = `mini-block-${i}`;
    mini.textContent = i + 1;
    if (block.isTampered) mini.classList.add('tampered');
    else if (block.isBroken) mini.classList.add('broken');
    chainDisplay.appendChild(mini);
  });
}

function updateChainMiniDisplay() {
  state.blockchain.chain.forEach((block, i) => {
    const mini = document.getElementById(`mini-block-${i}`);
    if (!mini) return;
    mini.className = 'mini-block';
    if (block.isTampered && block.isBroken) mini.classList.add('tampered');
    else if (block.isBroken) mini.classList.add('broken');
    else if (block.isMined) mini.classList.add('remined');

    // Highlight current mining block
    if (state.brokenBlocks[state.currentBlockIdx] && block.index === state.brokenBlocks[state.currentBlockIdx].index) {
      mini.classList.add('mining');
    }
  });
}

// ── UI Helpers ──
function showComboFlash(combo) {
  if (combo < GAME_CONSTANTS.COMBO_THRESHOLD) return;
  const el = document.createElement('div');
  el.className = 'combo-flash';
  el.textContent = `${combo}x COMBO!`;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 800);
}

function showPointsPopup(text, color) {
  const el = document.createElement('div');
  el.className = 'points-popup';
  el.textContent = text;
  el.style.color = color;
  el.style.left = `${window.innerWidth / 2 - 40}px`;
  el.style.top = `${window.innerHeight / 2 + 80}px`;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 600);
}

// ── Play Again ──
$('#btn-play-again').addEventListener('click', () => {
  // Clean up stamps
  document.querySelectorAll('.stamp-rejected').forEach((el) => el.remove());
  resultScreen.classList.remove('visible');
  splashScreen.style.display = 'flex';
  state.phase = 'splash';
  Audio.play('bgm_ambient');
});

// ── Resize Handler ──
window.addEventListener('resize', () => {
  const scene = getPhaserScene();
  if (scene) scene.drawGrid();
});
