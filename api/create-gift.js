const { kv } = require('@vercel/kv');
const crypto = require('crypto');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { recipientName, revealAt, message } = req.body;

    // Validation
    if (!recipientName || !revealAt || !message) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const currentTime = Date.now();
    if (revealAt <= currentTime) {
      return res.status(400).json({ error: 'Reveal time must be in the future' });
    }

    const giftId = crypto.randomBytes(16).toString('hex');
    const expiresAt = revealAt + 3600000; // 1 hour after reveal

    // Store in Vercel KV
    await kv.set(`gift:${giftId}`, JSON.stringify({
      recipientName,
      message,
      revealAt,
      expiresAt
    }), { ex: Math.ceil((expiresAt - currentTime) / 1000) }); // Set TTL

    res.json({
      giftUrl: `https://${req.headers.host}/gift/${giftId}`,
      giftId
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};