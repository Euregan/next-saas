import { globalStyle, style } from "@vanilla-extract/css";
import { theme } from "./theme.css";

export const main = style({
  fontFamily: theme.font.text,
  background: theme.colors.black,
  color: theme.colors.white,
  minHeight: "100vh",
});

globalStyle("html", { fontSize: "17px" });

globalStyle("body", { margin: 0 });

globalStyle("pre", {
  display: "inline",
  fontFamily: theme.font.monospace,
  margin: 0,
  fontSize: "15px",
});

globalStyle("p", { margin: 0 });

globalStyle("h1", {
  fontSize: "34px",
  marginTop: 0,
  marginBottom: 0,
});
globalStyle("h2", {
  fontSize: "24px",
  marginTop: "1rem",
  marginBottom: 0,
});
