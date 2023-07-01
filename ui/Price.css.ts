import { theme } from "@/styles/theme.css";
import { style, styleVariants } from "@vanilla-extract/css";

const cardBase = style({
  borderWidth: "1px",
  borderRadius: "1rem",
  borderStyle: "solid",
  padding: theme.spaces.small,
  transition: theme.transition,
  color: theme.colors.white,
  textDecoration: "none",
  ":hover": {
    borderColor: theme.colors.accent,
  },
});

export const card = styleVariants({
  default: [
    cardBase,
    {
      cursor: "pointer",
      borderColor: theme.colors.gray,
    },
  ],
  active: [
    cardBase,
    {
      borderColor: theme.colors.accent,
    },
  ],
});

export const title = style({ margin: 0 });

export const details = style({
  padding: 0,
  listStyle: "none",
});

export const price = style({ margin: 0 });
