import { createTheme, style, styleVariants } from "@vanilla-extract/css";

const [varsDefault, vars] = createTheme({
  root: {
    flexFlow: "row",
  },
});

export const root = style([
  varsDefault,
  vars.root,
  {
    display: "flex",
    justifyContent: "stretch",
    alignItems: "stretch",
    blockSize: "100%",
    inlineSize: "100%",
    overflow: ["hidden", "clip"],
  },
]);
export const rootIs = styleVariants({
  row: {
    vars: {
      [vars.root.flexFlow]: "row",
    },
  },
  column: {
    vars: {
      [vars.root.flexFlow]: "column",
    },
  },
});

export const child = style([
  {
    flex: "none",
    display: "flow-root",
    isolation: "isolate",
  },
]);
