// Simple in-memory rate limiter for scaffolding purposes.
// Not suitable for production — replace with Redis-backed limiter for multiple instances.

const stores = new Map();

export function rateLimiter({ windowMs = 60_000, max = 5 } = {}) {
  return (req, res, next) => {
    try {
      const key = req.ip || req.connection.remoteAddress || req.headers['x-real-ip'] || 'unknown';
      const now = Date.now();
      const entry = stores.get(key) || { count: 0, resetAt: now + windowMs };

      if (now > entry.resetAt) {
        entry.count = 0;
        entry.resetAt = now + windowMs;
      }

      entry.count += 1;
      stores.set(key, entry);

      res.setHeader('X-RateLimit-Limit', max);
      res.setHeader('X-RateLimit-Remaining', Math.max(0, max - entry.count));
      res.setHeader('X-RateLimit-Reset', Math.ceil(entry.resetAt / 1000));

      if (entry.count > max) {
        return res.status(429).json({ success: false, message: 'Too many requests, please try later.' });
      }

      next();
    } catch (err) {
      // On error, allow request (fail-open) but log
      // Console used for now; integrate with structured logger later.
      console.error('Rate limiter error', err);
      next();
    }
  };
}
