import { globalStyle } from "@vanilla-extract/css";

import { recipes } from "./presentations/recipes.css";

globalStyle("html, body", {
  margin: 0,
  padding: 0,
});

export const appStyle = recipes({
  font: "noto-04",
  text: "mono-01",
  bg: "mono-04",
});
