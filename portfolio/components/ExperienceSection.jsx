import { motion } from "framer-motion";

function formatRange(start, end, isCurrent) {
  return `${start} — ${isCurrent ? "Present" : end || "—"}`;
}

export default function ExperienceSection({ experience }) {
  if (!experience?.length) return null;

  const sorted = [...experience].sort((a, b) => a.orderIndex - b.orderIndex);

  return (
    <section id="experience" className="mx-auto max-w-6xl px-6 py-28">
      <div className="mb-12 flex items-baseline justify-between">
        <h2 className="font-mono text-xs uppercase tracking-[0.25em] text-signal">Experience</h2>
        <div className="rule flex-1 mx-6" />
      </div>

      <div className="relative border-l border-line-soft pl-8">
        {sorted.map((e, idx) => (
          <motion.div
            key={e.id}
            initial={{ opacity: 0, x: -12 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.4, delay: idx * 0.05 }}
            className="relative mb-12 last:mb-0"
          >
            <span className="absolute -left-[calc(2rem+3px)] top-1.5 h-2 w-2 rounded-full bg-signal" />
            <p className="font-mono text-xs uppercase tracking-widest text-mute">
              {formatRange(e.startDate, e.endDate, e.isCurrent)}
            </p>
            <h3 className="mt-1 text-lg font-medium">
              {e.roleTitle} <span className="text-mute">· {e.company}</span>
            </h3>
            {e.location && <p className="text-sm text-mute">{e.location}</p>}
            {e.description && (
              <ul className="mt-3 space-y-1.5 text-sm text-ink/75">
                {e.description.split("\n").filter(Boolean).map((line, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="text-signal">–</span>
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
            )}
          </motion.div>
        ))}
      </div>
    </section>
  );
}
