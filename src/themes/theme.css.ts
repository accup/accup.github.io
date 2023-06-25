import { createThemeContract } from "@vanilla-extract/css";

export const theme = createThemeContract({
  color: {
    fg: null,
    fgPrimary: null,
    fgSecondary: null,
    bg: null,
    bgPrimary: null,
    bgSecondary: null,
  },
});
