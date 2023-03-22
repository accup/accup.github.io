import { style } from "@vanilla-extract/css";

import { recipes } from "../../../themes/recipes.css";
import { fontSprinkles } from "../../../themes/variants.css";

export const planetMenuItemMercuryListItem = style([
  {
    position: "absolute",
    left: 60,
    top: 30,
    width: 560,
    height: 240,
  },
]);

export const planetMenuItemMercuryButton = style([
  recipes({ font: "noto-04" }),
  {
    display: "block",
    position: "absolute",
    inset: 0,
    border: "none",
    background: "none",
    cursor: "pointer",
  },
]);

export const planetMenuItemMercurySvg = style([
  {
    position: "absolute",
    inset: 0,
    margin: "auto",
    width: "100%",
    height: "100%",
  },
]);

export const planetMenuItemMercurySvgText = style([
  fontSprinkles({
    fontWeight: "bold",
  }),
  {
    textAnchor: "middle",
    transform: "skewX(-10deg)",
    fontSize: 50,
    fill: "#8df",
    stroke: "#49b",
    strokeWidth: 4,
    paintOrder: "stroke",
  },
]);

export const planetMenuItemMercuryCanvas = style([
  {
    display: "block",
    position: "absolute",
    margin: 0,
    inset: -64,
  },
]);
