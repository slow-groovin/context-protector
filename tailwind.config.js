/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class", // This might not be needed in v4, but keeping for compatibility

  theme: {
    extend: {
      colors: {
        background2: {
          DEFAULT: "rgb(var(--color-background) / <alpha-value>)",
          secondary: "rgb(var(--color-background-secondary) / <alpha-value>)",
          dark: "rgb(var(--color-background-dark) / <alpha-value>)",
        },
        foreground: {
          DEFAULT: "rgb(var(--color-foreground) / <alpha-value>)",
          secondary: "rgb(var(--color-foreground-secondary) / <alpha-value>)",
          dark: "rgb(var(--color-foreground-dark) / <alpha-value>)",
        },
        border: {
          DEFAULT: "rgb(var(--color-border) / <alpha-value>)",
          dark: "rgb(var(--color-border-dark) / <alpha-value>)",
        },
      },
    },
  },
  plugins: [],
};
