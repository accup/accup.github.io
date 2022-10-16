import { styleVariants } from "@vanilla-extract/css";

export const fonts = {
  NotoSansJP: styleVariants(
    {
      thin: 100,
      light: 300,
      regular: 400,
      medium: 500,
      bold: 700,
      black: 900,
    } as const,
    (fontWeight) => ({
      fontFamily: "'Noto Sans JP', sans-serif",
      fontWeight,
    })
  ),
} as const;
