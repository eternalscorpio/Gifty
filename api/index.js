const express = require('express');
const crypto = require('crypto');
const path = require('path');
const app = express();

app.use(express.json());
app.use(express.static('public'));

const gifts = new Map();

app.get('/gift/:giftId', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'gift.html'));
});

app.post('/api/create-gift', (req, res) => {
    const { recipientName, revealAt, message } = req.body;
    if (!recipientName || !revealAt || !message) {
        return res.status(400).json({ error: 'All fields are required' });
    }
    const currentTime = Date.now();
    if (revealAt <= currentTime) {
        return res.status(400).json({ error: 'Reveal time must be in the future' });
    }
    const expiresAt = revealAt + 3600000; // 1 hour after reveal
    const giftId = crypto.randomBytes(16).toString('hex');
    gifts.set(giftId, {
        recipientName,
        message,
        revealAt,
        expiresAt
    });
    setTimeout(() => gifts.delete(giftId), expiresAt - currentTime);
    const giftUrl = `${req.protocol}://${req.get('host')}/gift/${giftId}`;
    res.json({ giftUrl, giftId });
});

app.get('/api/gift/:giftId', (req, res) => {
    const gift = gifts.get(req.params.giftId);
    const currentTime = Date.now();
    if (!gift) {
        return res.status(404).json({ error: 'Gift not found' });
    }
    if (currentTime > gift.expiresAt) {
        gifts.delete(req.params.giftId);
        return res.status(410).json({ error: 'Gift link has expired' });
    }
    const timeRemaining = Math.max(0, gift.revealAt - currentTime);
    const isRevealed = currentTime >= gift.revealAt;
    res.json({
        recipientName: gift.recipientName,
        message: isRevealed ? gift.message : null,
        timeRemaining,
        isRevealed,
        giftId: req.params.giftId
    });
});

app.listen(3000, () => console.log('Server running on port 3000'));