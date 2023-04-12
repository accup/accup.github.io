import { style, styleVariants } from "@vanilla-extract/css";

import { recipes } from "../../../themes/recipes.css";

export const nav = style([
  recipes({
    component: "root",
  }),
  {
    position: "fixed",
    inset: 0,
    overflow: "clip",
    backgroundColor: "#000",
  },
]);

export const list = style([
  {
    listStyle: "none",
    margin: 0,
    padding: 0,
  },
  {
    position: "absolute",
    inset: 0,
    overflow: "clip",
  },
]);

export const listItem = styleVariants(
  {
    mercury: { left: 60, top: 30, width: 560, height: 240 },
    venus: {},
    earth: {},
    mars: {},
    jupiter: {},
    saturn: {},
    uranus: {},
    neptune: {},
  },
  (rect) => [
    recipes({
      grid: "stretch",
    }),
    {
      position: "absolute",
      ...rect,
    },
  ]
);
