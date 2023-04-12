import { styleVariants } from "@vanilla-extract/css";
import { recipe } from "@vanilla-extract/recipes";

import { colorSprinkles, fontSprinkles } from "./variants.css";

export const recipes = recipe({
  defaultVariants: {
    font: "sans-04",
    text: "text-01",
  },
  variants: {
    font: {
      "sans-01": fontSprinkles({
        fontFamily: "sans",
        fontSize: "01",
        lineHeight: "01",
      }),
      "sans-02": fontSprinkles({
        fontFamily: "sans",
        fontSize: "02",
        lineHeight: "02",
      }),
      "sans-03": fontSprinkles({
        fontFamily: "sans",
        fontSize: "03",
        lineHeight: "03",
      }),
      "sans-04": fontSprinkles({
        fontFamily: "sans",
        fontSize: "04",
        lineHeight: "04",
      }),
      "sans-05": fontSprinkles({
        fontFamily: "sans",
        fontSize: "05",
        lineHeight: "05",
      }),
      "sans-06": fontSprinkles({
        fontFamily: "sans",
        fontSize: "06",
        lineHeight: "06",
      }),
    },
    text: {
      "text-01": colorSprinkles({ color: "text-01" }),
      "text-02": colorSprinkles({ color: "text-02" }),
      "text-03": colorSprinkles({ color: "text-03" }),
      "text-04": colorSprinkles({ color: "text-04" }),
      "link-01": colorSprinkles({ color: "link-01" }),
      "error-01": colorSprinkles({ color: "error-01" }),
      "success-01": colorSprinkles({ color: "success-01" }),
    },
    bg: {
      "text-01": colorSprinkles({ backgroundColor: "text-01" }),
      "text-02": colorSprinkles({ backgroundColor: "text-02" }),
      "text-03": colorSprinkles({ backgroundColor: "text-03" }),
      "text-04": colorSprinkles({ backgroundColor: "text-04" }),
      "link-01": colorSprinkles({ backgroundColor: "link-01" }),
      "error-01": colorSprinkles({ backgroundColor: "error-01" }),
      "success-01": colorSprinkles({ backgroundColor: "success-01" }),
    },
    component: {
      root: {
        display: "flow-root",
        isolation: "isolate",
      },
    },
    grid: {
      ...styleVariants(
        {
          stretch: { justifyItems: "stretch", alignItems: "stretch" },
          center: { justifyItems: "center", alignItems: "center" },
        },
        (gridStyleMap) => [
          {
            display: "grid",
            gridTemplateColumns: "minmax(0, 1fr)",
            gridTemplateRows: "minmax(0, 1fr)",
          },
          gridStyleMap,
        ]
      ),
    },
  },
});
