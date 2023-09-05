import { useMemo, type CSSProperties, type ComponentType } from "react";

import type { Classes, Styles } from "../../../utils/react/style";
import type { DynamicFramesetOrigin } from "./DynamicFrameset.types";
import type { DynamicFramesetGridProps } from "./useDynamicFramesetGrid";
import type { DynamicFramesetFrame } from "./useDynamicFramesetFrames";

export type DynamicFramesetFrameContainerStyleKey = "frameContainer";

/**
 * DynamicFrameset slots
 */
export interface DynamicFramesetFrameContainerSlots<TFrameProps> {
  /**
   * Frame content
   */
  readonly Frame?: ComponentType<TFrameProps> | undefined;
}

/**
 * DynamicFrameset frame container properties
 */
export interface DynamicFramesetFrameContainerProps<TFrameProps> {
  /**
   * Frame properties
   */
  readonly frameProps?: TFrameProps | undefined;
  /**
   * DOM element classes
   */
  readonly classes?: Classes<DynamicFramesetFrameContainerStyleKey> | undefined;
  /**
   * DOM element styles
   */
  readonly styles?: Styles<DynamicFramesetFrameContainerStyleKey> | undefined;
  /**
   * Components
   */
  readonly slots?: DynamicFramesetFrameContainerSlots<TFrameProps> | undefined;
}

/**
 * Render the frame container and the frame with specific properties.
 */
export function DynamicFramesetFrameContainer<TFrameProps>(
  props: DynamicFramesetFrameContainerProps<TFrameProps>,
) {
  const { frameProps, classes, styles, slots: { Frame } = {} } = props;

  return (
    <div className={classes?.frameContainer} style={styles?.frameContainer}>
      {Frame != null && frameProps != null && (
        <Frame key="frame" {...frameProps} />
      )}
    </div>
  );
}

export function useDynamicFramesetFrameStyles(props: {
  readonly origin: DynamicFramesetOrigin;
  readonly grid: DynamicFramesetGridProps;
  readonly frame: DynamicFramesetFrame;
}): DynamicFramesetFrameContainerProps<unknown>["styles"] {
  const { origin, grid, frame } = props;

  const frameContainer = useMemo<CSSProperties>(() => {
    const { rowSize, columnSize, insetRowStart, insetColumnStart } =
      grid.getAreaRect(frame.gridArea);

    return {
      position: "absolute",
      ...getFrameRowStyles(origin, rowSize, insetRowStart),
      ...getFrameColumnStyles(origin, columnSize, insetColumnStart),
    };
  }, [origin, grid, frame]);

  return { frameContainer };
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
