import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      screens: {
        xs: "480px",
      },
      colors: {
        background: {
          DEFAULT: "#F5F9FB",
          subtle: "#EDF3F7",
          card: "#FFFFFF",
        },
        navy: {
          50: "#F0F4F8",
          100: "#D9E2EC",
          200: "#BCCCDC",
          300: "#9FB3C8",
          400: "#627D98",
          500: "#486581",
          600: "#334E68",
          700: "#243B53",
          800: "#102A43",
          900: "#0B1A2C",
          950: "#07111E",
        },
        brand: {
          50: "#ECFEFF",
          100: "#CFFAFE",
          200: "#A5F3FC",
          300: "#67E8F9",
          400: "#22D3EE",
          500: "#06B6D4",
          600: "#0891B2",
          700: "#0E7490",
          800: "#155E75",
          900: "#164E63",
        },
        teal: {
          500: "#14B8A6",
          600: "#0D9488",
          700: "#0F766E",
        },
        academic: {
          navy: "#0C1F38",
          dark: "#081324",
          teal: "#0284C7",
          cyan: "#06B6D4",
          muted: "#64748B",
          border: "#E2E8F0",
          card: "#FFFFFF",
          surface: "#F8FAFC",
        }
      },
      boxShadow: {
        'subtle': '0 1px 3px rgba(15, 23, 42, 0.04), 0 1px 2px rgba(15, 23, 42, 0.02)',
        'card': '0 4px 20px -2px rgba(15, 30, 60, 0.05)',
        'card-hover': '0 12px 30px -4px rgba(15, 30, 60, 0.09)',
        'elevated': '0 20px 40px -10px rgba(12, 31, 56, 0.12)',
      },
      fontFamily: {
        sans: [
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'sans-serif',
        ],
        serif: [
          'Newsreader',
          'Merriweather',
          'Georgia',
          'serif',
        ],
        mono: [
          'JetBrains Mono',
          'Fira Code',
          'monospace',
        ],
      },
    },
  },
  plugins: [],
};
export default config;
