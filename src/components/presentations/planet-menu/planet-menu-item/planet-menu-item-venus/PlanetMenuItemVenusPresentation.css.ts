import { style } from "@vanilla-extract/css";

import { recipes } from "../../../../../themes/recipes.css";

export const label = style([
  recipes({
    flex: "column",
  }),
  {
    gap: 30,
    alignItems: "center",
  },
]);

export const input = style([
  recipes({
    font: "sans-01",
  }),
  {
    maxWidth: 150,
    height: 40,
    border: "none",
    fontSize: 25,
    color: "white",
    background: "transparent",
    boxShadow: "0 0 10px 5px white, inset 0 0 20px 5px white",
    borderRadius: 3,
    textAlign: "center",
  },
  {
    ":focus-visible": {
      outline: "3px solid white",
    },
  },
]);
