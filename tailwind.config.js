/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}",
  ],

  theme: {
    extend: {
      // 🎨 Colors
      colors: {
        gold: {
          100: "#FFF8E1",
          200: "#FFECB3",
          300: "#FFD54F",
          400: "#FFCA28",
          500: "#FFC107",
          600: "#FFB300",
          700: "#FFA000",
          800: "#FF8F00",
          900: "#FF6F00",
        },
        gray: {
          50: "#f9fafb",
          100: "#f3f4f6",
          200: "#e5e7eb",
          300: "#d1d5db",
          400: "#9ca3af",
          500: "#6b7280",
          600: "#4b5563",
          700: "#374151",
          800: "#1f2937",
          900: "#111827",
        },
      },

      // 📱 Breakpoints แบบ Ultra-Responsive
      screens: {
        xxs: "360px",
        xs: "420px",
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1536px",
        "3xl": "1900px",
        "4xl": "2200px",
      },
    },
  },

  corePlugins: {
    preflight: true,
  },

  // ✅ เพิ่มปลั๊กอิน line-clamp ตรงนี้
  plugins: [require("@tailwindcss/line-clamp")],
};
