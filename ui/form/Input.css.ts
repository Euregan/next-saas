import { theme } from "@/styles/theme.css";
import { style } from "@vanilla-extract/css";
import { formBase } from "./Form.css";

export const label = style({
  display: "flex",
  flexDirection: "column",
  gap: "0.5rem",
  selectors: {
    [`.${formBase} &`]: {
      flexGrow: "1",
    },
  },
});

export const labelAndError = style({
  display: "flex",
  gap: theme.spaces.small,
});

export const input = style({
  background: "none",
  borderWidth: "1px",
  borderStyle: "solid",
  borderColor: theme.colors.gray,
  padding: "0.5rem 0.6rem",
  borderRadius: "0.5rem",
  color: theme.colors.white,
  transition: theme.transition,
  ":focus": {
    outline: "none",
    borderColor: theme.colors.accent,
  },
});

export const error = style({
  color: theme.colors.red,
});
