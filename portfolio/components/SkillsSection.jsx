import { motion } from "framer-motion";

const CATEGORIES = ["Frontend", "Backend", "DevOps", "Tools"];

export default function SkillsSection({ skills }) {
  if (!skills?.length) return null;

  return (
    <section id="skills" className="mx-auto max-w-6xl px-6 py-28">
      <div className="mb-12 flex items-baseline justify-between">
        <h2 className="font-mono text-xs uppercase tracking-[0.25em] text-signal">Skills Matrix</h2>
        <div className="rule flex-1 mx-6" />
      </div>

      <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
        {CATEGORIES.map((cat) => {
          const items = skills.filter((s) => s.category === cat).sort((a, b) => a.orderIndex - b.orderIndex);
          if (!items.length) return null;
          return (
            <motion.div
              key={cat}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5 }}
            >
              <h3 className="mb-4 font-mono text-xs uppercase tracking-widest text-mute">{cat}</h3>
              <ul className="space-y-3">
                {items.map((s) => (
                  <li key={s.id} className="flex items-center justify-between border-b border-line-soft pb-2">
                    <span className="text-sm text-ink">{s.name}</span>
                    <span className="flex gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <span
                          key={i}
                          className={`h-1.5 w-1.5 ${i < s.proficiency ? "bg-signal" : "bg-line-soft"}`}
                        />
                      ))}
                    </span>
                  </li>
                ))}
              </ul>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
