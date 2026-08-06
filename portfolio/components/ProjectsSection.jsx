import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import DiffTag from "./DiffTag";

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const item = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function ProjectsSection({ projects }) {
  if (!projects?.length) return null;

  return (
    <section id="work" className="mx-auto max-w-6xl px-6 py-28">
      <div className="mb-12 flex items-baseline justify-between">
        <h2 className="font-mono text-xs uppercase tracking-[0.25em] text-signal">Selected Work</h2>
        <div className="rule flex-1 mx-6" />
        <span className="font-mono text-xs text-mute">{String(projects.length).padStart(2, "0")}</span>
      </div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        variants={container}
        className="grid grid-cols-1 gap-px border border-line-soft sm:grid-cols-2"
      >
        {projects.map((p) => {
          const tags = (p.techStack || "").split(",").map((t) => t.trim()).filter(Boolean);
          return (
            <motion.div key={p.id} variants={item} className="group relative border border-line-soft bg-paper p-8 transition-colors hover:bg-ink">
              <Link href={`/projects/${p.slug}`} className="block">
                {p.thumbnailUrl && (
                  <div className="relative mb-6 aspect-video w-full overflow-hidden border border-line-soft">
                    <Image
                      src={p.thumbnailUrl}
                      alt={p.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                )}
                <h3 className="text-xl font-medium text-ink transition-colors group-hover:text-paper">
                  {p.title}
                </h3>
                <p className="mt-2 line-clamp-2 text-sm text-ink/60 transition-colors group-hover:text-paper/70">
                  {p.description}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {tags.slice(0, 4).map((t) => (
                    <span
                      key={t}
                      className="diff-tag diff-tag--plus transition-colors group-hover:border-paper/40 group-hover:text-paper"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </Link>
            </motion.div>
          );
        })}
      </motion.div>
    </section>
  );
}
