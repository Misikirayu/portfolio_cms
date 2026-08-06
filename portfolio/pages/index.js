import Head from "next/head";
import { asc } from "drizzle-orm";
import { db, schema } from "@/lib/db";
import SiteNav from "@/components/SiteNav";
import Hero from "@/components/Hero";
import ProjectsSection from "@/components/ProjectsSection";
import SkillsSection from "@/components/SkillsSection";
import ExperienceSection from "@/components/ExperienceSection";
import ContactSection from "@/components/ContactSection";

export default function Home({ profile, projects, skills, experience }) {
  const title = profile ? `${profile.fullName} — ${profile.jobTitle}` : "Developer Portfolio";

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={profile?.tagline || profile?.bio || "Developer portfolio"} />
      </Head>

      <SiteNav fullName={profile?.fullName} />
      <Hero profile={profile} />
      <ProjectsSection projects={projects} />
      <SkillsSection skills={skills} />
      <ExperienceSection experience={experience} />
      <ContactSection profile={profile} />

      <footer className="border-t border-line-soft px-6 py-10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 font-mono text-xs text-mute sm:flex-row">
          <span>&copy; {new Date().getFullYear()} {profile?.fullName || ""}</span>
          <div className="flex gap-6">
            {profile?.githubUrl && <a href={profile.githubUrl} className="hover:text-signal">github</a>}
            {profile?.linkedinUrl && <a href={profile.linkedinUrl} className="hover:text-signal">linkedin</a>}
            {profile?.twitterUrl && <a href={profile.twitterUrl} className="hover:text-signal">twitter</a>}
          </div>
        </div>
      </footer>
    </>
  );
}

export async function getStaticProps() {
  const [profileRows, projects, skills, experience] = await Promise.all([
    db.select().from(schema.profile).limit(1),
    db.select().from(schema.projects).orderBy(asc(schema.projects.orderIndex)),
    db.select().from(schema.skills).orderBy(asc(schema.skills.orderIndex)),
    db.select().from(schema.experience).orderBy(asc(schema.experience.orderIndex)),
  ]);

  return {
    props: {
      profile: profileRows[0] ? { ...profileRows[0], updatedAt: profileRows[0].updatedAt.toISOString() } : null,
      projects: projects.map((p) => ({
        ...p,
        createdAt: p.createdAt.toISOString(),
        updatedAt: p.updatedAt.toISOString(),
      })),
      skills,
      experience,
    },
    revalidate: 60,
  };
}
