import { createTheme, globalStyle, style } from "@vanilla-extract/css";
import { fontFace } from "@vanilla-extract/css";

const carlito = fontFace({
  src: 'url("/Carlito-Regular.ttf")',
});
const cousine = fontFace({
  src: 'url("/Cousine-Regular.ttf")',
});

export const [themeClass, theme] = createTheme({
  font: { text: carlito, monospace: cousine },
  colors: {
    accent: "#49C19B",
    black: "#121212",
    white: "#F7F7F7",
    gray: "#494949",
    red: "#F94B60",
  },
  spaces: {
    small: "1rem",
    medium: "3rem",
  },
  sizes: {
    medium: "1.2rem",
  },
  transition: "all 0.15s, border-width: 0, margin: 0",
});
