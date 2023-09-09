import { createTheme, style } from "@vanilla-extract/css";

import { theme } from "../../../themes/theme.css";

export const defaultTheme = createTheme(theme, {
  color: {
    fg: "#fafafa",
    fgPrimary: "#e4f3ff",
    fgSecondary: "#efb9ff",
    bg: "#292b2c",
    bgPrimary: "#678297",
    bgSecondary: "#744283",
  },
});

export const root = style([
  defaultTheme,
  {
    blockSize: ["100vh", "100vb", "100dvb"],
    inlineSize: ["100vw", "100vi", "100dvi"],
  },
  {
    overflow: "hidden",
  },
  {
    color: theme.color.fg,
    backgroundColor: theme.color.bg,
  },
]);

export const frameContainer = style([
  {
    border: `1px inset ${theme.color.bgSecondary}`,
    transition: "0.3s ease-in-out",
    transitionProperty: "inset, width, height, block-size, inline-size",
  },
]);
