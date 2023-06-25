import { createTheme, style, styleVariants } from "@vanilla-extract/css";

import { theme } from "../../../themes/theme.css";

const [varsDefault, vars] = createTheme({
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
      [vars.root.borderInline]: `1px solid ${theme.color.bgPrimary}`,
      [vars.root.cursor]: "col-resize",
    },
  },
  column: {
    vars: {
      [vars.root.borderBlock]: `1px solid ${theme.color.bgPrimary}`,
      [vars.root.cursor]: "row-resize",
    },
  },
});
