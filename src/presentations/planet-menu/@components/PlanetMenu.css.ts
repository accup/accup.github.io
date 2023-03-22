import { style } from "@vanilla-extract/css";

export const planetMenuNav = style([
  {
    position: "fixed",
    inset: 0,
    overflow: "clip",
    backgroundColor: "#000",
  },
]);

export const planetMenuList = style([
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
