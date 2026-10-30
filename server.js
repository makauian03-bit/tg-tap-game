const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Serve static files (like index.html) from the root directory
app.use(express.static(path.join(__dirname)));

// Temporary in-memory database for scores
let scores = {};

// API: Get score for a user
app.get('/api/score/:telegramId', (req, res) => {
    const { telegramId } = req.params;
    res.json({ score: scores[telegramId] || 0 });
});

// API: Increment score on tap
app.post('/api/tap', (req, res) => {
    const { telegramId } = req.body;
    if (!telegramId) {
        return res.status(400).json({ error: 'telegramId is required' });
    }
    scores[telegramId] = (scores[telegramId] || 0) + 1;
    res.json({ score: scores[telegramId] });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});