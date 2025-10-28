const { kv } = require('@vercel/kv');

module.exports = async (req, res) => {
  const { id: giftId } = req.query;

  try {
    const giftData = await kv.get(`gift:${giftId}`);

    if (!giftData) {
      return res.status(404).json({ error: 'Gift not found' });
    }

    const gift = JSON.parse(giftData);
    const currentTime = Date.now();

    if (currentTime > gift.expiresAt) {
      await kv.del(`gift:${giftId}`);
      return res.status(410).json({ error: 'Gift link has expired' });
    }

    res.json({
      recipientName: gift.recipientName,
      message: currentTime >= gift.revealAt ? gift.message : null,
      timeRemaining: Math.max(0, gift.revealAt - currentTime),
      isRevealed: currentTime >= gift.revealAt,
      giftId
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};