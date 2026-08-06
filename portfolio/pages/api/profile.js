const { eq } = require("drizzle-orm");
const { db, schema } = require("../../lib/db");
const { requireAdmin } = require("../../lib/requireAdmin");
const { profileSchema } = require("../../lib/validations");

async function handler(req, res) {
  if (req.method === "GET") {
    const [row] = await db.select().from(schema.profile).limit(1);
    res.status(200).json(row || null);
    return;
  }

  if (req.method === "PUT") {
    return requireAdmin(async (req, res) => {
      const parsed = profileSchema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({ error: "Validation failed", issues: parsed.error.issues });
        return;
      }

      const [existing] = await db.select().from(schema.profile).limit(1);

      if (existing) {
        await db.update(schema.profile).set(parsed.data).where(eq(schema.profile.id, existing.id));
      } else {
        await db.insert(schema.profile).values(parsed.data);
      }

      const [updated] = await db.select().from(schema.profile).limit(1);
      res.status(200).json(updated);
    })(req, res);
  }

  res.setHeader("Allow", ["GET", "PUT"]);
  res.status(405).json({ error: `Method ${req.method} not allowed` });
}

export default handler;
