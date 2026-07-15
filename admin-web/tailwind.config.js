export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          bg: "#0d0f1a",
          surface: "#13172a",
          border: "#1e2440",
          accent1: "#7c6af7",
          accent2: "#4fa3e8",
          accent3: "#3dd6b5",
          muted: "#2a2f52",
        },
        text: {
          primary: "#e8eaf6",
          secondary: "#8b90b8",
          success: "#3dd6b5",
          warning: "#f5a623",
          danger: "#e05c5c",
        },
        // Talibon Polytechnic College — pulled from the official seal
        tpc: {
          navy: "#0F3A5C", // outer ring
          navyDeep: "#0A2A44", // darker navy for scrims/overlays
          gold: "#F4C430", // ring trim / pyramid highlight
          goldDeep: "#D9A521", // pyramid shadow side
          green: "#3C9A3C", // laurel leaves
          white: "#FFFFFF", // dove / book pages
          cream: "#FBF6E9", // soft off-white for text on navy
          greenDeep: "#02451C",
        },
      },
      fontFamily: {
        sans: [
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
        mono: ["ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
      },
      keyframes: {
        fadeUp: {
          from: { opacity: "0", transform: "translateY(14px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        fadeUp: "fadeUp 0.7s cubic-bezier(.21,.6,.27,1) forwards",
      },
    },
  },
};
