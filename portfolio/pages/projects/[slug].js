import { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { eq } from "drizzle-orm";
import { db, schema } from "@/lib/db";
import DiffTag from "@/components/DiffTag";
import { Sun, Moon } from "lucide-react";

export default function ProjectPage({ project }) {
  const [theme, setTheme] = useState(null);

  useEffect(() => {
    const isDark = document.documentElement.classList.contains("dark");
    setTheme(isDark ? "dark" : "light");
  }, []);

  const toggleTheme = () => {
    if (document.documentElement.classList.contains("dark")) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
      setTheme("light");
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setTheme("dark");
    }
  };

  if (!project) return null;

  const tags = (project.techStack || "").split(",").map((t) => t.trim()).filter(Boolean);

  return (
    <>
      <Head>
        <title>{project.title} — Case Study</title>
        <meta name="description" content={project.description} />
      </Head>

      <header className="border-b border-line-soft px-6 py-6 transition-colors duration-250">
        <div className="mx-auto flex max-w-3xl items-center justify-between">
          <Link href="/" className="font-mono text-xs uppercase tracking-widest text-mute hover:text-signal transition-colors duration-250">
            &larr; Back
          </Link>
          <div className="flex items-center gap-6 font-mono text-xs uppercase tracking-widest">
            {project.githubUrl && (
              <a href={project.githubUrl} target="_blank" rel="noreferrer" className="hover:text-signal transition-colors duration-250">
                Repo
              </a>
            )}
            {project.liveUrl && (
              <a href={project.liveUrl} target="_blank" rel="noreferrer" className="hover:text-signal transition-colors duration-250">
                Live
              </a>
            )}

            <button
              onClick={toggleTheme}
              className="flex h-8 w-8 items-center justify-center border border-line bg-ink text-paper transition-all hover:scale-105 active:scale-95 duration-250 normal-case"
              aria-label="Toggle theme"
            >
              {theme === null ? (
                <span className="h-3 w-3" />
              ) : theme === "dark" ? (
                <Sun size={14} className="stroke-[2.5]" />
              ) : (
                <Moon size={14} className="stroke-[2.5]" />
              )}
            </button>
          </div>
        </div>
      </header>

      <article className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="text-4xl font-semibold">{project.title}</h1>
        <p className="mt-4 text-lg text-ink/70">{project.description}</p>

        <div className="mt-6 flex flex-wrap gap-2">
          {tags.map((t) => (
            <DiffTag key={t}>{t}</DiffTag>
          ))}
        </div>

        {project.thumbnailUrl && (
          <div className="relative mt-10 aspect-video w-full overflow-hidden border border-line-soft">
            <Image src={project.thumbnailUrl} alt={project.title} fill className="object-cover" />
          </div>
        )}

        {project.content && (
          <div className="prose prose-neutral mt-12 max-w-none prose-headings:font-semibold prose-a:text-signal">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{project.content}</ReactMarkdown>
          </div>
        )}
      </article>
    </>
  );
}

export async function getStaticPaths() {
  const rows = await db.select({ slug: schema.projects.slug }).from(schema.projects);
  return {
    paths: rows.map((r) => ({ params: { slug: r.slug } })),
    fallback: "blocking",
  };
}

export async function getStaticProps({ params }) {
  const [project] = await db.select().from(schema.projects).where(eq(schema.projects.slug, params.slug));

  if (!project) {
    return { notFound: true, revalidate: 60 };
  }

  return {
    props: {
      project: {
        ...project,
        createdAt: project.createdAt.toISOString(),
        updatedAt: project.updatedAt.toISOString(),
      },
    },
    revalidate: 60,
  };
}
