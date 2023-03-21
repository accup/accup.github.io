import { recipe } from "@vanilla-extract/recipes";

import { colorSprinkles, fontSprinkles } from "./variants.css";

export const recipes = recipe({
  defaultVariants: {
    font: "noto-04",
    text: "mono-01",
  },
  variants: {
    font: {
      "noto-01": fontSprinkles({
        fontFamily: "noto",
        fontSize: "01",
        lineHeight: "01",
      }),
      "noto-02": fontSprinkles({
        fontFamily: "noto",
        fontSize: "02",
        lineHeight: "02",
      }),
      "noto-03": fontSprinkles({
        fontFamily: "noto",
        fontSize: "03",
        lineHeight: "03",
      }),
      "noto-04": fontSprinkles({
        fontFamily: "noto",
        fontSize: "04",
        lineHeight: "04",
      }),
      "noto-05": fontSprinkles({
        fontFamily: "noto",
        fontSize: "05",
        lineHeight: "05",
      }),
      "noto-06": fontSprinkles({
        fontFamily: "noto",
        fontSize: "06",
        lineHeight: "06",
      }),
    },
    text: {
      "mono-01": colorSprinkles({ color: "mono-01" }),
      "mono-02": colorSprinkles({ color: "mono-02" }),
      "mono-03": colorSprinkles({ color: "mono-03" }),
      "mono-04": colorSprinkles({ color: "mono-04" }),
      "link-01": colorSprinkles({ color: "link-01" }),
      "error-01": colorSprinkles({ color: "error-01" }),
      "success-01": colorSprinkles({ color: "success-01" }),
    },
    bg: {
      "mono-01": colorSprinkles({ backgroundColor: "mono-01" }),
      "mono-02": colorSprinkles({ backgroundColor: "mono-02" }),
      "mono-03": colorSprinkles({ backgroundColor: "mono-03" }),
      "mono-04": colorSprinkles({ backgroundColor: "mono-04" }),
      "link-01": colorSprinkles({ backgroundColor: "link-01" }),
      "error-01": colorSprinkles({ backgroundColor: "error-01" }),
      "success-01": colorSprinkles({ backgroundColor: "success-01" }),
    },
  },
});
