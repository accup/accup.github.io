import { style } from "@vanilla-extract/css";

import { recipes } from "../../themes/recipes.css";

export const canvas = style([
  recipes({
    flow: "root",
  }),
]);
