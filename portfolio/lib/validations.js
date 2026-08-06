const { z } = require("zod");

const profileSchema = z.object({
  fullName: z.string().min(1).max(191),
  jobTitle: z.string().min(1).max(191),
  tagline: z.string().max(255).optional().nullable(),
  bio: z.string().optional().nullable(),
  location: z.string().max(191).optional().nullable(),
  resumeUrl: z.string().url().optional().nullable().or(z.literal("")),
  email: z.string().email().optional().nullable().or(z.literal("")),
  githubUrl: z.string().url().optional().nullable().or(z.literal("")),
  linkedinUrl: z.string().url().optional().nullable().or(z.literal("")),
  twitterUrl: z.string().url().optional().nullable().or(z.literal("")),
});

const skillSchema = z.object({
  name: z.string().min(1).max(100),
  category: z.enum(["Frontend", "Backend", "DevOps", "Tools"]),
  proficiency: z.number().int().min(1).max(5).default(3),
  iconName: z.string().max(100).optional().nullable(),
  orderIndex: z.number().int().default(0),
});

const projectSchema = z.object({
  title: z.string().min(1).max(191),
  slug: z
    .string()
    .min(1)
    .max(191)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase, alphanumeric, hyphen-separated"),
  description: z.string().min(1),
  content: z.string().optional().nullable(),
  techStack: z.string().optional().nullable(),
  liveUrl: z.string().url().optional().nullable().or(z.literal("")),
  githubUrl: z.string().url().optional().nullable().or(z.literal("")),
  thumbnailUrl: z.string().optional().nullable(),
  featured: z.boolean().default(false),
  orderIndex: z.number().int().default(0),
});

const experienceSchema = z.object({
  roleTitle: z.string().min(1).max(191),
  company: z.string().min(1).max(191),
  location: z.string().max(191).optional().nullable(),
  startDate: z.string().min(1).max(32),
  endDate: z.string().max(32).optional().nullable(),
  isCurrent: z.boolean().default(false),
  description: z.string().optional().nullable(),
  orderIndex: z.number().int().default(0),
});

const contactSchema = z.object({
  name: z.string().min(1).max(191),
  email: z.string().email(),
  subject: z.string().max(255).optional().nullable(),
  message: z.string().min(1).max(5000),
});

module.exports = {
  profileSchema,
  skillSchema,
  projectSchema,
  experienceSchema,
  contactSchema,
};
