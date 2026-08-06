import Link from "next/link";
import { useRouter } from "next/router";
import { signOut } from "next-auth/react";

const nav = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/profile", label: "Profile" },
  { href: "/admin/projects", label: "Projects" },
  { href: "/admin/skills", label: "Skills" },
  { href: "/admin/experience", label: "Experience" },
  { href: "/admin/messages", label: "Messages" },
];

export default function AdminShell({ children, title }) {
  const router = useRouter();

  return (
    <div className="flex min-h-screen bg-paper text-ink">
      <aside className="flex w-56 flex-col justify-between border-r border-line-soft bg-ink text-paper">
        <div>
          <div className="border-b border-paper/10 px-6 py-5">
            <p className="font-mono text-xs uppercase tracking-widest text-signal">Admin</p>
          </div>
          <nav className="flex flex-col gap-1 p-4">
            {nav.map((n) => {
              const active = router.pathname === n.href;
              return (
                <Link
                  key={n.href}
                  href={n.href}
                  className={`px-3 py-2 font-mono text-xs uppercase tracking-widest transition-colors ${
                    active ? "bg-paper text-ink" : "text-paper/60 hover:text-signal"
                  }`}
                >
                  {n.label}
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="border-t border-paper/10 p-4">
          <Link
            href="/"
            target="_blank"
            className="block px-3 py-2 font-mono text-xs uppercase tracking-widest text-paper/60 hover:text-signal"
          >
            View Site &rarr;
          </Link>
          <button
            onClick={() => signOut({ callbackUrl: "/admin/login" })}
            className="mt-1 w-full px-3 py-2 text-left font-mono text-xs uppercase tracking-widest text-paper/60 hover:text-signal"
          >
            Sign Out
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto">
        <header className="border-b border-line-soft px-8 py-6">
          <h1 className="text-2xl font-semibold">{title}</h1>
        </header>
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}
