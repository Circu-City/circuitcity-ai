/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "dark-navy": "#0A1428",
        "lemon-green": "#A3E635",
        primary: {
          DEFAULT: "#A3E635",
          foreground: "#0A1428",
        },
        secondary: {
          DEFAULT: "#f3f4f6",
          foreground: "#0A1428",
        },
        muted: {
          DEFAULT: "#f3f4f6",
          foreground: "#6b7280",
        },
        accent: {
          DEFAULT: "#f3f4f6",
          foreground: "#0A1428",
        },
        destructive: {
          DEFAULT: "#ef4444",
          foreground: "#ffffff",
        },
        background: "#ffffff",
        foreground: "#0A1428",
        card: {
          DEFAULT: "#ffffff",
          foreground: "#0A1428",
        },
        popover: {
          DEFAULT: "#ffffff",
          foreground: "#0A1428",
        },
        border: "#e5e7eb",
        input: "#e5e7eb",
        ring: "#A3E635",
      },
      borderRadius: {
        lg: "0.5rem",
        md: "calc(0.5rem - 2px)",
        sm: "calc(0.5rem - 4px)",
      },
    },
  },
  plugins: [],
};
