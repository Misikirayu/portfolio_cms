const { count, eq } = require("drizzle-orm");
const { db, schema } = require("../../../lib/db");
const { requireAdmin } = require("../../../lib/requireAdmin");

async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    res.status(405).json({ error: `Method ${req.method} not allowed` });
    return;
  }

  const [[projectCount], [skillCount], [experienceCount], [messageCount], [unreadCount]] = await Promise.all([
    db.select({ value: count() }).from(schema.projects),
    db.select({ value: count() }).from(schema.skills),
    db.select({ value: count() }).from(schema.experience),
    db.select({ value: count() }).from(schema.messages),
    db.select({ value: count() }).from(schema.messages).where(eq(schema.messages.isRead, false)),
  ]);

  res.status(200).json({
    projects: projectCount.value,
    skills: skillCount.value,
    experience: experienceCount.value,
    messages: messageCount.value,
    unread: unreadCount.value,
  });
}

export default requireAdmin(handler);
