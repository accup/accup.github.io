import { createSprinkles, defineProperties } from "@vanilla-extract/sprinkles";

export const fontSprinkles = createSprinkles(
  defineProperties({
    properties: {
      fontFamily: {
        sans: "'Noto Sans JP', monospace",
      },
      fontWeight: {
        thin: 100,
        light: 300,
        normal: 400,
        medium: 500,
        bold: 700,
        black: 900,
      },
      fontSize: {
        "01": "24px",
        "02": "20px",
        "03": "16px",
        "04": "14px",
        "05": "12px",
        "06": "10px",
      },
      lineHeight: {
        "01": "36px",
        "02": "30px",
        "03": "24px",
        "04": "20px",
        "05": "18px",
        "06": "14px",
      },
    },
  }),
);

const colorVariants = {
  "text-01": "#000000",
  "text-02": "#595959",
  "text-03": "#D6D6D6",
  "text-04": "#FFFFFF",
  "link-01": "#0017E9",
  "error-01": "#FF2929",
  "success-01": "#26CF2D",
};

export const colorSprinkles = createSprinkles(
  defineProperties({
    properties: {
      color: colorVariants,
      backgroundColor: colorVariants,
      borderTopColor: colorVariants,
      borderBottomColor: colorVariants,
      borderLeftColor: colorVariants,
      borderRightColor: colorVariants,
      outlineTopColor: colorVariants,
      outlineBottomColor: colorVariants,
      outlineLeftColor: colorVariants,
      outlineRightColor: colorVariants,
      fill: colorVariants,
      stroke: colorVariants,
    },
    shorthands: {
      borderColor: [
        "borderTopColor",
        "borderBottomColor",
        "borderLeftColor",
        "borderRightColor",
      ],
      outlineColor: [
        "outlineTopColor",
        "outlineBottomColor",
        "outlineLeftColor",
        "outlineRightColor",
      ],
    },
  }),
);
