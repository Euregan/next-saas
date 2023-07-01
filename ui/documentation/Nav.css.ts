import { theme } from "@/styles/theme.css";
import { style } from "@vanilla-extract/css";

export const nav = style({
  listStyle: "none",
  padding: 0,
  paddingLeft: theme.spaces.small,
});
