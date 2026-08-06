import Head from "next/head";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import AdminGuard from "@/components/admin/AdminGuard";
import AdminShell from "@/components/admin/AdminShell";
import { apiFetch } from "@/lib/apiClient";

const FIELDS = [
  { name: "fullName", label: "Full Name", required: true },
  { name: "jobTitle", label: "Job Title", required: true },
  { name: "tagline", label: "Tagline" },
  { name: "location", label: "Location" },
  { name: "email", label: "Contact Email" },
  { name: "resumeUrl", label: "Résumé URL" },
  { name: "githubUrl", label: "GitHub URL" },
  { name: "linkedinUrl", label: "LinkedIn URL" },
  { name: "twitterUrl", label: "Twitter / X URL" },
];

export default function AdminProfile() {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: () => apiFetch("/api/profile"),
  });

  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm();

  useEffect(() => {
    if (data) reset(data);
  }, [data, reset]);

  const mutation = useMutation({
    mutationFn: (payload) => apiFetch("/api/profile", { method: "PUT", body: JSON.stringify(payload) }),
    onSuccess: (updated) => {
      queryClient.setQueryData(["profile"], updated);
    },
  });

  const onSubmit = (values) => mutation.mutate(values);

  return (
    <AdminGuard>
      <Head>
        <title>Admin — Profile</title>
      </Head>
      <AdminShell title="Profile">
        {isLoading ? (
          <p className="font-mono text-sm text-mute">Loading…</p>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl space-y-5">
            {FIELDS.map((f) => (
              <div key={f.name}>
                <label className="mb-1 block font-mono text-xs uppercase tracking-widest text-mute">
                  {f.label}
                </label>
                <input
                  {...register(f.name, { required: f.required })}
                  className="w-full border border-line-soft bg-transparent px-4 py-3 text-sm outline-none transition-colors focus:border-signal"
                />
              </div>
            ))}

            <div>
              <label className="mb-1 block font-mono text-xs uppercase tracking-widest text-mute">Bio</label>
              <textarea
                {...register("bio")}
                rows={6}
                className="w-full border border-line-soft bg-transparent px-4 py-3 text-sm outline-none transition-colors focus:border-signal"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting || mutation.isPending}
              className="border border-ink bg-ink px-6 py-3 font-mono text-xs uppercase tracking-widest text-paper transition-colors hover:bg-signal hover:border-signal disabled:opacity-50"
            >
              {mutation.isPending ? "Saving…" : "Save Changes"}
            </button>

            {mutation.isSuccess && <p className="font-mono text-xs text-signal">Saved.</p>}
            {mutation.isError && (
              <p className="font-mono text-xs text-signal">{mutation.error?.message || "Save failed."}</p>
            )}
          </form>
        )}
      </AdminShell>
    </AdminGuard>
  );
}
