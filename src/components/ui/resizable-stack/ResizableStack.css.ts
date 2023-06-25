import { createTheme, style, styleVariants } from "@vanilla-extract/css";

const [varsDefault, vars] = createTheme({
  theme: {
    resizeBar: {
      width: "4px",
    },
  },
  root: {
    flexFlow: "row",
  },
  resizeBar: {
    blockSize: "auto",
    inlineSize: "auto",
    cursor: "row-resize",
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
      [vars.resizeBar.inlineSize]: vars.theme.resizeBar.width,
      [vars.resizeBar.cursor]: "col-resize",
    },
  },
  column: {
    vars: {
      [vars.root.flexFlow]: "column",
      [vars.resizeBar.blockSize]: vars.theme.resizeBar.width,
      [vars.resizeBar.cursor]: "row-resize",
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
