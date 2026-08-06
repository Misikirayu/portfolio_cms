const {
  mysqlTable,
  varchar,
  int,
  text,
  boolean,
  timestamp,
  mysqlEnum,
} = require("drizzle-orm/mysql-core");

// 1. Admin users
const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  passwordHash: varchar("password_hash", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// 2. Profile / hero content (single-row table)
const profile = mysqlTable("profile", {
  id: int("id").autoincrement().primaryKey(),
  fullName: varchar("full_name", { length: 191 }).notNull(),
  jobTitle: varchar("job_title", { length: 191 }).notNull(),
  tagline: varchar("tagline", { length: 255 }),
  bio: text("bio"),
  location: varchar("location", { length: 191 }),
  resumeUrl: varchar("resume_url", { length: 512 }),
  email: varchar("email", { length: 191 }),
  githubUrl: varchar("github_url", { length: 512 }),
  linkedinUrl: varchar("linkedin_url", { length: 512 }),
  twitterUrl: varchar("twitter_url", { length: 512 }),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

// 3. Skills
const skills = mysqlTable("skills", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  category: mysqlEnum("category", ["Frontend", "Backend", "DevOps", "Tools"]).notNull(),
  proficiency: int("proficiency").default(3).notNull(), // 1-5
  iconName: varchar("icon_name", { length: 100 }),
  orderIndex: int("order_index").default(0).notNull(),
});

// 4. Projects
const projects = mysqlTable("projects", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 191 }).notNull(),
  slug: varchar("slug", { length: 191 }).notNull().unique(),
  description: text("description").notNull(),
  content: text("content"), // markdown/html long-form case study
  techStack: text("tech_stack"), // comma-separated tags, parsed on read
  liveUrl: varchar("live_url", { length: 512 }),
  githubUrl: varchar("github_url", { length: 512 }),
  thumbnailUrl: varchar("thumbnail_url", { length: 512 }),
  featured: boolean("featured").default(false).notNull(),
  orderIndex: int("order_index").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

// 5. Experience
const experience = mysqlTable("experience", {
  id: int("id").autoincrement().primaryKey(),
  roleTitle: varchar("role_title", { length: 191 }).notNull(),
  company: varchar("company", { length: 191 }).notNull(),
  location: varchar("location", { length: 191 }),
  startDate: varchar("start_date", { length: 32 }).notNull(), // "2023-01"
  endDate: varchar("end_date", { length: 32 }),
  isCurrent: boolean("is_current").default(false).notNull(),
  description: text("description"), // bullet points, newline separated
  orderIndex: int("order_index").default(0).notNull(),
});

// 6. Contact messages
const messages = mysqlTable("messages", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 191 }).notNull(),
  email: varchar("email", { length: 191 }).notNull(),
  subject: varchar("subject", { length: 255 }),
  message: text("message").notNull(),
  isRead: boolean("is_read").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

module.exports = { users, profile, skills, projects, experience, messages };
