import Head from "next/head";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { useQuery, useMutation } from "@tanstack/react-query";
import AdminGuard from "@/components/admin/AdminGuard";
import AdminShell from "@/components/admin/AdminShell";
import { apiFetch } from "@/lib/apiClient";

export default function AdminProjectForm() {
  const router = useRouter();
  const { id } = router.query;
  const isNew = id === "new";

  const { data, isLoading } = useQuery({
    queryKey: ["project", id],
    queryFn: () => apiFetch(`/api/projects/${id}`),
    enabled: !!id && !isNew,
  });

  const { register, handleSubmit, reset, setValue, watch, formState: { isSubmitting } } = useForm({
    defaultValues: {
      title: "",
      slug: "",
      description: "",
      content: "",
      techStack: "",
      liveUrl: "",
      githubUrl: "",
      thumbnailUrl: "",
      featured: false,
      orderIndex: 0,
    },
  });

  const watchThumbnailUrl = watch("thumbnailUrl");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  const handleUpload = async (e) => {
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
      setValue("thumbnailUrl", data.url, { shouldDirty: true });
    } catch (err) {
      setUploadError(err.message || "Failed to upload image.");
    } finally {
      setUploading(false);
    }
  };

  useEffect(() => {
    if (data) reset(data);
  }, [data, reset]);

  const mutation = useMutation({
    mutationFn: (payload) =>
      isNew
        ? apiFetch("/api/projects", { method: "POST", body: JSON.stringify(payload) })
        : apiFetch(`/api/projects/${id}`, { method: "PUT", body: JSON.stringify(payload) }),
    onSuccess: () => router.push("/admin/projects"),
  });

  const onSubmit = (values) =>
    mutation.mutate({
      ...values,
      orderIndex: Number(values.orderIndex) || 0,
      featured: Boolean(values.featured),
    });

  if (!isNew && isLoading) {
    return (
      <AdminGuard>
        <AdminShell title="Project">
          <p className="font-mono text-sm text-mute">Loading…</p>
        </AdminShell>
      </AdminGuard>
    );
  }

  return (
    <AdminGuard>
      <Head>
        <title>Admin — {isNew ? "New Project" : "Edit Project"}</title>
      </Head>
      <AdminShell title={isNew ? "New Project" : "Edit Project"}>
        <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl space-y-5">
          <div>
            <label className="mb-1 block font-mono text-xs uppercase tracking-widest text-mute">Title</label>
            <input
              {...register("title", { required: true })}
              className="w-full border border-line-soft bg-transparent px-4 py-3 text-sm outline-none focus:border-signal"
            />
          </div>

          <div>
            <label className="mb-1 block font-mono text-xs uppercase tracking-widest text-mute">
              Slug <span className="text-mute">(lowercase-hyphenated)</span>
            </label>
            <input
              {...register("slug", { required: true })}
              className="w-full border border-line-soft bg-transparent px-4 py-3 text-sm outline-none focus:border-signal"
            />
          </div>

          <div>
            <label className="mb-1 block font-mono text-xs uppercase tracking-widest text-mute">
              Short Description
            </label>
            <textarea
              {...register("description", { required: true })}
              rows={2}
              className="w-full border border-line-soft bg-transparent px-4 py-3 text-sm outline-none focus:border-signal"
            />
          </div>

          <div>
            <label className="mb-1 block font-mono text-xs uppercase tracking-widest text-mute">
              Case Study Content (Markdown)
            </label>
            <textarea
              {...register("content")}
              rows={10}
              className="w-full border border-line-soft bg-transparent px-4 py-3 font-mono text-sm outline-none focus:border-signal"
            />
          </div>

          <div>
            <label className="mb-1 block font-mono text-xs uppercase tracking-widest text-mute">
              Tech Stack <span className="text-mute">(comma-separated)</span>
            </label>
            <input
              {...register("techStack")}
              placeholder="Next.js, Drizzle, MySQL"
              className="w-full border border-line-soft bg-transparent px-4 py-3 text-sm outline-none focus:border-signal"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block font-mono text-xs uppercase tracking-widest text-mute">Live URL</label>
              <input
                {...register("liveUrl")}
                className="w-full border border-line-soft bg-transparent px-4 py-3 text-sm outline-none focus:border-signal"
              />
            </div>
            <div>
              <label className="mb-1 block font-mono text-xs uppercase tracking-widest text-mute">GitHub URL</label>
              <input
                {...register("githubUrl")}
                className="w-full border border-line-soft bg-transparent px-4 py-3 text-sm outline-none focus:border-signal"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block font-mono text-xs uppercase tracking-widest text-mute">
              Thumbnail
            </label>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
              <div className="flex-1">
                <input
                  {...register("thumbnailUrl")}
                  placeholder="https://example.com/image.jpg or upload below"
                  className="w-full border border-line-soft bg-transparent px-4 py-3 text-sm outline-none focus:border-signal"
                />
              </div>
              <div className="relative flex items-center">
                <input
                  type="file"
                  id="thumbnail-upload"
                  accept="image/*"
                  onChange={handleUpload}
                  className="hidden"
                />
                <label
                  htmlFor="thumbnail-upload"
                  className="cursor-pointer border border-line bg-ink px-6 py-3 font-mono text-xs uppercase tracking-widest text-paper hover:bg-signal hover:border-signal transition-colors inline-block whitespace-nowrap"
                >
                  {uploading ? "Uploading…" : "Upload File"}
                </label>
              </div>
            </div>
            {uploadError && (
              <p className="mt-1 font-mono text-xs text-signal">{uploadError}</p>
            )}
            {watchThumbnailUrl && (
              <div className="relative mt-3 aspect-video w-32 overflow-hidden border border-line-soft bg-paper">
                <img
                  src={watchThumbnailUrl}
                  alt="Thumbnail preview"
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    e.target.style.display = "none";
                  }}
                />
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block font-mono text-xs uppercase tracking-widest text-mute">
                Order Index
              </label>
              <input
                type="number"
                {...register("orderIndex")}
                className="w-full border border-line-soft bg-transparent px-4 py-3 text-sm outline-none focus:border-signal"
              />
            </div>
            <label className="flex items-center gap-2 self-end pb-3 font-mono text-xs uppercase tracking-widest text-mute">
              <input type="checkbox" {...register("featured")} className="h-4 w-4 accent-[#E53E3E]" />
              Featured
            </label>
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={isSubmitting || mutation.isPending}
              className="border border-ink bg-ink px-6 py-3 font-mono text-xs uppercase tracking-widest text-paper hover:bg-signal hover:border-signal disabled:opacity-50"
            >
              {mutation.isPending ? "Saving…" : isNew ? "Create Project" : "Save Changes"}
            </button>
          </div>

          {mutation.isError && (
            <p className="font-mono text-xs text-signal">{mutation.error?.message || "Save failed."}</p>
          )}
        </form>
      </AdminShell>
    </AdminGuard>
  );
}
