// js/utils/audio.js
// Procedural Web Audio synthesizer — zero .mp3 dependencies
// Generates all 13 sound effects using oscillators, noise, filters, envelopes

let audioCtx = null;
let masterGain = null;
let muted = false;
let volume = 0.6;

function getCtx() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    masterGain = audioCtx.createGain();
    masterGain.gain.value = volume;
    masterGain.connect(audioCtx.destination);
  }
  if (audioCtx.state === 'suspended') audioCtx.resume();
  return audioCtx;
}

function getMaster() {
  getCtx();
  return masterGain;
}

// ── Utility: white noise buffer ──
function createNoiseBuffer(duration = 1) {
  const ctx = getCtx();
  const sampleRate = ctx.sampleRate;
  const length = sampleRate * duration;
  const buffer = ctx.createBuffer(1, length, sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < length; i++) data[i] = Math.random() * 2 - 1;
  return buffer;
}

// ── Utility: play a tone with envelope ──
function playTone(freq, type, attack, sustain, release, gainVal = 0.3, detune = 0) {
  const ctx = getCtx();
  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  osc.detune.value = detune;
  gain.gain.setValueAtTime(0, now);
  gain.gain.linearRampToValueAtTime(gainVal, now + attack);
  gain.gain.setValueAtTime(gainVal, now + attack + sustain);
  gain.gain.linearRampToValueAtTime(0, now + attack + sustain + release);
  osc.connect(gain);
  gain.connect(getMaster());
  osc.start(now);
  osc.stop(now + attack + sustain + release + 0.05);
}

// ── Utility: play filtered noise burst ──
function playNoiseBurst(duration, filterFreq, filterType = 'bandpass', gainVal = 0.2) {
  const ctx = getCtx();
  const now = ctx.currentTime;
  const source = ctx.createBufferSource();
  source.buffer = createNoiseBuffer(duration);
  const filter = ctx.createBiquadFilter();
  filter.type = filterType;
  filter.frequency.value = filterFreq;
  filter.Q.value = 1;
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(gainVal, now);
  gain.gain.linearRampToValueAtTime(0, now + duration);
  source.connect(filter);
  filter.connect(gain);
  gain.connect(getMaster());
  source.start(now);
  source.stop(now + duration + 0.01);
}

// ── BGM: Ambient synthwave hum ──
let bgmOscillators = [];
let bgmActive = false;

function startBGM() {
  if (bgmActive) return;
  const ctx = getCtx();
  const now = ctx.currentTime;

  // Deep bass drone
  const bass = ctx.createOscillator();
  bass.type = 'sine';
  bass.frequency.value = 55;
  const bassGain = ctx.createGain();
  bassGain.gain.value = 0.08;

  // Pad with slow LFO modulation
  const pad = ctx.createOscillator();
  pad.type = 'triangle';
  pad.frequency.value = 110;
  const padGain = ctx.createGain();
  padGain.gain.value = 0.04;

  // LFO for pad wobble
  const lfo = ctx.createOscillator();
  lfo.type = 'sine';
  lfo.frequency.value = 0.3;
  const lfoGain = ctx.createGain();
  lfoGain.gain.value = 15;
  lfo.connect(lfoGain);
  lfoGain.connect(pad.frequency);

  // High atmosphere
  const atmo = ctx.createOscillator();
  atmo.type = 'sine';
  atmo.frequency.value = 880;
  const atmoGain = ctx.createGain();
  atmoGain.gain.value = 0.015;
  const atmoFilter = ctx.createBiquadFilter();
  atmoFilter.type = 'lowpass';
  atmoFilter.frequency.value = 1200;

  bass.connect(bassGain).connect(getMaster());
  pad.connect(padGain).connect(getMaster());
  atmo.connect(atmoFilter).connect(atmoGain).connect(getMaster());

  [bass, pad, lfo, atmo].forEach((o) => o.start(now));
  bgmOscillators = [bass, pad, lfo, atmo, bassGain, padGain, atmoGain];
  bgmActive = true;
}

function stopBGM() {
  bgmOscillators.forEach((node) => {
    try { if (node.stop) node.stop(); } catch {}
    try { node.disconnect(); } catch {}
  });
  bgmOscillators = [];
  bgmActive = false;
}

// ── SFX Definitions ──

function sfxTamper() {
  // Deep bass boom + digital crack
  playTone(40, 'sine', 0.01, 0.1, 0.6, 0.5);
  playTone(80, 'sawtooth', 0.01, 0.05, 0.4, 0.3);
  playNoiseBurst(0.3, 3000, 'highpass', 0.3);
  setTimeout(() => playNoiseBurst(0.2, 5000, 'highpass', 0.15), 100);
}

function sfxChainBreak() {
  // Glass shatter cascading
  playNoiseBurst(0.15, 8000, 'highpass', 0.25);
  playTone(200, 'square', 0.005, 0.02, 0.15, 0.15);
  setTimeout(() => playNoiseBurst(0.1, 6000, 'highpass', 0.15), 50);
}

function sfxNonceScroll() {
  // Rapid digital click
  playTone(1200, 'square', 0.001, 0.01, 0.02, 0.08);
}

function sfxNonceHit() {
  // Satisfying mechanical click + synth chord
  playTone(800, 'sine', 0.005, 0.05, 0.15, 0.25);
  playTone(1200, 'sine', 0.005, 0.05, 0.15, 0.15);
  playTone(1600, 'triangle', 0.01, 0.05, 0.2, 0.1);
  playTone(2400, 'sine', 0.005, 0.02, 0.1, 0.08);
}

function sfxNonceMiss() {
  // Error buzzer
  playTone(150, 'sawtooth', 0.01, 0.15, 0.1, 0.3);
  playTone(120, 'square', 0.01, 0.15, 0.1, 0.2);
}

function sfxBlockMined() {
  // Rising synth note + energy pulse
  const ctx = getCtx();
  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(300, now);
  osc.frequency.exponentialRampToValueAtTime(1200, now + 0.3);
  gain.gain.setValueAtTime(0.3, now);
  gain.gain.linearRampToValueAtTime(0, now + 0.5);
  osc.connect(gain).connect(getMaster());
  osc.start(now);
  osc.stop(now + 0.55);
  playNoiseBurst(0.1, 4000, 'bandpass', 0.1);
}

function sfxCombo() {
  // Ascending chime melody
  [800, 1000, 1200, 1600].forEach((freq, i) => {
    setTimeout(() => playTone(freq, 'sine', 0.005, 0.06, 0.12, 0.15), i * 60);
  });
}

function sfxHeartbeat() {
  // Double thud heartbeat
  playTone(50, 'sine', 0.01, 0.06, 0.1, 0.4);
  setTimeout(() => playTone(45, 'sine', 0.01, 0.05, 0.08, 0.3), 120);
}

function sfxAlarm() {
  // Siren oscillating between two tones + bass rumble
  const ctx = getCtx();
  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'sawtooth';
  osc.frequency.setValueAtTime(600, now);
  // Siren sweep
  for (let i = 0; i < 6; i++) {
    osc.frequency.linearRampToValueAtTime(900, now + i * 0.2 + 0.1);
    osc.frequency.linearRampToValueAtTime(600, now + i * 0.2 + 0.2);
  }
  gain.gain.setValueAtTime(0.2, now);
  gain.gain.linearRampToValueAtTime(0, now + 1.2);
  osc.connect(gain).connect(getMaster());
  osc.start(now);
  osc.stop(now + 1.3);
  playTone(35, 'sine', 0.01, 0.8, 0.3, 0.2);
}

function sfxWin() {
  // Epic synth fanfare
  const notes = [523, 659, 784, 1047, 1319, 1568];
  notes.forEach((freq, i) => {
    setTimeout(() => {
      playTone(freq, 'sine', 0.01, 0.15, 0.3, 0.2);
      playTone(freq * 0.5, 'triangle', 0.01, 0.15, 0.3, 0.1);
    }, i * 100);
  });
  setTimeout(() => playNoiseBurst(0.5, 2000, 'bandpass', 0.1), 400);
}

function sfxLose() {
  // Bass drop + flatline
  const ctx = getCtx();
  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'sawtooth';
  osc.frequency.setValueAtTime(400, now);
  osc.frequency.exponentialRampToValueAtTime(30, now + 0.8);
  gain.gain.setValueAtTime(0.35, now);
  gain.gain.linearRampToValueAtTime(0.05, now + 0.8);
  gain.gain.linearRampToValueAtTime(0, now + 2);
  osc.connect(gain).connect(getMaster());
  osc.start(now);
  osc.stop(now + 2.1);
  // Flatline
  setTimeout(() => playTone(220, 'sine', 0.1, 1, 0.5, 0.1), 800);
}

function sfxWhaleAlert() {
  // Loud siren + impact
  sfxAlarm();
  setTimeout(() => {
    playTone(100, 'sine', 0.01, 0.1, 0.3, 0.5);
    playNoiseBurst(0.3, 1000, 'lowpass', 0.4);
  }, 200);
  setTimeout(() => sfxCombo(), 500);
}

// ── Sound map ──
const SFX_MAP = {
  bgm_ambient: { start: startBGM, stop: stopBGM },
  sfx_tamper: sfxTamper,
  sfx_chain_break: sfxChainBreak,
  sfx_nonce_scroll: sfxNonceScroll,
  sfx_nonce_hit: sfxNonceHit,
  sfx_nonce_miss: sfxNonceMiss,
  sfx_block_mined: sfxBlockMined,
  sfx_combo: sfxCombo,
  sfx_heartbeat: sfxHeartbeat,
  sfx_alarm: sfxAlarm,
  sfx_win: sfxWin,
  sfx_lose: sfxLose,
  sfx_whale_alert: sfxWhaleAlert,
};

// ── Public API ──
export function play(name) {
  if (muted) return;
  const sfx = SFX_MAP[name];
  if (!sfx) return;
  if (typeof sfx === 'function') {
    sfx();
  } else if (sfx.start) {
    sfx.start();
  }
}

export function stop(name) {
  const sfx = SFX_MAP[name];
  if (sfx && sfx.stop) sfx.stop();
}

export function setVolume(v) {
  volume = Math.max(0, Math.min(1, v));
  if (masterGain) masterGain.gain.value = volume;
}

export function getVolume() { return volume; }

export function toggleMute() {
  muted = !muted;
  if (masterGain) masterGain.gain.value = muted ? 0 : volume;
  return muted;
}

export function isMuted() { return muted; }

export function initAudio() {
  getCtx();
}
