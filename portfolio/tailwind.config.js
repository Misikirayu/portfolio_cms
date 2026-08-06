/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        ink: "var(--color-ink)",
        paper: "var(--color-paper)",
        signal: "#E53E3E",
        "signal-bright": "#FF2E93",
        line: "var(--color-line)",
        "line-soft": "var(--color-line-soft)",
        mute: "var(--color-mute)",
      },
      fontFamily: {
        sans: ["Inter", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "sans-serif"],
        mono: ["JetBrains Mono", "ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
      },
      fontSize: {
        "display": ["clamp(2.75rem, 7vw, 6rem)", { lineHeight: "0.95", letterSpacing: "-0.03em" }],
      },
      keyframes: {
        blink: {
          "0%, 49%": { opacity: "1" },
          "50%, 100%": { opacity: "0" },
        },
      },
      animation: {
        blink: "blink 1s step-end infinite",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
