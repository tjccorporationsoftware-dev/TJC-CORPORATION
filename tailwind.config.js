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
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
        },
      },

      // 📱 Breakpoints แบบ Ultra-Responsive
      screens: {
        xxs: "360px",   // มือถือเล็กมาก เช่น Galaxy A01, iPhone 5 SE
        xs: "420px",    // มือถือทั่วไป 4.7"–5.0"
        sm: "640px",    // มือถือใหญ่
        md: "768px",    // Tablet / iPad Mini
        lg: "1024px",   // iPad 11" / Notebook 13"
        xl: "1280px",   // Laptop 15"
        "2xl": "1536px",
        "3xl": "1900px", // 2K / Ultrawide
        "4xl": "2200px", // 4K + Super Ultrawide
      },
    },
  },

  // 🧩 Core plugins
  corePlugins: {
    preflight: true,
  },

  plugins: [],
};
