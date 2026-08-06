import Head from "next/head";
import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import AdminGuard from "@/components/admin/AdminGuard";
import AdminShell from "@/components/admin/AdminShell";
import { apiFetch } from "@/lib/apiClient";

export default function AdminProjectsList() {
  const queryClient = useQueryClient();
  const { data: projects, isLoading } = useQuery({
    queryKey: ["projects"],
    queryFn: () => apiFetch("/api/projects"),
  });

  const toggleFeatured = useMutation({
    mutationFn: ({ id, featured }) => apiFetch(`/api/projects/${id}`, { method: "PUT", body: JSON.stringify({ featured }) }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["projects"] }),
  });

  const remove = useMutation({
    mutationFn: (id) => apiFetch(`/api/projects/${id}`, { method: "DELETE" }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["projects"] }),
  });

  return (
    <AdminGuard>
      <Head>
        <title>Admin — Projects</title>
      </Head>
      <AdminShell title="Projects">
        <div className="mb-6 flex justify-end">
          <Link
            href="/admin/projects/new"
            className="border border-ink bg-ink px-5 py-2.5 font-mono text-xs uppercase tracking-widest text-paper hover:bg-signal hover:border-signal"
          >
            + New Project
          </Link>
        </div>

        {isLoading ? (
          <p className="font-mono text-sm text-mute">Loading…</p>
        ) : !projects?.length ? (
          <p className="font-mono text-sm text-mute">No projects yet.</p>
        ) : (
          <div className="border border-line-soft">
            {projects.map((p) => (
              <div key={p.id} className="flex items-center justify-between border-b border-line-soft p-4 last:border-b-0">
                <div>
                  <p className="font-medium">{p.title}</p>
                  <p className="font-mono text-xs text-mute">/{p.slug} &middot; order {p.orderIndex}</p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => toggleFeatured.mutate({ id: p.id, featured: !p.featured })}
                    className={`diff-tag ${p.featured ? "diff-tag--plus" : "diff-tag--minus"}`}
                  >
                    {p.featured ? "Featured" : "Not Featured"}
                  </button>
                  <Link
                    href={`/admin/projects/${p.id}`}
                    className="font-mono text-xs uppercase tracking-widest text-ink/70 hover:text-signal"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => {
                      if (confirm(`Delete "${p.title}"?`)) remove.mutate(p.id);
                    }}
                    className="font-mono text-xs uppercase tracking-widest text-mute hover:text-signal"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </AdminShell>
    </AdminGuard>
  );
}
