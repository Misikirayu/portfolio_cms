const { asc, eq } = require("drizzle-orm");
const { db, schema } = require("../../../lib/db");
const { requireAdmin } = require("../../../lib/requireAdmin");
const { projectSchema } = require("../../../lib/validations");

async function handler(req, res) {
  if (req.method === "GET") {
    const rows = await db.select().from(schema.projects).orderBy(asc(schema.projects.orderIndex));
    res.status(200).json(rows);
    return;
  }

  if (req.method === "POST") {
    return requireAdmin(async (req, res) => {
      const parsed = projectSchema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({ error: "Validation failed", issues: parsed.error.issues });
        return;
      }

      const [dupe] = await db
        .select()
        .from(schema.projects)
        .where(eq(schema.projects.slug, parsed.data.slug))
        .limit(1);
      if (dupe) {
        res.status(409).json({ error: "A project with this slug already exists" });
        return;
      }

      const result = await db.insert(schema.projects).values(parsed.data);
      const insertId = result[0]?.insertId ?? result.insertId;
      const [created] = await db.select().from(schema.projects).where(eq(schema.projects.id, insertId));
      res.status(201).json(created);
    })(req, res);
  }

  res.setHeader("Allow", ["GET", "POST"]);
  res.status(405).json({ error: `Method ${req.method} not allowed` });
}

export default handler;
