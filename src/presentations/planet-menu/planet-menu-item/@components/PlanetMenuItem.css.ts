import { style } from "@vanilla-extract/css";

import { recipes } from "../../../../themes/recipes.css";

export const button = style([
  recipes({
    grid: "center",
  }),
  {
    isolation: "isolate",
    margin: 0,
    padding: 0,
    border: "none",
    background: "none",
    cursor: "pointer",
  },
  {
    ":focus-within": {
      zIndex: 1,
    },
  },
]);

export const container = style([
  recipes({
    place: "stretch",
  }),
  {
    display: "flow-root",
    gridRow: 1,
    gridColumn: 1,
    margin: -32,
  },
]);

export const text = style([
  recipes({
    font: "sans-01",
    text: "text-04",
  }),
  {
    gridRow: 1,
    gridColumn: 1,
    fontSize: 50,
    mixBlendMode: "overlay",
  },
]);
