const { db, schema } = require("../../lib/db");
const { contactSchema } = require("../../lib/validations");

// Very small in-memory rate limiter per server instance: 5 submissions / 10 min / IP.
const hits = new Map();
const WINDOW_MS = 10 * 60 * 1000;
const MAX_HITS = 5;

function isRateLimited(ip) {
  const now = Date.now();
  const entry = hits.get(ip) || { count: 0, resetAt: now + WINDOW_MS };
  if (now > entry.resetAt) {
    entry.count = 0;
    entry.resetAt = now + WINDOW_MS;
  }
  entry.count += 1;
  hits.set(ip, entry);
  return entry.count > MAX_HITS;
}

async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    res.status(405).json({ error: `Method ${req.method} not allowed` });
    return;
  }

  const ip = (req.headers["x-forwarded-for"] || req.socket?.remoteAddress || "unknown").split(",")[0].trim();
  if (isRateLimited(ip)) {
    res.status(429).json({ error: "Too many submissions. Try again later." });
    return;
  }

  const parsed = contactSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Validation failed", issues: parsed.error.issues });
    return;
  }

  // Basic honeypot support: if the client sends a hidden `website` field
  // filled in by a bot, silently accept without writing to the DB.
  if (req.body?.website) {
    res.status(200).json({ ok: true });
    return;
  }

  await db.insert(schema.messages).values(parsed.data);
  res.status(201).json({ ok: true });
}

export default handler;
