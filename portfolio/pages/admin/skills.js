import Head from "next/head";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import AdminGuard from "@/components/admin/AdminGuard";
import AdminShell from "@/components/admin/AdminShell";
import { apiFetch } from "@/lib/apiClient";

const CATEGORIES = ["Frontend", "Backend", "DevOps", "Tools"];

export default function AdminSkills() {
  const queryClient = useQueryClient();
  const [editingId, setEditingId] = useState(null);

  const { data: skills, isLoading } = useQuery({
    queryKey: ["skills"],
    queryFn: () => apiFetch("/api/skills"),
  });

  const { register, handleSubmit, reset } = useForm({
    defaultValues: { name: "", category: "Frontend", proficiency: 3, orderIndex: 0, iconName: "" },
  });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["skills"] });

  const create = useMutation({
    mutationFn: (payload) => apiFetch("/api/skills", { method: "POST", body: JSON.stringify(payload) }),
    onSuccess: () => {
      invalidate();
      reset();
    },
  });

  const update = useMutation({
    mutationFn: ({ id, payload }) => apiFetch(`/api/skills/${id}`, { method: "PUT", body: JSON.stringify(payload) }),
    onSuccess: () => {
      invalidate();
      setEditingId(null);
      reset();
    },
  });

  const remove = useMutation({
    mutationFn: (id) => apiFetch(`/api/skills/${id}`, { method: "DELETE" }),
    onSuccess: invalidate,
  });

  const onSubmit = (values) => {
    const payload = {
      ...values,
      proficiency: Number(values.proficiency),
      orderIndex: Number(values.orderIndex),
    };
    if (editingId) {
      update.mutate({ id: editingId, payload });
    } else {
      create.mutate(payload);
    }
  };

  const startEdit = (skill) => {
    setEditingId(skill.id);
    reset(skill);
  };

  return (
    <AdminGuard>
      <Head>
        <title>Admin — Skills</title>
      </Head>
      <AdminShell title="Skills">
        <form onSubmit={handleSubmit(onSubmit)} className="mb-10 grid max-w-3xl grid-cols-1 gap-4 border border-line-soft p-6 sm:grid-cols-5">
          <input
            {...register("name", { required: true })}
            placeholder="Skill name"
            className="border border-line-soft bg-transparent px-3 py-2 text-sm outline-none focus:border-signal"
          />
          <select
            {...register("category")}
            className="border border-line-soft bg-transparent px-3 py-2 text-sm outline-none focus:border-signal"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <input
            type="number"
            min={1}
            max={5}
            {...register("proficiency")}
            placeholder="1-5"
            className="border border-line-soft bg-transparent px-3 py-2 text-sm outline-none focus:border-signal"
          />
          <input
            type="number"
            {...register("orderIndex")}
            placeholder="Order"
            className="border border-line-soft bg-transparent px-3 py-2 text-sm outline-none focus:border-signal"
          />
          <button
            type="submit"
            className="border border-ink bg-ink px-3 py-2 font-mono text-xs uppercase tracking-widest text-paper hover:bg-signal hover:border-signal"
          >
            {editingId ? "Update" : "Add"}
          </button>
        </form>

        {isLoading ? (
          <p className="font-mono text-sm text-mute">Loading…</p>
        ) : (
          <div className="border border-line-soft">
            {skills?.map((s) => (
              <div key={s.id} className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-line-soft p-4 gap-4 last:border-b-0">
                <div>
                  <p className="font-medium">{s.name}</p>
                  <p className="font-mono text-xs text-mute">{s.category} &middot; {s.proficiency}/5 &middot; order {s.orderIndex}</p>
                </div>
                <div className="flex items-center gap-3">
                  <button onClick={() => startEdit(s)} className="font-mono text-xs uppercase tracking-widest text-ink/70 hover:text-signal">
                    Edit
                  </button>
                  <button onClick={() => remove.mutate(s.id)} className="font-mono text-xs uppercase tracking-widest text-mute hover:text-signal">
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
