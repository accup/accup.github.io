import { style, styleVariants } from "@vanilla-extract/css";

import { recipes } from "../../../../themes/recipes.css";

export const nav = style([
  recipes({
    grid: "stretch",
  }),
  {
    position: "fixed",
    inset: 0,
    padding: 32,
    overflow: "clip",
    backgroundColor: "#000",
  },
]);

export const list = style([
  recipes({
    flex: "row",
  }),
  {
    flexWrap: "wrap",
    listStyle: "none",
    margin: 0,
    padding: 0,
  },
]);

export const listItem = styleVariants(
  {
    mercury: {},
    venus: {},
    earth: {},
    mars: {},
    jupiter: {},
    saturn: {},
    uranus: {},
    neptune: {},
  },
  (styleMap) => [
    recipes({
      grid: "stretch",
    }),
    {
      flexGrow: 1,
      flexShrink: 0,
      flexBasis: 250,
      height: 250,
    },
    styleMap,
  ],
);
