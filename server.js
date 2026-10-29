import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: { origin: '*', methods: ['GET', 'POST'] },
});

app.use(cors());
app.use(express.json());

// Ensure server data directory exists
const dataDir = join(__dirname, 'server');
if (!existsSync(dataDir)) mkdirSync(dataDir, { recursive: true });

const LB_FILE = join(dataDir, 'leaderboard.json');

function readLeaderboard() {
  if (!existsSync(LB_FILE)) return [];
  try {
    return JSON.parse(readFileSync(LB_FILE, 'utf-8'));
  } catch {
    return [];
  }
}

function writeLeaderboard(data) {
  writeFileSync(LB_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

// REST API
app.get('/api/leaderboard', (_req, res) => {
  const lb = readLeaderboard();
  res.json(lb.sort((a, b) => b.score - a.score).slice(0, 20));
});

app.post('/api/leaderboard', (req, res) => {
  const { name, score, combo, blocks, level, runHash } = req.body;
  if (!name || score == null) return res.status(400).json({ error: 'name and score required' });

  const entry = {
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
    name: String(name).slice(0, 20),
    score: Number(score),
    combo: Number(combo) || 0,
    blocks: Number(blocks) || 0,
    level: Number(level) || 1,
    runHash: String(runHash || '').slice(0, 64),
    timestamp: Date.now(),
  };

  const lb = readLeaderboard();
  lb.push(entry);
  lb.sort((a, b) => b.score - a.score);
  writeLeaderboard(lb.slice(0, 100)); // Keep top 100

  const rank = lb.findIndex((e) => e.id === entry.id) + 1;
  const isNewTop = rank === 1 && lb.length > 1;

  // Broadcast to all connected leaderboard displays
  io.emit('leaderboard:update', { leaderboard: lb.slice(0, 20), newEntry: entry, rank });
  if (isNewTop) {
    io.emit('whale:alert', { entry });
  }

  res.json({ rank, entry });
});

// WebSocket events
io.on('connection', (socket) => {
  console.log(`[Socket.io] Client connected: ${socket.id}`);

  // Player progress relay
  socket.on('player:progress', (data) => {
    socket.broadcast.emit('player:progress', data);
  });

  socket.on('block:mined', (data) => {
    socket.broadcast.emit('block:mined', data);
  });

  socket.on('disconnect', () => {
    console.log(`[Socket.io] Client disconnected: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
  console.log(`\n  ⛓️  CHAIN HEIST Server running on http://localhost:${PORT}`);
  console.log(`  📊 Leaderboard API: http://localhost:${PORT}/api/leaderboard\n`);
});
