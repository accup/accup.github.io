import { globalStyle } from "@vanilla-extract/css";

import { recipes } from "./theme/recipes.css";

globalStyle("html, body", {
  margin: 0,
  padding: 0,
});

export const appStyle = recipes();
