const { desc } = require("drizzle-orm");
const { db, schema } = require("../../../../lib/db");
const { requireAdmin } = require("../../../../lib/requireAdmin");

async function handler(req, res) {
  if (req.method === "GET") {
    const rows = await db.select().from(schema.messages).orderBy(desc(schema.messages.createdAt));
    res.status(200).json(rows);
    return;
  }

  res.setHeader("Allow", ["GET"]);
  res.status(405).json({ error: `Method ${req.method} not allowed` });
}

export default requireAdmin(handler);
