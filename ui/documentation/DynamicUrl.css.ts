import { style } from "@vanilla-extract/css";
import { input } from "../form/Input.css";
import { theme } from "@/styles/theme.css";

export const dynamicUrl = style({
  display: "flex",
  flexDirection: "column",
  borderStyle: "solid",
  borderWidth: "1px",
  borderColor: theme.colors.gray,
  borderRadius: "0.5rem",
  // to prevent the url background from overflowing
  overflow: "hidden",
});

export const header = style({
  display: "grid",
  gridTemplateColumns: "4fr 1fr",
  alignItems: "center",
});

export const title = style({
  padding: "0rem 0.3rem",
});

export const soleGroup = style({
  padding: "0.1rem 0.3rem",
  textAlign: "right",
});

export const select = style([
  input,
  {
    padding: "0.2rem 0.3rem",
    borderRadius: 0,
    borderTop: "none",
    borderRight: "none",
  },
]);

export const option = style({
  color: "initial",
});

export const url = style({
  padding: "0.6rem 0.5rem 0.4rem",
  background: "#242424",
});
