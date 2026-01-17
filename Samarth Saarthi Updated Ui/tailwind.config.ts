import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
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
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "#FCA311", // Premium Gold
          foreground: "#FFFFFF",
        },
        secondary: {
          DEFAULT: "#FCA311", // Premium Gold
          foreground: "#FFFFFF",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "#FCA311", // Premium Gold
          foreground: "#FFFFFF",
        },
        success: {
          DEFAULT: "#FCA311", // Premium Gold
          foreground: "#FFFFFF",
        },
        warning: {
          DEFAULT: "#FCA311", // Premium Gold
          foreground: "#000000",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
        karma: "hsl(var(--karma))",
        credits: "hsl(var(--credits))",
        premium: {
          black: "#000000",
          darkBlue: "#14213D",
          gold: "#FCA311",
          heading: "#FFFFFF",
          body: "#E5E5E5",
          background: "#000000",
          container: "#14213D",
          gradient: "linear-gradient(135deg, #FCA311 0%, #F77F00 100%)",
          "glass": "rgba(20, 33, 61, 0.9)",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        xl: "18px", // Premium border radius for cards
        '2xl': "22px", // Premium border radius for larger containers
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
        "fade-in": {
          from: { opacity: "0", transform: "translateY(10px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "fade-out": {
          from: { opacity: "1", transform: "translateY(0)" },
          to: { opacity: "0", transform: "translateY(10px)" },
        },
        "scale-in": {
          from: { transform: "scale(0.95)", opacity: "0" },
          to: { transform: "scale(1)", opacity: "1" },
        },
        "slide-in-right": {
          from: { transform: "translateX(100%)" },
          to: { transform: "translateX(0)" },
        },
        "slide-in-left": {
          from: { transform: "translateX(-100%)" },
          to: { transform: "translateX(0)" },
        },
        "slide-up": {
          from: { transform: "translateY(100%)", opacity: "0" },
          to: { transform: "translateY(0)", opacity: "1" },
        },
        "float": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "pulse-soft": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.7" },
        },
        "spin-slow": {
          from: { transform: "rotate(0deg)" },
          to: { transform: "rotate(360deg)" },
        },
        "bounce-soft": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-5px)" },
        },
        "progress-fill": {
          from: { width: "0%" },
          to: { width: "var(--progress)" },
        },
        "ripple": {
          "0%": { transform: "scale(0)", opacity: "0.5" },
          "100%": { transform: "scale(4)", opacity: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.4s ease-out",
        "fade-out": "fade-out 0.3s ease-out",
        "scale-in": "scale-in 0.3s ease-out",
        "slide-in-right": "slide-in-right 0.4s ease-out",
        "slide-in-left": "slide-in-left 0.4s ease-out",
        "slide-up": "slide-up 0.5s ease-out",
        "float": "float 3s ease-in-out infinite",
        "pulse-soft": "pulse-soft 2s ease-in-out infinite",
        "spin-slow": "spin-slow 8s linear infinite",
        "bounce-soft": "bounce-soft 2s ease-in-out infinite",
        "progress-fill": "progress-fill 1s ease-out forwards",
        "ripple": "ripple 0.6s linear",
      },
      boxShadow: {
        "glow": "0 0 40px hsl(var(--primary) / 0.3)",
        "glow-accent": "0 0 40px hsl(var(--accent) / 0.3)",
        "glow-sm": "0 0 20px hsl(var(--primary) / 0.2)",
        "alpine-light": "0 4px 16px rgba(106, 162, 224, 0.12)",
        "alpine-elevated": "0 6px 20px rgba(106, 162, 224, 0.18)",
        "soft": "0 1px 3px 0 hsl(var(--foreground) / 0.1), 0 1px 2px -1px hsl(var(--foreground) / 0.1)",
        "card": "0 4px 12px 0px rgba(106, 162, 224, 0.15)",
        "card-hover": "0 6px 16px -2px rgba(106, 162, 224, 0.22)",
        "elevated-1": "0 4px 8px 0px rgba(106, 162, 224, 0.15)",
        "elevated-2": "0 8px 16px 0px rgba(106, 162, 224, 0.18)",
        "elevated-3": "0 12px 24px 0px rgba(106, 162, 224, 0.22)",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "hero-pattern": "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;