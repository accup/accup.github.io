import type { CSSProperties } from "react";

import type { FramesetFlow } from "./types";

export function getFramesetSizeStyles(
  flow: FramesetFlow,
  fullRowSize: number,
  fullColumnSize: number
): Pick<CSSProperties, "width" | "height" | "blockSize" | "inlineSize"> {
  switch (flow) {
    case "left/top":
    case "left/bottom":
    case "right/top":
    case "right/bottom":
      return {
        width: fullRowSize,
        height: fullColumnSize,
      };

    case "top/left":
    case "top/right":
    case "bottom/left":
    case "bottom/right":
      return {
        width: fullColumnSize,
        height: fullRowSize,
      };

    case "block-start/inline-start":
    case "block-start/inline-end":
    case "block-end/inline-start":
    case "block-end/inline-end":
      return {
        blockSize: fullRowSize,
        inlineSize: fullColumnSize,
      };

    case "inline-start/block-start":
    case "inline-start/block-end":
    case "inline-end/block-start":
    case "inline-end/block-end":
      return {
        blockSize: fullColumnSize,
        inlineSize: fullRowSize,
      };
  }
}
