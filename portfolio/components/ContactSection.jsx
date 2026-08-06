import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";

const schema = z.object({
  name: z.string().min(1, "Required"),
  email: z.string().email("Enter a valid email"),
  subject: z.string().optional(),
  message: z.string().min(1, "Required").max(5000),
  website: z.string().optional(), // honeypot
});

export default function ContactSection({ profile }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema) });

  const [status, setStatus] = useState(null); // null | "success" | "error"

  const onSubmit = async (data) => {
    setStatus(null);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed");
      setStatus("success");
      reset();
    } catch {
      setStatus("error");
    }
  };

  return (
    <section id="contact" className="mx-auto max-w-6xl px-6 py-28">
      <div className="mb-12 flex items-baseline justify-between">
        <h2 className="font-mono text-xs uppercase tracking-[0.25em] text-signal">Contact</h2>
        <div className="rule flex-1 mx-6" />
      </div>

      <div className="grid grid-cols-1 gap-16 lg:grid-cols-2">
        <div>
          <p className="max-w-md text-2xl font-medium leading-snug">
            Have a project in mind? Send a message — I read every one.
          </p>
          <div className="mt-8 space-y-2 font-mono text-sm text-mute">
            {profile?.email && <p>{profile.email}</p>}
            {profile?.location && <p>{profile.location}</p>}
          </div>
        </div>

        <motion.form
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-5"
          noValidate
        >
          <input type="text" tabIndex={-1} autoComplete="off" className="hidden" {...register("website")} />

          <div>
            <input
              {...register("name")}
              placeholder="Name"
              className="w-full border border-line-soft bg-transparent px-4 py-3 text-sm outline-none transition-colors focus:border-signal"
            />
            {errors.name && <p className="mt-1 font-mono text-xs text-signal">{errors.name.message}</p>}
          </div>

          <div>
            <input
              {...register("email")}
              placeholder="Email"
              className="w-full border border-line-soft bg-transparent px-4 py-3 text-sm outline-none transition-colors focus:border-signal"
            />
            {errors.email && <p className="mt-1 font-mono text-xs text-signal">{errors.email.message}</p>}
          </div>

          <div>
            <input
              {...register("subject")}
              placeholder="Subject (optional)"
              className="w-full border border-line-soft bg-transparent px-4 py-3 text-sm outline-none transition-colors focus:border-signal"
            />
          </div>

          <div>
            <textarea
              {...register("message")}
              placeholder="Message"
              rows={5}
              className="w-full border border-line-soft bg-transparent px-4 py-3 text-sm outline-none transition-colors focus:border-signal"
            />
            {errors.message && <p className="mt-1 font-mono text-xs text-signal">{errors.message.message}</p>}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="border border-ink bg-ink px-6 py-3 font-mono text-xs uppercase tracking-widest text-paper transition-colors hover:bg-signal hover:border-signal disabled:opacity-50"
          >
            {isSubmitting ? "Sending…" : "Send Message"}
          </button>

          {status === "success" && (
            <p className="font-mono text-xs text-signal">Message sent. Thank you.</p>
          )}
          {status === "error" && (
            <p className="font-mono text-xs text-signal">Something went wrong. Try again.</p>
          )}
        </motion.form>
      </div>
    </section>
  );
}
