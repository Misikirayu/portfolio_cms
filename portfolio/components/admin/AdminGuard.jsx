import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function AdminGuard({ children }) {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/admin/login");
    }
  }, [status, router]);

  if (status === "loading" || status === "unauthenticated") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-ink">
        <p className="font-mono text-xs uppercase tracking-widest text-paper/50">Checking session…</p>
      </div>
    );
  }

  return children;
}
