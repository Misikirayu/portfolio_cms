const { asc } = require("drizzle-orm");
const { db, schema } = require("../../../lib/db");
const { requireAdmin } = require("../../../lib/requireAdmin");
const { experienceSchema } = require("../../../lib/validations");

async function handler(req, res) {
  if (req.method === "GET") {
    const rows = await db.select().from(schema.experience).orderBy(asc(schema.experience.orderIndex));
    res.status(200).json(rows);
    return;
  }

  if (req.method === "POST") {
    return requireAdmin(async (req, res) => {
      const parsed = experienceSchema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({ error: "Validation failed", issues: parsed.error.issues });
        return;
      }
      const result = await db.insert(schema.experience).values(parsed.data);
      const insertId = result[0]?.insertId ?? result.insertId;
      res.status(201).json({ id: insertId, ...parsed.data });
    })(req, res);
  }

  res.setHeader("Allow", ["GET", "POST"]);
  res.status(405).json({ error: `Method ${req.method} not allowed` });
}

export default handler;
