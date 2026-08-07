import Link from "next/link";
import { useRouter } from "next/router";
import { signOut } from "next-auth/react";
import { useState } from "react";
import { Menu, X } from "lucide-react";

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
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen flex-col md:flex-row bg-paper text-ink">
      {/* Mobile Top Header */}
      <header className="flex items-center justify-between border-b border-line-soft bg-paper px-6 py-4 md:hidden">
        <p className="font-mono text-xs uppercase tracking-widest text-signal">Admin</p>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="flex h-8 w-8 items-center justify-center border border-line bg-ink text-paper"
          aria-label="Toggle menu"
        >
          {sidebarOpen ? <X size={16} /> : <Menu size={16} />}
        </button>
      </header>

      {/* Sidebar Drawer */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-56 flex-col justify-between border-r border-line-soft bg-ink text-paper transition-transform duration-300 md:static md:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div>
          <div className="flex items-center justify-between border-b border-paper/10 px-6 py-5">
            <p className="font-mono text-xs uppercase tracking-widest text-signal">Admin</p>
            <button
              onClick={() => setSidebarOpen(false)}
              className="flex h-6 w-6 items-center justify-center border border-paper/20 bg-paper/10 text-paper md:hidden"
              aria-label="Close menu"
            >
              <X size={12} />
            </button>
          </div>
          <nav className="flex flex-col gap-1 p-4">
            {nav.map((n) => {
              const active = router.pathname === n.href;
              return (
                <Link
                  key={n.href}
                  href={n.href}
                  onClick={() => setSidebarOpen(false)}
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

      {/* Mobile Drawer Overlay */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-ink/40 backdrop-blur-sm md:hidden"
        />
      )}

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <header className="border-b border-line-soft px-6 py-6 md:px-8">
          <h1 className="text-xl md:text-2xl font-semibold">{title}</h1>
        </header>
        <div className="p-6 md:p-8">{children}</div>
      </main>
    </div>
  );
}
