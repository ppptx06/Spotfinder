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
          purple: "#AF52DE",
          indigo: "#5856D6",
          teal: "#5AC8FA",
          gray1: "#8E8E93",
          gray2: "#AEAEB2",
          gray3: "#C7C7CC",
          gray4: "#D1D1D6",
          gray5: "#E5E5EA",
          gray6: "#F2F2F7",
          border: "rgba(60, 60, 67, 0.12)",
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
      borderRadius: {
        "apple-sm": "12px",
        "apple": "18px",
        "apple-card": "22px",
        "apple-sheet": "28px",
        "apple-island": "34px",
      },
      boxShadow: {
        apple: "0 2px 8px rgba(0, 0, 0, 0.04)",
        "apple-elevated": "0 4px 16px rgba(0, 0, 0, 0.08)",
        "apple-sheet": "0 -4px 24px rgba(0, 0, 0, 0.08)",
        "apple-button": "0 1px 3px rgba(0, 0, 0, 0.08)",
        "apple-card": "0 4px 20px -2px rgba(0, 0, 0, 0.05), 0 2px 6px -1px rgba(0, 0, 0, 0.02)",
        "apple-card-hover": "0 14px 34px -4px rgba(0, 0, 0, 0.09), 0 4px 12px -2px rgba(0, 0, 0, 0.03)",
        "apple-glass": "0 8px 32px 0 rgba(0, 0, 0, 0.06)",
        "apple-modal": "0 24px 64px -12px rgba(0, 0, 0, 0.18)",
      },
    },
  },
  plugins: [],
};
export default config;
