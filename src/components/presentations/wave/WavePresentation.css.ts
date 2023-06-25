import { createTheme, style } from "@vanilla-extract/css";

import { theme } from "../../../themes/theme.css";

export const defaultTheme = createTheme(theme, {
  color: {
    fg: "#fafafa",
    fgPrimary: "#aedbff",
    fgSecondary: "#efb9ff",
    bg: "#3c323f",
    bgPrimary: "#2a6697",
    bgSecondary: "#744283",
  },
});

export const root = style([
  defaultTheme,
  {
    blockSize: ["100vh", "100vb", "100dvb"],
    inlineSize: ["100vw", "100vi", "100dvi"],
    color: theme.color.fg,
    backgroundColor: theme.color.bg,
  },
]);
