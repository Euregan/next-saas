import { theme } from "@/styles/theme.css";
import { style } from "@vanilla-extract/css";

export const container = style({
  display: "flex",
  gap: theme.spaces.small,
  alignItems: "baseline",
});
