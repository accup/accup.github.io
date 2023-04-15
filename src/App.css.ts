import { style } from "@vanilla-extract/css";

import { recipes } from "./themes/recipes.css";

export const root = style([
  recipes({
    font: "sans-04",
    text: "text-01",
  }),
  {
    display: "flow-root",
  },
]);
