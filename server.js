const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cors());

// Temporary in-memory database (Stores user scores by their Telegram User ID)
const users = {};

// 1. Get or Create User Route
app.post('/api/user', (req, res) => {
    const { telegramId, username } = req.body;

    if (!telegramId) {
        return res.status(400).json({ error: 'Telegram ID is required' });
    }

    if (!users[telegramId]) {
        users[telegramId] = {
            username: username || 'Player',
            score: 0,
            energy: 1000
        };
    }

    res.json(users[telegramId]);
});

// 2. Update Score Route (triggered when user taps)
app.post('/api/score', (req, res) => {
    const { telegramId, score, energy } = req.body;

    if (!users[telegramId]) {
        return res.status(404).json({ error: 'User not found' });
    }

    // Update user's progress
    users[telegramId].score = score;
    users[telegramId].energy = energy;

    res.json({ success: true, updatedScore: users[telegramId].score });
});

// 3. Leaderboard Route (top players)
app.get('/api/leaderboard', (req, res) => {
    const sortedUsers = Object.entries(users)
        .map(([id, data]) => ({ id, ...data }))
        .sort((a, b) => b.score - a.score)
        .slice(0, 10); // Top 10 players

    res.json(sortedUsers);
});

// Start the server
app.listen(PORT, () => {
    console.log(`Game server running on http://localhost:${PORT}`);
});