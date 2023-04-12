import { style } from "@vanilla-extract/css";

import { recipes } from "../../../themes/recipes.css";

export const listItem = style([
  {
    display: "flow-root",
    isolation: "isolate",
  },
]);

export const button = style([
  {
    display: "block",
    position: "absolute",
    inset: 0,
    border: "none",
    background: "none",
    cursor: "pointer",
  },
]);

export const text = style([
  recipes({
    font: "sans-01",
    text: "text-04",
  }),
  {
    fontSize: 50,
  },
]);

export const canvas = style([
  {
    display: "block",
    position: "absolute",
    margin: 0,
    inset: -64,
  },
]);
