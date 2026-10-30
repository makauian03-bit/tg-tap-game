const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname)));

// User database simulation: { telegramId: { score: 0, autoTapperLevel: 0 } }
let users = {};

// Helper to get or create user profile
function getUser(telegramId) {
    if (!users[telegramId]) {
        users[telegramId] = { score: 0, autoTapperLevel: 0 };
    }
    return users[telegramId];
}

// API: Get score & upgrade level
app.get('/api/score/:telegramId', (req, res) => {
    const { telegramId } = req.params;
    const user = getUser(telegramId);
    res.json({ score: user.score, autoTapperLevel: user.autoTapperLevel });
});

// API: Tap increment (+1)
app.post('/api/tap', (req, res) => {
    const { telegramId } = req.body;
    if (!telegramId) return res.status(400).json({ error: 'telegramId required' });
    
    const user = getUser(telegramId);
    user.score += 1;
    res.json({ score: user.score });
});

// API: Buy Auto-Tapper Upgrade
app.post('/api/upgrade', (req, res) => {
    const { telegramId } = req.body;
    if (!telegramId) return res.status(400).json({ error: 'telegramId required' });

    const user = getUser(telegramId);
    const cost = (user.autoTapperLevel + 1) * 50;

    if (user.score >= cost) {
        user.score -= cost;
        user.autoTapperLevel += 1;
        res.json({ success: true, score: user.score, autoTapperLevel: user.autoTapperLevel });
    } else {
        res.json({ success: false, message: 'Not enough coins to buy upgrade!' });
    }
});

// API: Passive income tick (called every second by client if level > 0)
app.post('/api/passive-tick', (req, res) => {
    const { telegramId } = req.body;
    if (!telegramId) return res.status(400).json({ error: 'telegramId required' });

    const user = getUser(telegramId);
    if (user.autoTapperLevel > 0) {
        user.score += user.autoTapperLevel; // Adds points equal to auto-tapper level each second
    }
    res.json({ score: user.score });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});