const gifts = new Map(); // Must match the one in create-gift.js

module.exports = async (req, res) => {
  const { giftId } = req.query;
  const gift = gifts.get(giftId);

  if (!gift) {
    return res.status(404).json({ error: 'Gift not found' });
  }

  const currentTime = Date.now();
  if (currentTime > gift.expiresAt) {
    gifts.delete(giftId);
    return res.status(410).json({ error: 'Gift link has expired' });
  }

  res.json({
    recipientName: gift.recipientName,
    message: currentTime >= gift.revealAt ? gift.message : null,
    timeRemaining: Math.max(0, gift.revealAt - currentTime),
    isRevealed: currentTime >= gift.revealAt,
    giftId
  });
};