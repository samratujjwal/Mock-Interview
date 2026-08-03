// User-aware in-memory rate limiter (dev-only). Use Redis in production.
const userStores = new Map();

export function codingRateLimiter({ windowMs = 60_000, max = 20 } = {}) {
  return (req, res, next) => {
    try {
      const now = Date.now();
      const userKey = (req.user && req.user._id) ? String(req.user._id) : (req.ip || req.headers['x-real-ip'] || 'anon');
      const entry = userStores.get(userKey) || { count: 0, resetAt: now + windowMs };

      if (now > entry.resetAt) {
        entry.count = 0;
        entry.resetAt = now + windowMs;
      }

      entry.count += 1;
      userStores.set(userKey, entry);

      res.setHeader('X-RateLimit-Limit', max);
      res.setHeader('X-RateLimit-Remaining', Math.max(0, max - entry.count));
      res.setHeader('X-RateLimit-Reset', Math.ceil(entry.resetAt / 1000));

      if (entry.count > max) {
        return res.status(429).json({ success: false, message: 'Too many submissions, please try later.' });
      }

      next();
    } catch (err) {
      console.error('codingRateLimiter error', err);
      next();
    }
  };
}
