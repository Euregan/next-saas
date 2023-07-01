import { theme } from "@/styles/theme.css";
import { style } from "@vanilla-extract/css";

export const nav = style({
  display: "flex",
  justifyContent: "space-between",
  fontSize: theme.sizes.medium,
  padding: theme.spaces.small,
});

export const links = style({
  all: "unset",
  listStyle: "none",
  display: "flex",
  gap: theme.spaces.medium,
});
