import { theme } from "@/styles/theme.css";
import { style } from "@vanilla-extract/css";

export const link = style({
  color: theme.colors.accent,
  textDecoration: "none",
  transition: theme.transition,
  ":focus": {
    outline: "none",
    filter: "brightness(150%)",
  },
});
