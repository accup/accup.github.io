import classNames from "classnames";
import { type CSSProperties, type ComponentType, useMemo } from "react";

import type {
  DynamicFramesetFlow,
  DynamicFramesetFrameState,
  DynamicFramesetGrid,
} from "./DynamicFrameset.types";

export interface DynamicFramesetFrameClasses {
  frame?: string | undefined;
}

export interface DynamicFramesetFrameProps<
  TFrameComponentProps,
  TFrameComponentStaticProps extends Partial<TFrameComponentProps>,
> {
  flow: DynamicFramesetFlow;
  frame: DynamicFramesetFrameState<
    TFrameComponentProps,
    TFrameComponentStaticProps
  >;
  grid: DynamicFramesetGrid;
  classes?: DynamicFramesetFrameClasses | undefined;
  FrameComponent: ComponentType<TFrameComponentProps>;
  FrameComponentStaticProps: TFrameComponentStaticProps;
}

export function DynamicFramesetFrame<
  TFrameComponentProps,
  TFrameComponentStaticProps extends Partial<TFrameComponentProps>,
>({
  flow,
  frame,
  grid,
  classes,
  FrameComponent,
  FrameComponentStaticProps,
}: DynamicFramesetFrameProps<
  TFrameComponentProps,
  TFrameComponentStaticProps
>) {
  const frameStyle = useMemo<CSSProperties>(() => {
    const { rowSize, columnSize, insetRowStart, insetColumnStart } =
      grid.getAreaRect({
        gridRowStart: frame.gridRowStart,
        gridRowEnd: frame.gridRowEnd,
        gridColumnStart: frame.gridColumnStart,
        gridColumnEnd: frame.gridColumnEnd,
      });

    return {
      position: "absolute",
      ...getFrameRowStyles(flow, rowSize, insetRowStart),
      ...getFrameColumnStyles(flow, columnSize, insetColumnStart),
    };
  }, [flow, frame, grid]);

  /**
   * The merged object of the static and dynamic properties
   * must satisfy TFrameComponentProps if partially
   * undefined value does not exist in the static properties.
   */
  const props: TFrameComponentProps = {
    ...FrameComponentStaticProps,
    ...frame.props,
  } as TFrameComponentProps;

  return (
    <div className={classNames(classes?.frame)} style={frameStyle}>
      <FrameComponent key={frame.id} {...props} />
    </div>
  );
}

function getFrameRowStyles(
  flow: DynamicFramesetFlow,
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
  switch (flow) {
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

function getFrameColumnStyles(
  flow: DynamicFramesetFlow,
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
  switch (flow) {
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
