import { useMemo, type CSSProperties, type ComponentType } from "react";

import type {
  DynamicFramesetFrameKey,
  DynamicFramesetOrigin,
} from "./DynamicFrameset.types";
import type { DynamicFramesetFrameKit } from "./useDynamicFramesetFramesKit";
import type { DynamicFramesetKit } from "./useDynamicFramesetKit";

export interface DynamicFramesetFrameContainerProps<
  K extends DynamicFramesetFrameKey,
  TFrameProps,
> {
  readonly framesetKit: DynamicFramesetKit<K>;
  readonly frameKit: DynamicFramesetFrameKit<K, TFrameProps>;
  readonly classes?: DynamicFramesetFrameContainerClasses | undefined;
  readonly slots?: DynamicFramesetFrameContainerSlots<TFrameProps> | undefined;
}

export interface DynamicFramesetFrameContainerClasses {
  readonly frameContainer?: string | undefined;
}

export interface DynamicFramesetFrameContainerSlots<TFrameProps> {
  /**
   * Frame content
   */
  readonly Frame?: ComponentType<TFrameProps> | undefined;
}

/**
 * Render the frame container and the frame with specific properties.
 */
export function DynamicFramesetFrameContainer<
  K extends DynamicFramesetFrameKey,
  TFrameProps,
>(props: DynamicFramesetFrameContainerProps<K, TFrameProps>) {
  const { framesetKit, frameKit, classes, slots: { Frame } = {} } = props;
  const { origin, getGridAreaRect } = framesetKit;
  const { frame, frameProps } = frameKit;

  const frameContainerStyle = useMemo<CSSProperties>(() => {
    const { rowSize, columnSize, insetRowStart, insetColumnStart } =
      getGridAreaRect(frame.gridArea);

    return {
      boxSizing: "border-box",
      position: "absolute",
      ...getFrameRowStyles(origin, rowSize, insetRowStart),
      ...getFrameColumnStyles(origin, columnSize, insetColumnStart),
    };
  }, [origin, getGridAreaRect, frame]);

  return (
    <div className={classes?.frameContainer} style={frameContainerStyle}>
      {Frame != null && frameProps != null && <Frame {...frameProps} />}
    </div>
  );
}

/**
 * Calculate row-side frame styles.
 */
function getFrameRowStyles(
  origin: DynamicFramesetOrigin,
  rowSize: number,
  insetRowStart: number,
): Pick<
  CSSProperties,
  | "top"
  | "right"
  | "bottom"
  | "left"
  | "insetBlockStart"
  | "insetBlockEnd"
  | "insetInlineStart"
  | "insetInlineEnd"
  | "width"
  | "height"
  | "blockSize"
  | "inlineSize"
> {
  switch (origin) {
    case "left/top":
    case "left/bottom":
      return {
        left: insetRowStart,
        width: rowSize,
      };
    case "right/top":
    case "right/bottom":
      return {
        right: insetRowStart,
        width: rowSize,
      };
    case "top/left":
    case "top/right":
      return {
        top: insetRowStart,
        height: rowSize,
      };
    case "bottom/left":
    case "bottom/right":
      return {
        bottom: insetRowStart,
        height: rowSize,
      };
    case "block-start/inline-start":
    case "block-start/inline-end":
      return {
        insetBlockStart: insetRowStart,
        blockSize: rowSize,
      };
    case "block-end/inline-start":
    case "block-end/inline-end":
      return {
        insetBlockEnd: insetRowStart,
        blockSize: rowSize,
      };
    case "inline-start/block-start":
    case "inline-start/block-end":
      return {
        insetInlineStart: insetRowStart,
        inlineSize: rowSize,
      };
    case "inline-end/block-start":
    case "inline-end/block-end":
      return {
        insetInlineEnd: insetRowStart,
        inlineSize: rowSize,
      };
  }
}

/**
 * Calculate column-side frame styles.
 */
function getFrameColumnStyles(
  origin: DynamicFramesetOrigin,
  columnSize: number,
  insetColumnStart: number,
): Pick<
  CSSProperties,
  | "top"
  | "right"
  | "bottom"
  | "left"
  | "insetBlockStart"
  | "insetBlockEnd"
  | "insetInlineStart"
  | "insetInlineEnd"
  | "width"
  | "height"
  | "blockSize"
  | "inlineSize"
> {
  switch (origin) {
    case "top/left":
    case "bottom/left":
      return {
        left: insetColumnStart,
        width: columnSize,
      };
    case "top/right":
    case "bottom/right":
      return {
        right: insetColumnStart,
        width: columnSize,
      };
    case "left/top":
    case "right/top":
      return {
        top: insetColumnStart,
        height: columnSize,
      };
    case "left/bottom":
    case "right/bottom":
      return {
        bottom: insetColumnStart,
        height: columnSize,
      };
    case "inline-start/block-start":
    case "inline-end/block-start":
      return {
        insetBlockStart: insetColumnStart,
        blockSize: columnSize,
      };
    case "inline-start/block-end":
    case "inline-end/block-end":
      return {
        insetBlockEnd: insetColumnStart,
        blockSize: columnSize,
      };
    case "block-start/inline-start":
    case "block-end/inline-start":
      return {
        insetInlineStart: insetColumnStart,
        inlineSize: columnSize,
      };
    case "block-start/inline-end":
    case "block-end/inline-end":
      return {
        insetInlineEnd: insetColumnStart,
        inlineSize: columnSize,
      };
  }
}
