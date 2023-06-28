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
    touchAction: "none",
  },
]);
export const rootIs = styleVariants({
  horizontal: {
    vars: {
      [vars.root.cursor]: "col-resize",
    },
  },
  horizontalLeftEnd: {
    vars: {
      [vars.root.cursor]: "col-resize",
    },
  },
  horizontalRightEnd: {
    vars: {
      [vars.root.cursor]: "col-resize",
    },
  },
  horizontalBothEnd: {
    vars: {
      [vars.root.cursor]: "not-allowed",
    },
  },
  vertical: {
    vars: {
      [vars.root.cursor]: "row-resize",
    },
  },
  verticalTopEnd: {
    vars: {
      [vars.root.cursor]: "row-resize",
    },
  },
  verticalBottomEnd: {
    vars: {
      [vars.root.cursor]: "row-resize",
    },
  },
  verticalBothEnd: {
    vars: {
      [vars.root.cursor]: "not-allowed",
    },
  },
  row: {
    vars: {
      [vars.root.borderInline]: `1px solid ${theme.color.bgPrimary}`,
    },
  },
  column: {
    vars: {
      [vars.root.borderBlock]: `1px solid ${theme.color.bgPrimary}`,
    },
  },
});
