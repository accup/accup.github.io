import { style, styleVariants } from "@vanilla-extract/css";

export const nav = style([
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

const listItemBase = style([
  {
    display: "grid",
    gridTemplateColumns: "minmax(0, 1fr)",
    gridTemplateRows: "minmax(0, 1fr)",
    justifyItems: "stretch",
    alignItems: "stretch",
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
    listItemBase,
    {
      position: "absolute",
      ...rect,
    },
  ]
);
