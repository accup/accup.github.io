/**
 * The starting point of a DynamicFrameset flow.
 */
export type DynamicFramesetOrigin =
  | "top/left"
  | "top/right"
  | "bottom/left"
  | "bottom/right"
  | "left/top"
  | "left/bottom"
  | "right/top"
  | "right/bottom"
  | "block-start/inline-start"
  | "block-start/inline-end"
  | "block-end/inline-start"
  | "block-end/inline-end"
  | "inline-start/block-start"
  | "inline-start/block-end"
  | "inline-end/block-start"
  | "inline-end/block-end";

/**
 * Frame identifier
 */
export type DynamicFramesetFrameKey = string;
