import Head from "next/head";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import AdminGuard from "@/components/admin/AdminGuard";
import AdminShell from "@/components/admin/AdminShell";
import { apiFetch } from "@/lib/apiClient";

export default function AdminMessages() {
  const queryClient = useQueryClient();
  const { data: messages, isLoading } = useQuery({
    queryKey: ["messages"],
    queryFn: () => apiFetch("/api/admin/messages"),
  });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["messages"] });

  const toggleRead = useMutation({
    mutationFn: ({ id, isRead }) => apiFetch(`/api/admin/messages/${id}`, { method: "PUT", body: JSON.stringify({ isRead }) }),
    onSuccess: invalidate,
  });

  const remove = useMutation({
    mutationFn: (id) => apiFetch(`/api/admin/messages/${id}`, { method: "DELETE" }),
    onSuccess: invalidate,
  });

  return (
    <AdminGuard>
      <Head>
        <title>Admin — Messages</title>
      </Head>
      <AdminShell title="Messages">
        {isLoading ? (
          <p className="font-mono text-sm text-mute">Loading…</p>
        ) : !messages?.length ? (
          <p className="font-mono text-sm text-mute">No messages yet.</p>
        ) : (
          <div className="border border-line-soft">
            {messages.map((m) => (
              <div key={m.id} className={`border-b border-line-soft p-5 last:border-b-0 ${m.isRead ? "" : "bg-signal/[0.04]"}`}>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-medium">
                      {m.name} <span className="font-mono text-xs text-mute">&lt;{m.email}&gt;</span>
                    </p>
                    {m.subject && <p className="mt-1 text-sm text-ink/70">{m.subject}</p>}
                    <p className="mt-2 max-w-2xl text-sm text-ink/80">{m.message}</p>
                    <p className="mt-2 font-mono text-xs text-mute">
                      {new Date(m.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className={`diff-tag ${m.isRead ? "diff-tag--minus" : "diff-tag--plus"}`}>
                      {m.isRead ? "Read" : "Unread"}
                    </span>
                    <div className="flex gap-3">
                      <button
                        onClick={() => toggleRead.mutate({ id: m.id, isRead: !m.isRead })}
                        className="font-mono text-xs uppercase tracking-widest text-ink/70 hover:text-signal"
                      >
                        Mark {m.isRead ? "Unread" : "Read"}
                      </button>
                      <button
                        onClick={() => {
                          if (confirm("Delete this message?")) remove.mutate(m.id);
                        }}
                        className="font-mono text-xs uppercase tracking-widest text-mute hover:text-signal"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </AdminShell>
    </AdminGuard>
  );
}
