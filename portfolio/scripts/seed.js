require("dotenv").config();
const bcrypt = require("bcryptjs");
const { eq } = require("drizzle-orm");
const { db, schema, pool } = require("../lib/db");

async function main() {
  const adminEmail = (process.env.SEED_ADMIN_EMAIL || "admin@example.com").toLowerCase().trim();
  const adminPassword = process.env.SEED_ADMIN_PASSWORD || "change-me-immediately";

  // --- Admin user ---
  const [existingUser] = await db.select().from(schema.users).where(eq(schema.users.email, adminEmail));
  if (!existingUser) {
    const passwordHash = await bcrypt.hash(adminPassword, 10);
    await db.insert(schema.users).values({ email: adminEmail, passwordHash });
    console.log(`Created admin user: ${adminEmail}`);
  } else {
    console.log(`Admin user already exists: ${adminEmail}`);
  }

  // --- Profile (single row) ---
  const [existingProfile] = await db.select().from(schema.profile).limit(1);
  if (!existingProfile) {
    await db.insert(schema.profile).values({
      fullName: "Jane Doe",
      jobTitle: "Full-Stack Engineer",
      tagline: "I build fast, minimal, production-grade web software.",
      bio: "I'm a full-stack engineer focused on clean architecture, developer experience, and shipping things that hold up in production.",
      location: "Remote",
      email: "hello@example.com",
      githubUrl: "https://github.com/example",
      linkedinUrl: "https://linkedin.com/in/example",
      twitterUrl: "https://twitter.com/example",
    });
    console.log("Seeded profile.");
  }

  // --- Skills ---
  const [existingSkill] = await db.select().from(schema.skills).limit(1);
  if (!existingSkill) {
    await db.insert(schema.skills).values([
      { name: "React", category: "Frontend", proficiency: 5, orderIndex: 0 },
      { name: "Next.js", category: "Frontend", proficiency: 5, orderIndex: 1 },
      { name: "TypeScript", category: "Frontend", proficiency: 4, orderIndex: 2 },
      { name: "Node.js", category: "Backend", proficiency: 5, orderIndex: 0 },
      { name: "MySQL", category: "Backend", proficiency: 4, orderIndex: 1 },
      { name: "Drizzle ORM", category: "Backend", proficiency: 4, orderIndex: 2 },
      { name: "Docker", category: "DevOps", proficiency: 3, orderIndex: 0 },
      { name: "GitHub Actions", category: "DevOps", proficiency: 3, orderIndex: 1 },
      { name: "Figma", category: "Tools", proficiency: 3, orderIndex: 0 },
    ]);
    console.log("Seeded skills.");
  }

  // --- Projects ---
  const [existingProject] = await db.select().from(schema.projects).limit(1);
  if (!existingProject) {
    await db.insert(schema.projects).values([
      {
        title: "Ledger",
        slug: "ledger",
        description: "A minimal double-entry accounting engine with a real-time dashboard.",
        content: "## Overview\n\nLedger is a double-entry accounting core built for small teams who need auditability without the overhead of a full ERP.\n\n## Highlights\n\n- Immutable transaction log\n- Real-time balance reconciliation\n- CSV and API import pipelines",
        techStack: "Next.js, MySQL, Drizzle, Tailwind",
        liveUrl: "https://example.com",
        githubUrl: "https://github.com/example/ledger",
        featured: true,
        orderIndex: 0,
      },
      {
        title: "Signal",
        slug: "signal",
        description: "Realtime multiplayer trivia platform with server-authoritative scoring.",
        content: "## Overview\n\nSignal handles thousands of concurrent players with server-authoritative game state and WebSocket fan-out.",
        techStack: "Next.js, Socket.io, Redis",
        githubUrl: "https://github.com/example/signal",
        featured: true,
        orderIndex: 1,
      },
    ]);
    console.log("Seeded projects.");
  }

  // --- Experience ---
  const [existingExperience] = await db.select().from(schema.experience).limit(1);
  if (!existingExperience) {
    await db.insert(schema.experience).values([
      {
        roleTitle: "Senior Full-Stack Engineer",
        company: "Acme Corp",
        location: "Remote",
        startDate: "2023-02",
        isCurrent: true,
        description: "Led migration to a Next.js/MySQL stack, cutting page load times by 40%.\nBuilt the internal admin platform used by 30+ ops staff.",
        orderIndex: 0,
      },
      {
        roleTitle: "Software Engineer",
        company: "Foundry Labs",
        location: "New York, NY",
        startDate: "2020-06",
        endDate: "2023-01",
        description: "Shipped three greenfield products from spec to production.\nMentored two junior engineers.",
        orderIndex: 1,
      },
    ]);
    console.log("Seeded experience.");
  }

  console.log("Seed complete.");
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await pool.end();
  });
