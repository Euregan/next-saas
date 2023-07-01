import { style } from "@vanilla-extract/css";
import { theme } from "./theme.css";

export const page = style({
  maxWidth: "50rem",
  margin: "auto",
  display: "flex",
  flexDirection: "column",
  gap: theme.spaces.medium,
});

export const section = style({
  display: "flex",
  flexDirection: "column",
  gap: theme.spaces.small,
});

export const keys = style({
  padding: 0,
  listStyle: "none",
});
