import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Sun, Moon } from "lucide-react";

const links = [
  { href: "#work", label: "Work" },
  { href: "#skills", label: "Skills" },
  { href: "#experience", label: "Experience" },
  { href: "#contact", label: "Contact" },
];

export default function SiteNav({ fullName }) {
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

  return (
    <motion.header
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-40 border-b border-line-soft bg-paper/90 backdrop-blur-sm transition-colors duration-250"
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="font-mono text-sm tracking-tight text-ink transition-colors duration-250">
          {(fullName || "portfolio").toLowerCase().replace(/\s+/g, "-")}
          <span className="text-signal">.dev</span>
        </Link>
        <div className="flex items-center gap-6">
          <nav className="hidden gap-8 sm:flex">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="font-mono text-xs uppercase tracking-widest text-ink/70 transition-colors duration-250 hover:text-signal"
              >
                {l.label}
              </a>
            ))}
          </nav>
          
          <button
            onClick={toggleTheme}
            className="flex h-8 w-8 items-center justify-center border border-line bg-ink text-paper transition-all hover:scale-105 active:scale-95 duration-250"
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
    </motion.header>
  );
}
