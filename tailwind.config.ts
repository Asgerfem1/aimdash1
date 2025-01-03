import type { Config } from "tailwindcss";

export default {
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        outfit: ['Outfit', 'sans-serif'],
      },
      colors: {
        border: {
          DEFAULT: "hsl(var(--border))",
          dark: "#2e2e2e",
        },
        background: {
          DEFAULT: "#ffffff",
          dark: "#121212",
        },
        foreground: {
          DEFAULT: "#000000",
          dark: "#ffffff",
        },
        primary: {
          DEFAULT: "#6366F1",
          foreground: "#FFFFFF",
          100: "#EEF2FF",
          200: "#E0E7FF",
          300: "#C7D2FE",
          400: "#A5B4FC",
          500: "#6366F1",
          600: "#4F46E5",
          700: "#4338CA",
          dark: "#818cf8",
        },
        secondary: {
          DEFAULT: "#60A5FA",
          foreground: "#FFFFFF",
          dark: "#3b82f6",
        },
        accent: {
          DEFAULT: "#4F46E5",
          foreground: "#FFFFFF",
          dark: "#6366f1",
        },
        card: {
          DEFAULT: "#ffffff",
          dark: "#1e1e1e",
          foreground: {
            DEFAULT: "#000000",
            dark: "#ffffff",
          },
        },
        muted: {
          DEFAULT: "#f3f4f6",
          foreground: "#6b7280",
          dark: "#2e2e2e",
          "foreground-dark": "#a1a1aa",
        },
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        slideIn: {
          from: { transform: "translateX(-100%)" },
          to: { transform: "translateX(0)" },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        slideIn: "slideIn 0.3s ease-out",
        "float": "float 6s ease-in-out infinite",
        "float-slow": "float 8s ease-in-out infinite",
        "float-delayed": "float 7s ease-in-out infinite 1s",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;