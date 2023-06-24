import { style } from "@vanilla-extract/css";

import { recipes } from "../themes-astro/recipes.astro.css";

export const body = style([
  recipes({
    font: "sans-04",
    text: "text-01",
  }),
]);
