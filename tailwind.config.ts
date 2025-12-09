import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        cyber: {
          black: "#020202",    // Nero assoluto
          dark: "#0a0a0a",     // Nero pannelli
          green: "#00ff41",    // Verde Matrix
          greenDim: "#008F11", // Verde spento
          red: "#ff003c",      // Rosso Errore
        }
      },
      fontFamily: {
        pixel: ["var(--font-vt323)", "monospace"],
        tech: ["var(--font-tech)", "monospace"],
      },
      backgroundImage: {
        'grid-pattern': "linear-gradient(to right, #111 1px, transparent 1px), linear-gradient(to bottom, #111 1px, transparent 1px)",
      },
      animation: {
        'pulse-fast': 'pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
};
export default config;