import { styleVariants } from "@vanilla-extract/css";
import { recipe } from "@vanilla-extract/recipes";

import { colorSprinkles, fontSprinkles } from "./variants.css";

export const recipes = recipe({
  variants: {
    font: styleVariants(
      {
        "sans-01": {
          fontFamily: "sans",
          fontSize: "01",
          lineHeight: "01",
        },
        "sans-02": {
          fontFamily: "sans",
          fontSize: "02",
          lineHeight: "02",
        },
        "sans-03": {
          fontFamily: "sans",
          fontSize: "03",
          lineHeight: "03",
        },
        "sans-04": {
          fontFamily: "sans",
          fontSize: "04",
          lineHeight: "04",
        },
        "sans-05": {
          fontFamily: "sans",
          fontSize: "05",
          lineHeight: "05",
        },
        "sans-06": {
          fontFamily: "sans",
          fontSize: "06",
          lineHeight: "06",
        },
      } as const,
      (properties) => [fontSprinkles(properties)]
    ),
    text: styleVariants(
      {
        "text-01": { color: "text-01" },
        "text-02": { color: "text-02" },
        "text-03": { color: "text-03" },
        "text-04": { color: "text-04" },
        "link-01": { color: "link-01" },
        "error-01": { color: "error-01" },
        "success-01": { color: "success-01" },
      } as const,
      (properties) => [colorSprinkles(properties)]
    ),
    bg: styleVariants(
      {
        "text-01": { backgroundColor: "text-01" },
        "text-02": { backgroundColor: "text-02" },
        "text-03": { backgroundColor: "text-03" },
        "text-04": { backgroundColor: "text-04" },
        "link-01": { backgroundColor: "link-01" },
        "error-01": { backgroundColor: "error-01" },
        "success-01": { backgroundColor: "success-01" },
      } as const,
      (properties) => [colorSprinkles(properties)]
    ),
    component: styleVariants(
      {
        flow: { display: "flow-root" },
        flex: { display: "flex" },
        grid: { display: "grid" },
      },
      (styleMap) => [
        {
          isolation: "isolate",
        },
        styleMap,
      ]
    ),
    flow: {
      // no recipes
    },
    flex: {
      // no recipes
    },
    grid: {
      // solo grid recipes
      ...styleVariants(
        {
          stretch: { justifyItems: "stretch", alignItems: "stretch" },
          center: { justifyItems: "center", alignItems: "center" },
        },
        (styleMap) => [
          {
            gridTemplateColumns: "minmax(0, 1fr)",
            gridTemplateRows: "minmax(0, 1fr)",
          },
          styleMap,
        ]
      ),
    },
  },
});
