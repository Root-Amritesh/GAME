<p align="center">
  <img src="https://img.shields.io/badge/STATUS-READY%20TO%20DEPLOY-brightgreen?style=for-the-badge" alt="Status" />
  <img src="https://img.shields.io/badge/GAME-BROWSER%20BASED-blue?style=for-the-badge" alt="Platform" />
  <img src="https://img.shields.io/badge/PLAYERS-SINGLE%20PLAYER-orange?style=for-the-badge" alt="Players" />
  <img src="https://img.shields.io/badge/ROUND-60--90%20SECONDS-red?style=for-the-badge" alt="Round" />
  <img src="https://img.shields.io/badge/BLOCKCHAIN-REAL%20SHA--256-purple?style=for-the-badge" alt="Crypto" />
</p>

<h1 align="center">⛓️‍💥 CHAIN HEIST: Rewrite History</h1>

<p align="center">
  <b>A high-adrenaline, arcade-style blockchain hacking game where YOU are the attacker.</b><br/>
  Tamper with the chain. Re-mine the blocks. Outrun the network. Rewrite history.<br/><br/>
  <i>Built for <b>Club Battle: Techverse</b> — Blockchain Club</i>
</p>

<p align="center">
  <a href="#-quick-start-play-in-2-minutes">Quick Start</a> •
  <a href="#-what-is-this-game">What Is This</a> •
  <a href="#-how-to-play">How To Play</a> •
  <a href="#-the-blockchain-science-behind-it">The Science</a> •
  <a href="#-deploy-it-yourself">Deploy</a> •
  <a href="#-stall-setup-guide">Stall Setup</a>
</p>

---

## 🧠 Wait, What Even IS This?

Imagine a bank vault. Now imagine that vault isn't protected by a single lock — it's protected by a **chain of locks**, where every lock is mathematically connected to the one before it. If someone changes even ONE lock, every lock after it **breaks**. That's basically how a blockchain works.

**Chain Heist** puts you in the shoes of a hacker trying to do the impossible:

> **Break into the chain, change a transaction, and fix all the broken locks BEFORE the real network notices.**

It sounds easy. It's not. The real network keeps adding new locks while you're scrambling to fix yours. This is why, in the real world, hacking a blockchain (called a **"51% Attack"**) is nearly impossible — and this game lets you FEEL that impossibility, one panicked click at a time.

**No crypto wallet needed. No coding knowledge needed. No blockchain experience needed.**  
Just fast reflexes and nerves of steel. 🫡

---

## 📖 Table of Contents

1.  [What Is This Game?](#-what-is-this-game-the-full-picture)
2.  [The Blockchain Science Behind It](#-the-blockchain-science-behind-it)
3.  [How To Play (Step-by-Step)](#-how-to-play-step-by-step)
4.  [Game Screens & Flow](#-game-screens--flow)
5.  [Visual Theme & Aesthetics](#-visual-theme--aesthetics)
6.  [Sound Design](#-sound-design)
7.  [Tech Stack (What's Under the Hood)](#-tech-stack-whats-under-the-hood)
8.  [Project Structure](#-project-structure)
9.  [Quick Start (Play in 2 Minutes)](#-quick-start-play-in-2-minutes)
10. [Full Setup Guide (From Scratch)](#-full-setup-guide-from-scratch)
11. [Configuration & Customization](#-configuration--customization)
12. [Deploy It Yourself](#-deploy-it-yourself)
13. [Leaderboard Setup](#-leaderboard-setup)
14. [Offline Mode (No Wi-Fi? No Problem)](#-offline-mode-no-wi-fi-no-problem)
15. [Troubleshooting](#-troubleshooting)
16. [Credits & License](#-credits--license)

---

## 🎮 What Is This Game? (The Full Picture)

### The Story

The year is 2099. Blockchain networks run the world's economy. Every transaction — every coffee, every salary, every billion-dollar deal — is recorded on an unbreakable digital chain.

**You are a rogue hacker.** You've found a vulnerability. Block #4 in the chain contains a massive transaction, and you want to change it — redirect the money to yourself. But here's the catch: the moment you tamper with block #4, every block after it **shatters**. Their cryptographic seals break. The chain knows something is wrong.

You have **60–90 seconds** to re-mine every broken block and create a fake version of the chain that's longer than the real one. If your fake chain is longer, the network accepts YOUR version as the truth.

**You literally rewrite history.**

But the honest network isn't sleeping. Real miners are adding new blocks every second. If they outpace you, your fork gets rejected, and you see the dreaded screen:

> **❌ INVALID CHAIN — The Network Rejected Your Fork**

### The Point

This isn't just a game. It's a **living demonstration** of why blockchains are secure. Players walk away understanding:

- **Why you can't just "edit" a blockchain** (because every block is linked by math)
- **What mining actually is** (finding a special number called a "nonce")
- **Why a 51% attack is theoretically possible but practically insane** (because you'd need to outcompute the entire network)

And they learn all of this **without reading a single paragraph of explanation**. They learn by failing. By sweating. By slamming "PLAY AGAIN."

---

## 🔬 The Blockchain Science Behind It

> *"But I don't know anything about blockchain..."*
>
> **Perfect. That's exactly who this game is for.** But if you're curious about what's really happening under the hood, read on. We'll explain it like you're five.

### 🧱 What Is a Block?

Think of a block as a **page in a notebook**. Each page has:

| Part | What it means | Real-world example |
|---|---|---|
| **Data** | The actual information stored | "Alice sent Bob ₹500" |
| **Hash** | A unique fingerprint of this page | `a4f2e8...` (a long code) |
| **Previous Hash** | The fingerprint of the page BEFORE this one | `7b3d1c...` |
| **Nonce** | A magic number that makes the fingerprint "valid" | `48291` |

### 🔗 What Is a Blockchain?

It's just those notebook pages **chained together**. Each page contains the fingerprint of the previous page. So:

```
Block 1          Block 2          Block 3          Block 4
┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐
│ Data: ... │    │ Data: ... │    │ Data: ... │    │ Data: ... │
│ Hash: AAA │◄───│ Prev: AAA │    │ Prev: BBB │    │ Prev: CCC │
│ Nonce: 42 │    │ Hash: BBB │◄───│ Hash: CCC │◄───│ Hash: DDD │
└──────────┘    │ Nonce: 87 │    │ Nonce: 13 │    │ Nonce: 56 │
                └──────────┘    └──────────┘    └──────────┘
```

See how Block 2 contains `Prev: AAA`? That's Block 1's fingerprint. If you change ANYTHING in Block 1, its fingerprint changes from `AAA` to something else — and now Block 2's link is **broken**. And since Block 3 links to Block 2, that breaks too. **The entire chain after your edit shatters.**

### 🔨 What Is Mining?

When a block's link breaks, you need to find a new "nonce" (magic number) that makes its fingerprint valid again. In real life, this means your computer tries **billions** of random numbers until it finds one that works.

In our game, this is the **nonce-spinner mini-game** — you see hashes scrolling past, and you have to tap at exactly the right moment to "find" the valid nonce. It's like a slot machine, but for cryptography.

### 💀 What Is a 51% Attack?

In the real world, the blockchain follows one rule: **the longest chain wins**. If a hacker can secretly build a longer chain than the honest network, the network will accept the hacker's version and reject the real one.

To do this, the hacker needs more computing power than **the rest of the entire network combined** — more than 51%. That's why it's called a 51% attack.

In our game, the "Honest Network Progress Bar" represents the real network mining new blocks. You're racing against it. **This is the 51% attack, compressed into 90 seconds of arcade panic.**

### 🧾 What Is SHA-256?

SHA-256 is the actual mathematical function that creates those "fingerprints" (hashes). It's not something we made up for the game — it's what **Bitcoin actually uses**. 

Our game uses the **real SHA-256 algorithm** through your browser's built-in Web Crypto API. Every hash you see on screen is a real, mathematically computed hash. If a judge inspects the code, they'll see actual cryptography running, not random strings.

---

## 🕹️ How To Play (Step-by-Step)

### Step 1: The Opening Screen

You see a glowing blockchain — 10 blocks linked together in a neon chain. One prominent button:

> **🔴 [ HACK THE CHAIN ]**

No sign-up. No instructions page. No wallet connection. Just press the button.

### Step 2: The Tamper (The "Oh Sh*t" Moment)

Block #4 is highlighted. You click it. A transaction appears:

> `"Transfer 500 ETH from Vault → Treasury"`

You change it to:

> `"Transfer 500 ETH from Vault → YOUR_WALLET"`

The moment you confirm, **EVERY block after #4 turns RED**. Their hashes no longer match. Cracks appear. Alarms blare. The chain is broken.

**This is the most visually satisfying moment in the game.** People watching from behind will go "whoa."

### Step 3: The Race (Core Gameplay)

Now the clock starts: **60–90 seconds**.

You see two things on screen:

1. **Your broken chain** — blocks #5 through #10 are shattered and red. You need to re-mine each one.
2. **The Honest Network bar** — it keeps growing on the right side. Real miners are adding new blocks. If their chain gets longer than yours, you lose.

### Step 4: The Nonce Spinner (Mini-Game)

For each broken block, you play a quick timing game:

- Hashes scroll across the block rapidly (like a slot machine)
- You see a **target pattern** (e.g., a hash starting with `0000...`)
- You hit **SPACEBAR** or **CLICK** when the scrolling hash matches the target
- **Perfect timing** = block re-mined instantly (BIG combo bonus)
- **Close timing** = block re-mined but slower (small bonus)
- **Miss** = you waste precious seconds and have to try again

As you progress through blocks #5 → #10, the hashes scroll **faster**, the target gets **harder**, and the honest network speeds up.

### Step 5: Power-Ups (If You've Earned Coins)

During the run, you earn coins for fast re-mines. You can spend them on:

| Power-Up | Cost | Effect |
|---|---|---|
| 🖥️ **Rent Hashpower** | 50 coins | Slows the honest network for 5 seconds |
| 🤝 **Bribe a Validator** | 100 coins | Skips one block entirely (auto-mines it) |

### Step 6: The Ending

**If you re-mine all blocks before the honest network overtakes you:**

> ✅ **"YOU REWROTE HISTORY."**
>
> Your score, combo streak, and time are displayed.  
> A unique SHA-256 hash of your entire run is generated as your **"Proof of Heist."**
>
> **"You ranked #4. Can you take #1?"**
>
> `[ 🔄 PLAY AGAIN ]`

**If the honest network overtakes you:**

> ❌ **"INVALID CHAIN — The Network Rejected Your Fork."**
>
> Your progress is shown. You see how close you were.
>
> **"The chain is unbreakable. Or is it? Try again."**
>
> `[ 🔄 PLAY AGAIN ]`

### Step 7: The Leaderboard

The top 10 scores are displayed on a separate screen (the "stall monitor"). Each entry looks like a block in a chain:

```
┌──────────────────────────────────┐
│  #1  |  Arjun_X    |  Score: 9840  │
│  Hash: a4f2e8c3...              │
│  Blocks: 6/6  |  Combo: 12x    │
├──────────────────────────────────┤
│  #2  |  CryptoQueen |  Score: 8720 │
│  Hash: 7b3d1ca9...              │
│  Blocks: 6/6  |  Combo: 9x     │
└──────────────────────────────────┘
```

### Step 8: Proof-of-Play Card (Optional)

After the game, a QR code appears. Players scan it to get a digital card with:
- Their name
- Their score
- Their run's unique SHA-256 hash
- The club's social media links

They'll screenshot it, share it, and give you free promotion.

---

## 🖥️ Game Screens & Flow

Here's every screen in the game and what it does:

```
┌─────────────────────────────────────────────────────────────────┐
│                        GAME FLOW                                │
│                                                                 │
│  ┌───────────┐    ┌───────────┐    ┌───────────────┐            │
│  │  SPLASH   │───▶│  TAMPER   │───▶│  RACE /       │            │
│  │  SCREEN   │    │  SCREEN   │    │  NONCE GAME   │            │
│  └───────────┘    └───────────┘    └───────┬───────┘            │
│                                      ┌─────┴─────┐             │
│                                      ▼           ▼             │
│                                ┌──────────┐ ┌──────────┐       │
│                                │   WIN    │ │   LOSE   │       │
│                                │  SCREEN  │ │  SCREEN  │       │
│                                └────┬─────┘ └────┬─────┘       │
│                                     │            │              │
│                                     ▼            ▼              │
│                                ┌───────────────────┐            │
│                                │    LEADERBOARD    │            │
│                                │  + PLAY AGAIN     │            │
│                                └───────────────────┘            │
│                                                                 │
│  SEPARATE DISPLAY:                                              │
│  ┌────────────────────────────┐                                 │
│  │  LIVE LEADERBOARD SCREEN  │  ◄── Runs on stall monitor      │
│  └────────────────────────────┘                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Screen 1: Splash / Title Screen
- Game title with glitch animation
- A glowing blockchain visual in the background
- **[ HACK THE CHAIN ]** button (pulsing)
- Select difficulty (Level 1–5)
- "Powered by Real SHA-256 Cryptography" badge at the bottom

### Screen 2: Tamper Screen
- The full 10-block chain displayed horizontally
- Block #4 highlighted with a "hack" cursor
- Player clicks to edit the transaction
- **Animation:** The edit propagates — blocks #5–#10 shatter one by one with cascading red cracks
- Transition: camera zooms into block #5, the race begins

### Screen 3: Race / Nonce Spinner (Main Game)
- **Top bar:** Timer (counting down), Score, Combo counter
- **Center:** The current block being re-mined, with the nonce spinner
- **Bottom bar:** Honest Network progress (growing left-to-right), Power-up buttons
- **Background:** The chain visualization showing which blocks are fixed (green) and broken (red)

### Screen 4: Win Screen
- **"YOU REWROTE HISTORY"** in massive glitch text
- Score breakdown (blocks mined, combo streak, time bonus, difficulty bonus)
- Unique SHA-256 run hash displayed
- QR code for proof-of-play card
- Leaderboard position reveal (with animation if it's a new high score)
- **[ PLAY AGAIN ]** button

### Screen 5: Lose Screen
- **"INVALID CHAIN"** with a "rejected" stamp animation
- How far the player got (e.g., "4/6 blocks re-mined")
- How close they were (e.g., "The network was only 2 blocks ahead")
- **[ TRY AGAIN ]** button (with a taunt: *"The chain is unbreakable. Or is it?"*)

### Screen 6: Live Leaderboard (Separate Display)
- Full-screen leaderboard running on the stall monitor
- Top 10 displayed as a vertical blockchain (each entry is a block)
- Auto-refreshes when a new score is submitted
- Flashes and plays a sound when a new #1 is achieved
- Shows "CURRENTLY PLAYING" with the active player's live score at the bottom

---

## 🎨 Visual Theme & Aesthetics

### The Vibe: **Cyberpunk Hacker Terminal**

Think *Mr. Robot* meets *Tron: Legacy* meets *The Matrix*. Dark backgrounds, neon accents, monospace fonts, and glitch effects everywhere.

### Color Palette

| Color | Hex Code | Where It's Used |
|---|---|---|
| **Deep Black** | `#0a0a0f` | Main background — everything sits on this |
| **Terminal Green** | `#00ff41` | Valid blocks, success states, "chain intact" glow |
| **Hack Red** | `#ff0040` | Broken blocks, errors, tamper effects, danger |
| **Neon Cyan** | `#00f0ff` | UI elements, hash text, borders, accents |
| **Electric Purple** | `#bf00ff` | Power-ups, bonus effects, combo streaks |
| **Amber Warning** | `#ffaa00` | Timer warnings, honest network bar, alerts |
| **Ghost White** | `#e0e0e0` | Body text, subtle labels |

### Typography

| Use | Font | Why |
|---|---|---|
| **Hash values & code** | `'Fira Code'` or `'JetBrains Mono'` | Monospace = looks like real terminal output |
| **Headings & titles** | `'Orbitron'` or `'Rajdhani'` | Futuristic, geometric, cyberpunk feel |
| **Body text** | `'Inter'` or `'Space Grotesk'` | Clean, modern, highly readable |

All fonts are available free from **Google Fonts**.

### Visual Effects

| Effect | Where | How |
|---|---|---|
| **Glitch text** | Title screen, win/lose text | CSS `clip-path` animation with color channel offset |
| **Neon glow** | Blocks, buttons, borders | CSS `box-shadow` with multiple color layers |
| **Scan lines** | Background overlay | Semi-transparent repeating linear gradient |
| **Screen shake** | When a block breaks or you miss a nonce | CSS `transform: translate()` animation with random values |
| **Particle burst** | When a block is successfully re-mined | Canvas particle system (small neon dots exploding outward) |
| **Chain crack** | When blocks break after tamper | SVG or Canvas crack lines spreading from the hash link |
| **CRT flicker** | Subtle background effect | CSS animation alternating opacity slightly |
| **Pulse glow** | Active/current block | CSS `@keyframes` scale + box-shadow pulse |

### Block Design

Each block on screen looks like this:

```
╔══════════════════════════╗
║  BLOCK #5                ║
║  ─────────────────────── ║
║  Prev: 7b3d1c...        ║
║  Data: TX_2099_VAULT     ║
║  ─────────────────────── ║
║  Nonce: ????             ║
║  Hash:  ██████████       ║
║                          ║
║  Status: 🔴 BROKEN       ║
╚══════════════════════════╝
```

When re-mined, it transitions to:

```
╔══════════════════════════╗  ← Green neon glow
║  BLOCK #5           ✅   ║
║  ─────────────────────── ║
║  Prev: 7b3d1c...        ║
║  Data: TX_2099_VAULT     ║
║  ─────────────────────── ║
║  Nonce: 48291            ║
║  Hash:  0000a4f2e8c3...  ║
║                          ║
║  Status: 🟢 RE-MINED     ║
╚══════════════════════════╝
```

---

## 🔊 Sound Design

Audio is **50% of the game experience**. A silent game feels dead. Here's the sound map:

| Moment | Sound | Mood |
|---|---|---|
| **Title screen** | Low synthwave hum, ambient digital noise | Mysterious, inviting |
| **Tamper moment** | Deep bass "BOOM" + digital crack/shatter | Dramatic, "oh shit" |
| **Chain breaking** | Cascading glass-break sounds (one per block) | Satisfying destruction |
| **Nonce scrolling** | Rapid digital clicking / ticker tape sound | Tension, speed |
| **Perfect nonce hit** | Crisp mechanical "CLICK" + synth chord | Extremely satisfying (like a mechanical keyboard) |
| **Missed nonce** | Buzzer / error tone | Frustration, urgency |
| **Block re-mined** | Rising synth note + energy pulse | Achievement |
| **Combo streak (3+)** | Ascending chime melody | Hype, flow state |
| **Honest network growing** | Subtle heartbeat / pulse (gets faster) | Subconscious pressure |
| **Last 10 seconds** | Alarm siren + bass rumble + heartbeat | PURE PANIC |
| **Win** | Epic synth fanfare + crowd cheer | Triumph |
| **Lose** | Deep bass drop + flatline tone | Dramatic failure |
| **New #1 on leaderboard** | Loud siren + "WHALE ALERT" voice clip | Crowd hype |

### Where to Get Free Sounds

- [freesound.org](https://freesound.org) — Free sound effects (CC licensed)
- [pixabay.com/sound-effects](https://pixabay.com/sound-effects/) — Royalty-free sounds
- [sfxr.me](https://sfxr.me) — Generate retro/synth game sounds in your browser
- [Uppbeat](https://uppbeat.io) — Free background music for creators

---

## ⚙️ Tech Stack (What's Under the Hood)

> *"I'm not a developer, what does this mean?"*  
> No worries — here's every technology explained simply.

| Technology | What It Does | Why We Use It | Beginner Analogy |
|---|---|---|---|
| **HTML5** | The skeleton of the webpage | Every website needs it | The bones of a body |
| **CSS3** | Makes everything look pretty (colors, animations) | The neon cyberpunk theme | The skin, clothes, and makeup |
| **JavaScript (ES6+)** | The game logic — what happens when you click | It's the brain of the game | The muscles and nervous system |
| **Phaser 3** | A game engine that handles sprites, animations, physics | Makes building a 2D game 10x faster than doing it from scratch | A pre-built engine for a car (you don't build the engine, you just drive) |
| **Web Crypto API** | Computes REAL SHA-256 hashes in your browser | So our hashes aren't fake — they're actual cryptography | A built-in calculator in your browser |
| **Firebase / Supabase** | Cloud database for the leaderboard | Stores high scores so they persist and sync across devices | A Google Sheet in the cloud that updates in real time |
| **Vercel / Netlify** | Hosts the game on the internet | So anyone with a link can play | A parking spot for your website on the internet |
| **localStorage** | Saves data in the player's browser | Offline leaderboard backup when there's no Wi-Fi | A sticky note inside the browser that remembers things |

### Why Phaser 3?

We chose **Phaser 3** (not raw Canvas, not Unity, not Godot) because:

1. **It's JavaScript-native** — no compilation, no build step needed for MVP
2. **It's lightweight** — loads in seconds on old laptops (critical for stall use)
3. **It handles sprite animation, input, audio, and scenes** out of the box
4. **Massive community** — tons of tutorials, examples, and free assets
5. **No install required** — it runs in any browser

If the team is more comfortable with **raw HTML5 Canvas + Vanilla JS**, that works too. The game mechanics are simple enough. Phaser just saves time.

---

## 📂 Project Structure

```
chain-heist/
│
├── index.html              ← The single entry point (open this in a browser to play)
├── leaderboard.html        ← Standalone leaderboard display (for the stall monitor)
│
├── css/
│   ├── main.css            ← Core styles, layout, dark theme
│   ├── animations.css      ← Glitch, glow, shake, pulse effects
│   └── leaderboard.css     ← Styles for the leaderboard screen
│
├── js/
│   ├── main.js             ← Game initialization, Phaser config
│   ├── scenes/
│   │   ├── SplashScene.js   ← Title screen + difficulty select
│   │   ├── TamperScene.js   ← Chain display + tamper animation
│   │   ├── RaceScene.js     ← Main gameplay (nonce spinner + race)
│   │   ├── WinScene.js      ← Victory screen + score + QR
│   │   └── LoseScene.js     ← Defeat screen + retry
│   │
│   ├── systems/
│   │   ├── Blockchain.js    ← Block class, chain logic, hash computation (SHA-256)
│   │   ├── NonceSpinner.js  ← The timing mini-game mechanic
│   │   ├── HonestNetwork.js ← The AI "race bar" that competes against you
│   │   ├── PowerUps.js      ← Hashpower rental, validator bribe logic
│   │   └── Scoring.js       ← Score calculation, combo system
│   │
│   ├── ui/
│   │   ├── HUD.js           ← Timer, score, combo display during gameplay
│   │   ├── Leaderboard.js   ← Leaderboard read/write logic
│   │   └── ProofOfPlay.js   ← QR code generation for shareable card
│   │
│   └── utils/
│       ├── crypto.js        ← Web Crypto API wrapper for SHA-256
│       ├── audio.js         ← Sound manager (load, play, volume)
│       ├── storage.js       ← localStorage helper (offline scores)
│       └── config.js        ← All game constants (speeds, difficulty, colors)
│
├── assets/
│   ├── audio/
│   │   ├── bgm_ambient.mp3       ← Background synthwave hum
│   │   ├── sfx_tamper.mp3         ← Chain-breaking explosion
│   │   ├── sfx_nonce_scroll.mp3   ← Ticker sound for hash scrolling
│   │   ├── sfx_nonce_hit.mp3      ← Satisfying "click" for correct nonce
│   │   ├── sfx_nonce_miss.mp3     ← Error buzzer
│   │   ├── sfx_block_mined.mp3    ← Rising synth note
│   │   ├── sfx_combo.mp3          ← Ascending chime
│   │   ├── sfx_alarm.mp3          ← Last 10 seconds panic
│   │   ├── sfx_win.mp3            ← Victory fanfare
│   │   └── sfx_lose.mp3           ← Defeat bass drop
│   │
│   ├── images/
│   │   ├── block_valid.png        ← Green block sprite
│   │   ├── block_broken.png       ← Red cracked block sprite
│   │   ├── block_mining.png       ← Animated mining block
│   │   ├── particles/             ← Particle effect sprites
│   │   └── bg_grid.png            ← Subtle grid background pattern
│   │
│   └── fonts/
│       ├── Orbitron.woff2         ← Futuristic heading font
│       └── FiraCode.woff2         ← Monospace hash font
│
├── config/
│   ├── firebase.config.js   ← Firebase project credentials (for leaderboard)
│   └── difficulty.json      ← Difficulty level presets
│
├── package.json             ← Project metadata + scripts
├── vercel.json              ← Vercel deployment config
├── .gitignore               ← Files to exclude from Git
└── README.md                ← You are here! 👋
```

---

## 🚀 Quick Start (Play in 2 Minutes)

### Option A: Just Open It (Zero Setup)

If you don't need the leaderboard and just want to play:

```bash
# Clone the repo
git clone https://github.com/YOUR_USERNAME/chain-heist.git

# Open the game in your browser
# Windows:
start chain-heist/index.html

# Mac:
open chain-heist/index.html

# Linux:
xdg-open chain-heist/index.html
```

That's it. The game runs entirely in the browser with no server needed.

### Option B: With a Local Server (Recommended)

Some browsers block `localStorage` and audio on `file://` URLs. A local server fixes that:

```bash
# If you have Node.js installed:
npx serve chain-heist/

# Or if you have Python installed:
cd chain-heist
python -m http.server 8080

# Then open: http://localhost:8080
```

---

## 🛠️ Full Setup Guide (From Scratch)

### Prerequisites

You'll need these installed on your computer. Don't worry — they're all free.

| Tool | What it does | How to install |
|---|---|---|
| **Git** | Version control (tracking code changes) | [git-scm.com/downloads](https://git-scm.com/downloads) |
| **Node.js** (v18+) | Runs JavaScript outside the browser | [nodejs.org](https://nodejs.org) (download the LTS version) |
| **A code editor** | Where you write code | [VS Code](https://code.visualstudio.com/) (free, most popular) |
| **A modern browser** | Where the game runs | Chrome, Firefox, or Edge (any recent version) |

### Step-by-Step Setup

```bash
# 1. Clone the repository
git clone https://github.com/YOUR_USERNAME/chain-heist.git
cd chain-heist

# 2. Install dependencies
npm install

# 3. Start the development server (with hot reload)
npm run dev

# 4. Open in your browser
#    The terminal will show a URL like: http://localhost:5173
#    Open that URL in Chrome or Firefox

# 5. Start developing!
#    Edit any file in the src/ folder
#    The browser will auto-refresh when you save
```

### NPM Scripts Reference

| Command | What It Does |
|---|---|
| `npm run dev` | Starts a local development server with live reload |
| `npm run build` | Creates an optimized production build in `dist/` |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Check code for errors and style issues |

---

## 🔧 Configuration & Customization

All game settings live in a single config file. You can tweak the entire game experience without touching game logic:

### `config/difficulty.json`

```json
{
  "levels": {
    "1": {
      "name": "Small Network",
      "roundTime": 90,
      "blocksToMine": 4,
      "nonceScrollSpeed": 2,
      "nonceTargetWindow": 500,
      "honestNetworkSpeed": 0.3,
      "powerUpsEnabled": true
    },
    "2": {
      "name": "Growing Network",
      "roundTime": 80,
      "blocksToMine": 5,
      "nonceScrollSpeed": 3,
      "nonceTargetWindow": 400,
      "honestNetworkSpeed": 0.5,
      "powerUpsEnabled": true
    },
    "3": {
      "name": "Mainnet",
      "roundTime": 75,
      "blocksToMine": 6,
      "nonceScrollSpeed": 4,
      "nonceTargetWindow": 300,
      "honestNetworkSpeed": 0.7,
      "powerUpsEnabled": true
    },
    "4": {
      "name": "Ethereum Mode",
      "roundTime": 70,
      "blocksToMine": 6,
      "nonceScrollSpeed": 5,
      "nonceTargetWindow": 200,
      "honestNetworkSpeed": 0.85,
      "powerUpsEnabled": true
    },
    "5": {
      "name": "Bitcoin Mode",
      "roundTime": 60,
      "blocksToMine": 6,
      "nonceScrollSpeed": 7,
      "nonceTargetWindow": 120,
      "honestNetworkSpeed": 1.0,
      "powerUpsEnabled": false
    }
  }
}
```

### What Each Setting Means

| Setting | What It Controls | Player Impact |
|---|---|---|
| `roundTime` | Total seconds for the round | Less time = more panic |
| `blocksToMine` | How many broken blocks to re-mine | More blocks = harder |
| `nonceScrollSpeed` | How fast the hash values scroll in the spinner | Faster = harder to time |
| `nonceTargetWindow` | Milliseconds of "perfect hit" window | Smaller = requires better reflexes |
| `honestNetworkSpeed` | How fast the honest network bar grows (0–1) | Higher = less time before you're overtaken |
| `powerUpsEnabled` | Whether power-ups are available | Disabled on Level 5 for maximum difficulty |

### Customizable Colors

In `js/utils/config.js`:

```javascript
export const THEME = {
  BG_PRIMARY:      '#0a0a0f',    // Main background
  BLOCK_VALID:     '#00ff41',    // Successfully mined blocks
  BLOCK_BROKEN:    '#ff0040',    // Broken / tampered blocks
  BLOCK_MINING:    '#ffaa00',    // Currently being mined
  TEXT_HASH:       '#00f0ff',    // Hash value display color
  ACCENT_PURPLE:   '#bf00ff',    // Power-ups and combos
  UI_BORDER:       '#1a1a2e',    // Panel borders
  NETWORK_BAR:     '#ff6600',    // Honest network progress bar
};
```

---

## 🌐 Deploy It Yourself

### Option 1: Vercel (Recommended — Easiest)

[Vercel](https://vercel.com) is free for personal projects and deploys in under a minute.

```bash
# 1. Install Vercel CLI
npm install -g vercel

# 2. Build the project
npm run build

# 3. Deploy
vercel

# 4. Follow the prompts:
#    - Link to your Vercel account (free sign-up)
#    - It auto-detects the framework
#    - Your game is live at: https://chain-heist.vercel.app (or similar)
```

Or just push to GitHub and connect the repo to Vercel's dashboard — it auto-deploys on every push.

#### `vercel.json` Configuration

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": null,
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

### Option 2: Netlify (Also Free & Easy)

```bash
# 1. Install Netlify CLI
npm install -g netlify-cli

# 2. Build
npm run build

# 3. Deploy
netlify deploy --prod --dir=dist

# Your game is live at: https://chain-heist.netlify.app
```

### Option 3: GitHub Pages (Free, Good for Simple Builds)

```bash
# 1. Build the project
npm run build

# 2. Deploy to GitHub Pages (using gh-pages package)
npm install -D gh-pages

# 3. Add to package.json scripts:
#    "deploy": "gh-pages -d dist"

# 4. Run:
npm run deploy

# Your game is live at: https://YOUR_USERNAME.github.io/chain-heist/
```

### Option 4: Run Locally at the Stall (No Internet Needed)

If the venue Wi-Fi is unreliable (it usually is), you can run everything locally:

```bash
# Build the project
npm run build

# The dist/ folder contains the entire game as static files
# Copy dist/ to a USB drive
# On the stall laptop, just open dist/index.html in Chrome

# For multiple laptops sharing a leaderboard, run a local server:
npx serve dist/ -l 8080

# Other laptops on the same Wi-Fi can connect to:
# http://YOUR_LAPTOP_IP:8080
```

> **Pro tip:** Find your laptop's IP address:
> - **Windows:** Open Command Prompt → type `ipconfig` → look for "IPv4 Address"
> - **Mac/Linux:** Open Terminal → type `ifconfig` or `ip addr`

---

## 🏆 Leaderboard Setup

### Option A: Firebase (Cloud — Scores Sync Across Devices)

1. Go to [console.firebase.google.com](https://console.firebase.google.com)
2. Create a new project (free tier is more than enough)
3. Enable **Firestore Database** (start in test mode for the event)
4. Copy your Firebase config into `config/firebase.config.js`:

```javascript
// config/firebase.config.js
export const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "chain-heist.firebaseapp.com",
  projectId: "chain-heist",
  storageBucket: "chain-heist.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
};
```

5. Firestore structure (auto-created by the game):

```
leaderboard/
  ├── {auto-id}/
  │     ├── name: "Arjun_X"
  │     ├── score: 9840
  │     ├── combo: 12
  │     ├── blocks: 6
  │     ├── level: 3
  │     ├── runHash: "a4f2e8c3..."
  │     └── timestamp: 1698300000
  └── ...
```

### Option B: Supabase (Alternative Cloud DB)

Works the same way. Create a free project at [supabase.com](https://supabase.com), create a `leaderboard` table, and connect via the Supabase JS client.

### Option C: localStorage Only (Offline / No Setup)

If you don't want to mess with any cloud service, the game automatically falls back to `localStorage`. Scores are saved in the browser and persist between page reloads. The catch: scores won't sync across different laptops.

**For the event, this is totally fine** if each laptop runs independently. Just make sure the leaderboard display laptop is also the main game laptop.

---

## 📴 Offline Mode (No Wi-Fi? No Problem)

College venue Wi-Fi is notoriously unreliable. The game is designed to work **100% offline**:

| Feature | Online | Offline |
|---|---|---|
| Core gameplay | ✅ | ✅ |
| SHA-256 hashing | ✅ (Web Crypto API is local) | ✅ |
| Sound effects | ✅ | ✅ (files are bundled) |
| Leaderboard | ✅ (Firebase) | ✅ (falls back to localStorage) |
| Proof-of-play QR | ✅ (links to online card) | ⚠️ (QR generates but link may not load) |
| Testnet hash publish | ✅ | ❌ (optional feature, skip it) |

### How to Prepare Offline Mode

```bash
# Build the project
npm run build

# The dist/ folder is completely self-contained
# Copy it to a USB drive
# On the stall laptop, open dist/index.html
# Everything works without internet
```

---

## 🐛 Troubleshooting

### Common Issues & Fixes

| Problem | Cause | Fix |
|---|---|---|
| **Game won't load** | Browser blocking local files | Use a local server (`npx serve .` or `python -m http.server`) |
| **No sound** | Browser autoplay policy | User must interact (click) before audio can play. The START button handles this. |
| **Hashes look random / wrong** | Web Crypto API not available | Only happens in very old browsers. Use Chrome 60+ or Firefox 60+. |
| **Leaderboard not syncing** | Firebase not configured / no internet | Game falls back to localStorage automatically. Scores save locally. |
| **Game is laggy** | Too many particles / old hardware | Reduce particle count in config. Close other browser tabs. |
| **Nonce spinner too fast/slow** | Difficulty misconfigured | Adjust `nonceScrollSpeed` and `nonceTargetWindow` in `difficulty.json` |
| **Screen too small** | Low resolution display | The game is responsive but optimized for 1280×720+. Use full-screen (F11). |
| **CORS errors in console** | Running from `file://` protocol | Switch to a local HTTP server (see Quick Start section) |

### Getting Help

- **Phaser 3 docs:** [phaser.io/docs](https://phaser.io/docs)
- **Web Crypto API:** [MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/digest)
- **Firebase Firestore:** [firebase.google.com/docs/firestore](https://firebase.google.com/docs/firestore)

---

## 🧪 Testing Checklist (Before the Event)

Run through this checklist on **every stall laptop**:

- [ ] Game loads without errors in the browser console (F12 → Console tab)
- [ ] Title screen displays correctly with all fonts loaded
- [ ] "HACK THE CHAIN" button is clickable and starts the game
- [ ] Tamper animation plays (chain turns red)
- [ ] Nonce spinner responds to clicks/spacebar
- [ ] Timer counts down correctly
- [ ] Honest network bar progresses
- [ ] Win screen displays with correct score
- [ ] Lose screen displays when time runs out
- [ ] Leaderboard saves and displays scores
- [ ] Sound effects play through the speaker
- [ ] "PLAY AGAIN" button works without page reload
- [ ] Game works in offline mode (disconnect Wi-Fi and test)
- [ ] Game works in full-screen mode (F11)
- [ ] QR code generates on the results screen
- [ ] No lag or frame drops during gameplay

---

## 🤝 Contributing

This is a college club project, but if you want to contribute:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Priority Contributions Needed

- [ ] Additional block animations and particle effects
- [ ] Mobile touch support optimization
- [ ] More difficulty levels
- [ ] Multilingual support
- [ ] Accessibility improvements (screen reader, color-blind mode)

---

## 📜 Credits & License

### Built By

**Blockchain Club** — for Club Battle: Techverse

### Technologies

- [Phaser 3](https://phaser.io/) — HTML5 Game Framework
- [Web Crypto API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API) — SHA-256 Hashing
- [Firebase](https://firebase.google.com/) — Leaderboard Database
- [Google Fonts](https://fonts.google.com/) — Orbitron, Fira Code, Inter
- [Vercel](https://vercel.com/) — Deployment

### License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

You are free to use, modify, and distribute this project. If you build something cool with it, let us know!

---

<p align="center">
  <b>⛓️ THE CHAIN IS UNBREAKABLE. OR IS IT? ⛓️</b>
  <br/><br/>
  <i>Built with ❤️, SHA-256, and too much caffeine.</i>
</p>
