import { theme } from "@/styles/theme.css";
import { style, styleVariants } from "@vanilla-extract/css";
import { input } from "./Input.css";

const buttonBase = style([
  input,
  {
    cursor: "pointer",
    ":disabled": {
      cursor: "default",
      color: theme.colors.gray,
      borderColor: theme.colors.gray,
    },
  },
]);

export const button = styleVariants({
  default: [
    buttonBase,
    {
      ":hover": {
        color: theme.colors.accent,
        borderColor: theme.colors.accent,
      },
    },
  ],
  danger: [
    buttonBase,
    {
      color: theme.colors.red,
      borderColor: theme.colors.red,
      ":hover": {
        color: theme.colors.white,
        borderColor: theme.colors.white,
      },
      ":focus": {
        borderColor: theme.colors.white,
      },
    },
  ],
  cta: [
    buttonBase,
    {
      color: theme.colors.black,
      borderColor: theme.colors.accent,
      backgroundColor: theme.colors.accent,
      ":hover": {
        color: theme.colors.white,
        borderColor: theme.colors.white,
        backgroundColor: theme.colors.black,
      },
      ":focus": {
        borderWidth: 3,
        margin: -2,
        borderColor: theme.colors.white,
      },
    },
  ],
});
