const { eq } = require("drizzle-orm");
const { db, schema } = require("../../../lib/db");
const { requireAdmin } = require("../../../lib/requireAdmin");
const { skillSchema } = require("../../../lib/validations");

async function handler(req, res) {
  const id = Number(req.query.id);
  if (!Number.isInteger(id)) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }

  if (req.method === "PUT") {
    return requireAdmin(async (req, res) => {
      const parsed = skillSchema.partial().safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({ error: "Validation failed", issues: parsed.error.issues });
        return;
      }
      await db.update(schema.skills).set(parsed.data).where(eq(schema.skills.id, id));
      const [updated] = await db.select().from(schema.skills).where(eq(schema.skills.id, id));
      if (!updated) {
        res.status(404).json({ error: "Not found" });
        return;
      }
      res.status(200).json(updated);
    })(req, res);
  }

  if (req.method === "DELETE") {
    return requireAdmin(async (req, res) => {
      await db.delete(schema.skills).where(eq(schema.skills.id, id));
      res.status(204).end();
    })(req, res);
  }

  res.setHeader("Allow", ["PUT", "DELETE"]);
  res.status(405).json({ error: `Method ${req.method} not allowed` });
}

export default handler;
