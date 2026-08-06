const { eq } = require("drizzle-orm");
const { db, schema } = require("../../../../lib/db");
const { requireAdmin } = require("../../../../lib/requireAdmin");

async function handler(req, res) {
  const id = Number(req.query.id);
  if (!Number.isInteger(id)) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }

  if (req.method === "PUT") {
    const isRead = Boolean(req.body?.isRead);
    await db.update(schema.messages).set({ isRead }).where(eq(schema.messages.id, id));
    const [updated] = await db.select().from(schema.messages).where(eq(schema.messages.id, id));
    if (!updated) {
      res.status(404).json({ error: "Not found" });
      return;
    }
    res.status(200).json(updated);
    return;
  }

  if (req.method === "DELETE") {
    await db.delete(schema.messages).where(eq(schema.messages.id, id));
    res.status(204).end();
    return;
  }

  res.setHeader("Allow", ["PUT", "DELETE"]);
  res.status(405).json({ error: `Method ${req.method} not allowed` });
}

export default requireAdmin(handler);
