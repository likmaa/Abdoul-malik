import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./frontend/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        'off-white': '#FAFAFA',
        'violet-electric': '#7C3AED',
        'black-deep': '#111111',
        'gray-soft': '#F3F4F6',
        'green-garden': '#10B981',
        'orange-submit': '#D96B4A',
      },
      fontFamily: {
        sans: ['var(--font-plus-jakarta)', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
export default config;

