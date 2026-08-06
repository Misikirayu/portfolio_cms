import Head from "next/head";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import AdminGuard from "@/components/admin/AdminGuard";
import AdminShell from "@/components/admin/AdminShell";
import { apiFetch } from "@/lib/apiClient";

export default function AdminExperience() {
  const queryClient = useQueryClient();
  const [editingId, setEditingId] = useState(null);

  const { data: entries, isLoading } = useQuery({
    queryKey: ["experience"],
    queryFn: () => apiFetch("/api/experience"),
  });

  const { register, handleSubmit, reset, watch } = useForm({
    defaultValues: {
      roleTitle: "",
      company: "",
      location: "",
      startDate: "",
      endDate: "",
      isCurrent: false,
      description: "",
      orderIndex: 0,
    },
  });

  const isCurrent = watch("isCurrent");
  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["experience"] });

  const create = useMutation({
    mutationFn: (payload) => apiFetch("/api/experience", { method: "POST", body: JSON.stringify(payload) }),
    onSuccess: () => {
      invalidate();
      reset();
    },
  });

  const update = useMutation({
    mutationFn: ({ id, payload }) => apiFetch(`/api/experience/${id}`, { method: "PUT", body: JSON.stringify(payload) }),
    onSuccess: () => {
      invalidate();
      setEditingId(null);
      reset();
    },
  });

  const remove = useMutation({
    mutationFn: (id) => apiFetch(`/api/experience/${id}`, { method: "DELETE" }),
    onSuccess: invalidate,
  });

  const onSubmit = (values) => {
    const payload = { ...values, orderIndex: Number(values.orderIndex), isCurrent: Boolean(values.isCurrent) };
    if (editingId) {
      update.mutate({ id: editingId, payload });
    } else {
      create.mutate(payload);
    }
  };

  const startEdit = (entry) => {
    setEditingId(entry.id);
    reset(entry);
  };

  return (
    <AdminGuard>
      <Head>
        <title>Admin — Experience</title>
      </Head>
      <AdminShell title="Experience">
        <form onSubmit={handleSubmit(onSubmit)} className="mb-10 max-w-2xl space-y-4 border border-line-soft p-6">
          <div className="grid grid-cols-2 gap-4">
            <input
              {...register("roleTitle", { required: true })}
              placeholder="Role title"
              className="border border-line-soft bg-transparent px-3 py-2 text-sm outline-none focus:border-signal"
            />
            <input
              {...register("company", { required: true })}
              placeholder="Company"
              className="border border-line-soft bg-transparent px-3 py-2 text-sm outline-none focus:border-signal"
            />
          </div>
          <input
            {...register("location")}
            placeholder="Location"
            className="w-full border border-line-soft bg-transparent px-3 py-2 text-sm outline-none focus:border-signal"
          />
          <div className="grid grid-cols-3 gap-4">
            <input
              {...register("startDate", { required: true })}
              placeholder="Start (2023-01)"
              className="border border-line-soft bg-transparent px-3 py-2 text-sm outline-none focus:border-signal"
            />
            <input
              {...register("endDate")}
              placeholder="End (2024-06)"
              disabled={isCurrent}
              className="border border-line-soft bg-transparent px-3 py-2 text-sm outline-none focus:border-signal disabled:opacity-40"
            />
            <label className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-mute">
              <input type="checkbox" {...register("isCurrent")} className="h-4 w-4 accent-[#E53E3E]" />
              Current
            </label>
          </div>
          <textarea
            {...register("description")}
            placeholder={"One bullet per line"}
            rows={4}
            className="w-full border border-line-soft bg-transparent px-3 py-2 text-sm outline-none focus:border-signal"
          />
          <div className="flex items-center gap-4">
            <input
              type="number"
              {...register("orderIndex")}
              placeholder="Order"
              className="w-28 border border-line-soft bg-transparent px-3 py-2 text-sm outline-none focus:border-signal"
            />
            <button
              type="submit"
              className="border border-ink bg-ink px-6 py-2.5 font-mono text-xs uppercase tracking-widest text-paper hover:bg-signal hover:border-signal"
            >
              {editingId ? "Update" : "Add"}
            </button>
          </div>
        </form>

        {isLoading ? (
          <p className="font-mono text-sm text-mute">Loading…</p>
        ) : (
          <div className="border border-line-soft">
            {entries?.map((e) => (
              <div key={e.id} className="flex items-center justify-between border-b border-line-soft p-4 last:border-b-0">
                <div>
                  <p className="font-medium">{e.roleTitle} <span className="text-mute">· {e.company}</span></p>
                  <p className="font-mono text-xs text-mute">
                    {e.startDate} — {e.isCurrent ? "Present" : e.endDate || "—"} &middot; order {e.orderIndex}
                  </p>
                </div>
                <div className="flex gap-3">
                  <button onClick={() => startEdit(e)} className="font-mono text-xs uppercase tracking-widest text-ink/70 hover:text-signal">
                    Edit
                  </button>
                  <button onClick={() => remove.mutate(e.id)} className="font-mono text-xs uppercase tracking-widest text-mute hover:text-signal">
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
