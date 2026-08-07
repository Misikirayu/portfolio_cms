import { motion } from "framer-motion";
import { Download } from "lucide-react";

export default function Hero({ profile }) {
  const name = profile?.fullName || "Your Name";
  const title = profile?.jobTitle || "Full-Stack Engineer";
  const tagline = profile?.tagline || "Building things that ship.";

  return (
    <section className="mx-auto flex min-h-[92vh] max-w-6xl flex-col justify-center px-6 pt-24">
      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="font-mono text-xs uppercase tracking-[0.25em] text-signal"
      >
        {title}
      </motion.p>

      <motion.h1
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="mt-4 text-display font-semibold"
      >
        {name}
        <span className="cursor" />
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="mt-6 max-w-xl text-lg text-ink/70"
      >
        {tagline}
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="mt-10 flex flex-wrap gap-4 items-center"
      >
        <a
          href="#work"
          className="border border-ink bg-ink px-6 py-3 font-mono text-xs uppercase tracking-widest text-paper transition-colors hover:bg-signal hover:border-signal"
        >
          View Work
        </a>
        <a
          href="#contact"
          className="border border-ink px-6 py-3 font-mono text-xs uppercase tracking-widest text-ink transition-colors hover:text-signal hover:border-signal"
        >
          Get in Touch
        </a>
        {profile?.resumeUrl && (
          <div className="flex gap-2">
            <a
              href={profile.resumeUrl}
              target="_blank"
              rel="noreferrer"
              className="border border-ink px-6 py-3 font-mono text-xs uppercase tracking-widest text-ink transition-colors hover:text-signal hover:border-signal"
            >
              Resume
            </a>
            <a
              href={profile.resumeUrl}
              download
              className="flex items-center justify-center border border-ink px-4 py-3 text-ink transition-colors hover:text-signal hover:border-signal"
              aria-label="Download Resume"
              title="Download Resume"
            >
              <Download size={14} />
            </a>
          </div>
        )}
      </motion.div>
    </section>
  );
}
