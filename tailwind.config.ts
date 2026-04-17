import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        gold: '#b8a04a',
        'gold-light': '#d4c36a',
        'gold-bg': 'rgba(184, 160, 74, 0.12)',
        charcoal: '#1a1a1a',
        'charcoal-dark': '#141414',
        'matte-black': '#0d0d0d',
      },
    },
  },
  plugins: [],
};
export default config;
