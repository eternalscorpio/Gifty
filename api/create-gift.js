const crypto = require('crypto');
const gifts = new Map(); // Temporary in-memory storage

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { recipientName, revealAt, message } = req.body;
    
    // Validation (same as your original code)
    if (!recipientName || !revealAt || !message) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const currentTime = Date.now();
    if (revealAt <= currentTime) {
      return res.status(400).json({ error: 'Reveal time must be in the future' });
    }

    const giftId = crypto.randomBytes(16).toString('hex');
    const expiresAt = revealAt + 3600000; // 1 hour after reveal
    
    gifts.set(giftId, { recipientName, message, revealAt, expiresAt });
    
    res.json({ 
      giftUrl: `https://${req.headers.host}/gift/${giftId}`, 
      giftId 
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};