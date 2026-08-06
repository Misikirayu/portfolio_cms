import { useState } from "react";
import { useRouter } from "next/router";
import { signIn } from "next-auth/react";
import Head from "next/head";

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (res?.error) {
      setError("Invalid email or password.");
      return;
    }
    router.push("/admin");
  };

  return (
    <>
      <Head>
        <title>Admin Login</title>
      </Head>
      <div className="flex min-h-screen items-center justify-center bg-ink px-6">
        <form onSubmit={onSubmit} className="w-full max-w-sm border border-paper/15 bg-ink p-8">
          <p className="font-mono text-xs uppercase tracking-widest text-signal">Admin Access</p>
          <h1 className="mt-2 text-2xl font-semibold text-paper">Sign in</h1>

          <div className="mt-8 space-y-4">
            <input
              type="email"
              required
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-paper/20 bg-transparent px-4 py-3 text-sm text-paper outline-none transition-colors focus:border-signal"
            />
            <input
              type="password"
              required
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-paper/20 bg-transparent px-4 py-3 text-sm text-paper outline-none transition-colors focus:border-signal"
            />
          </div>

          {error && <p className="mt-4 font-mono text-xs text-signal">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="mt-8 w-full border border-signal bg-signal px-6 py-3 font-mono text-xs uppercase tracking-widest text-paper transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {loading ? "Signing in…" : "Sign In"}
          </button>
        </form>
      </div>
    </>
  );
}
