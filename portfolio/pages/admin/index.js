import Head from "next/head";
import { useQuery } from "@tanstack/react-query";
import AdminGuard from "@/components/admin/AdminGuard";
import AdminShell from "@/components/admin/AdminShell";
import { apiFetch } from "@/lib/apiClient";

const CARDS = [
  { key: "projects", label: "Projects" },
  { key: "skills", label: "Skills" },
  { key: "experience", label: "Experience Entries" },
  { key: "messages", label: "Total Messages" },
  { key: "unread", label: "Unread Messages" },
];

export default function AdminOverview() {
  const { data, isLoading } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: () => apiFetch("/api/admin/stats"),
  });

  return (
    <AdminGuard>
      <Head>
        <title>Admin Overview</title>
      </Head>
      <AdminShell title="Overview">
        <div className="grid grid-cols-1 gap-px border border-line-soft sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
          {CARDS.map((c) => (
            <div key={c.key} className="border border-line-soft bg-paper p-6">
              <p className="font-mono text-xs uppercase tracking-widest text-mute">{c.label}</p>
              <p className="mt-3 text-4xl font-semibold">
                {isLoading ? "—" : data?.[c.key] ?? 0}
              </p>
            </div>
          ))}
        </div>
      </AdminShell>
    </AdminGuard>
  );
}
