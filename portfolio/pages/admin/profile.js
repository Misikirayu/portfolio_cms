import Head from "next/head";
import { useEffect, useState } from "react";
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

  const { register, handleSubmit, reset, setValue, formState: { isSubmitting } } = useForm();

  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  const handleResumeUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadError("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Upload failed");
      }

      const data = await res.json();
      setValue("resumeUrl", data.url, { shouldDirty: true });
    } catch (err) {
      setUploadError(err.message || "Failed to upload résumé.");
    } finally {
      setUploading(false);
    }
  };

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
            {FIELDS.map((f) => {
              if (f.name === "resumeUrl") {
                return (
                  <div key={f.name}>
                    <label className="mb-1 block font-mono text-xs uppercase tracking-widest text-mute">
                      {f.label}
                    </label>
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                      <div className="flex-1">
                        <input
                          {...register(f.name, { required: f.required })}
                          placeholder="https://example.com/resume.pdf or upload below"
                          className="w-full border border-line-soft bg-transparent px-4 py-3 text-sm outline-none transition-colors focus:border-signal"
                        />
                      </div>
                      <div className="relative flex items-center">
                        <input
                          type="file"
                          id="resume-upload"
                          accept=".pdf,.doc,.docx,.odt,.rtf,.txt,.xls,.xlsx,.ods,.csv,.ppt,.pptx,.odp,.jpg,.jpeg,.png,.gif,.webp,.svg,.avif"
                          onChange={handleResumeUpload}
                          className="hidden"
                        />
                        <label
                          htmlFor="resume-upload"
                          className="cursor-pointer border border-line bg-ink px-6 py-3 font-mono text-xs uppercase tracking-widest text-paper hover:bg-signal hover:border-signal transition-colors inline-block whitespace-nowrap"
                        >
                          {uploading ? "Uploading…" : "Upload File"}
                        </label>
                      </div>
                    </div>
                    {uploadError && (
                      <p className="mt-1 font-mono text-xs text-signal">{uploadError}</p>
                    )}
                  </div>
                );
              }

              return (
                <div key={f.name}>
                  <label className="mb-1 block font-mono text-xs uppercase tracking-widest text-mute">
                    {f.label}
                  </label>
                  <input
                    {...register(f.name, { required: f.required })}
                    className="w-full border border-line-soft bg-transparent px-4 py-3 text-sm outline-none transition-colors focus:border-signal"
                  />
                </div>
              );
            })}

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
