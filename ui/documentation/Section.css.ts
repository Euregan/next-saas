import { theme } from "@/styles/theme.css";
import { style } from "@vanilla-extract/css";

export const section = style({
  display: "flex",
  flexDirection: "column",
  gap: theme.spaces.small,
});
