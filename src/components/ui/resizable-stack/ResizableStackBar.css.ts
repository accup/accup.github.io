import { createTheme, style, styleVariants } from "@vanilla-extract/css";

import { theme } from "../../../themes/theme.css";

const [varsDefault, vars] = createTheme({
  theme: {
    resizeBar: {
      width: "12px",
    },
  },
  root: {
    blockSize: "auto",
    inlineSize: "auto",
    borderBlock: "none",
    borderInline: "none",
    cursor: "row-resize",
  },
});

export const root = style([
  varsDefault,
  vars.root,
  {
    flex: "none",
    boxSizing: "border-box",
    backgroundColor: theme.color.fgPrimary,
  },
]);
export const rootIs = styleVariants({
  row: {
    vars: {
      [vars.root.inlineSize]: vars.theme.resizeBar.width,
      [vars.root.borderInline]: `1px solid ${theme.color.bgPrimary}`,
      [vars.root.cursor]: "col-resize",
    },
  },
  column: {
    vars: {
      [vars.root.blockSize]: vars.theme.resizeBar.width,
      [vars.root.borderBlock]: `1px solid ${theme.color.bgPrimary}`,
      [vars.root.cursor]: "row-resize",
    },
  },
});
