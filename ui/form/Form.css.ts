import { theme } from "@/styles/theme.css";
import { style, styleVariants } from "@vanilla-extract/css";

export const formBase = style({
  display: "flex",
  gap: theme.spaces.small,
  alignItems: "flex-end",
});

export const form = styleVariants({
  default: [formBase],
  inline: [formBase],
});
