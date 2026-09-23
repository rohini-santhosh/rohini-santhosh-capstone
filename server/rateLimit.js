"use strict";

// Simple in-memory per-IP limiter factory. Good enough for a single-instance
// deployment; not distributed-safe, which is fine at this scale.

function makeRateLimit({ windowMs, max, message }) {
  const hits = new Map(); // ip -> [timestamps]

  return function rateLimit(req, res, next) {
    const ip = req.ip || req.socket.remoteAddress || "unknown";
    const now = Date.now();
    const timestamps = (hits.get(ip) || []).filter((t) => now - t < windowMs);

    if (timestamps.length >= max) {
      return res.status(429).json({ error: message });
    }

    timestamps.push(now);
    hits.set(ip, timestamps);
    next();
  };
}

module.exports = { makeRateLimit };
