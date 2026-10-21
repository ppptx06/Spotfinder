import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        apple: {
          blue: "#007AFF",
          green: "#34C759",
          orange: "#FF9500",
          red: "#FF3B30",
          yellow: "#FFCC00",
          gray1: "#8E8E93",
          gray2: "#AEAEB2",
          gray3: "#C7C7CC",
          gray4: "#D1D1D6",
          gray5: "#E5E5EA",
          gray6: "#F2F2F7",
          darkBg: "#000000",
          darkCard: "#1C1C1E",
          darkElevated: "#2C2C2E",
        },
      },
      fontFamily: {
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          "SF Pro Display",
          "SF Pro Text",
          "system-ui",
          "sans-serif",
        ],
      },
      boxShadow: {
        apple: "0 4px 20px -2px rgba(0, 0, 0, 0.08)",
        "apple-elevated": "0 10px 30px -4px rgba(0, 0, 0, 0.12)",
        "apple-sheet": "0 -8px 30px rgba(0, 0, 0, 0.12)",
      },
    },
  },
  plugins: [],
};
export default config;
