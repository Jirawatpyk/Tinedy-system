// Note: Type import from tailwindcss may not resolve during tsc but works fine at runtime
const config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Tinedy Color Palette
        trust: "#2e4057",       // Deep navy - professionalism
        eco: "#8fbc96",         // Sage green - sustainability
        care: "#d0dae7",        // Soft blue-grey - elegance
        simplicity: "#f5f3ee",  // Warm beige - simplicity
        dirty: "#2d241d",       // Dark brown - contrast
      },
      fontFamily: {
        // Tinedy Typography
        display: ["var(--font-raleway)", "sans-serif"],  // Headings
        body: ["var(--font-poppins)", "sans-serif"],     // Body text
        mono: ["var(--font-jetbrains-mono)", "monospace"],
      },
      borderRadius: {
        sm: "8px",
        md: "12px",
        lg: "16px",
        xl: "24px",
      },
    },
  },
  plugins: [],
};
export default config;
