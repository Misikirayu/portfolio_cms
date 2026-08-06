import { SessionProvider } from "next-auth/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import "@/styles/globals.css";

export default function App({ Component, pageProps: { session, ...pageProps } }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: { queries: { staleTime: 30_000, refetchOnWindowFocus: false } },
  }));

  return (
    <SessionProvider session={session}>
      <QueryClientProvider client={queryClient}>
        {/*
          Inter is loaded via a standard <link> tag rather than next/font/google.
          next/font/google fetches the font at BUILD TIME, which fails hard in any
          network-restricted build environment (CI runners without egress, some
          Plesk/VPS setups, offline builds). A <link> tag fetches client-side and
          degrades gracefully to the system font stack below if it's ever blocked.
        */}

        <Component {...pageProps} />
      </QueryClientProvider>
    </SessionProvider>
  );
}
