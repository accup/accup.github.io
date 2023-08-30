import classNames from "classnames";
import {
  type CSSProperties,
  type ComponentType,
  type ReactNode,
  useMemo,
} from "react";

import type {
  DynamicFramesetFlow,
  DynamicFramesetFrameComponentProps,
  DynamicFramesetFrameState,
  DynamicFramesetGrid,
  DynamicFramesetState,
} from "./DynamicFrameset.types";
import { useDynamicFramesetGrid } from "./useDynamicFramesetGrid";

type FrameComponentPropsWithoutState<
  TProps extends DynamicFramesetFrameComponentProps,
> = Omit<TProps, "state">;

type FrameComponent<TProps extends DynamicFramesetFrameComponentProps> =
  ComponentType<
    Pick<TProps, "state"> & FrameComponentPropsWithoutState<TProps>
  >;

interface DynamicFramesetClasses {
  root?: string;
  frame?: string;
  thumb?: string;
}

export interface DynamicFramesetProps<
  TProps extends DynamicFramesetFrameComponentProps,
> {
  state: DynamicFramesetState<TProps>;
  classes?: DynamicFramesetClasses | undefined;
  FrameComponent: FrameComponent<TProps>;
  FrameComponentProps: FrameComponentPropsWithoutState<TProps>;
}

export function DynamicFrameset<
  TProps extends DynamicFramesetFrameComponentProps,
>({
  state,
  classes,
  FrameComponent,
  FrameComponentProps,
}: DynamicFramesetProps<TProps>): ReactNode {
  const grid = useDynamicFramesetGrid(state);

  const rootStyle = useMemo<CSSProperties>(() => {
    const { fullRowSize, fullColumnSize } = grid.getFullSize();

    return {
      display: "flow-root",
      isolation: "isolate",
      position: "relative",
      ...getFramesetSizeStyles(state.flow, fullRowSize, fullColumnSize),
    };
  }, [state.flow, grid]);

  return (
    <div className={classNames(classes?.root)} style={rootStyle}>
      {state.frames.map((frame) => (
        <DynamicFramesetFrame
          key={frame.id}
          flow={state.flow}
          frame={frame}
          grid={grid}
          classes={classes}
          FrameComponent={FrameComponent}
          FrameComponentProps={FrameComponentProps}
        />
      ))}
    </div>
  );
}

interface DynamicFramesetFrameProps<
  TProps extends DynamicFramesetFrameComponentProps,
> {
  flow: DynamicFramesetFlow;
  frame: DynamicFramesetFrameState<TProps>;
  grid: DynamicFramesetGrid;
  classes?: DynamicFramesetClasses | undefined;
  FrameComponent: FrameComponent<TProps>;
  FrameComponentProps: FrameComponentPropsWithoutState<TProps>;
}

function DynamicFramesetFrame<
  TProps extends DynamicFramesetFrameComponentProps,
>({
  flow,
  frame,
  grid,
  classes,
  FrameComponent,
  FrameComponentProps,
}: DynamicFramesetFrameProps<TProps>) {
  const frameStyle = useMemo<CSSProperties>(() => {
    const { rowSize, columnSize, insetRowStart, insetColumnStart } =
      grid.getAreaRect({
        rowStart: frame.gridRowStart,
        rowEnd: frame.gridRowEnd,
        columnStart: frame.gridColumnStart,
        columnEnd: frame.gridColumnEnd,
      });

    return {
      position: "absolute",
      ...getFrameRowStyles(flow, rowSize, insetRowStart),
      ...getFrameColumnStyles(flow, columnSize, insetColumnStart),
    };
  }, [flow, frame, grid]);

  return (
    <div className={classNames(classes?.frame)} style={frameStyle}>
      <FrameComponent
        key={frame.id}
        state={frame.state}
        {...FrameComponentProps}
      />
    </div>
  );
}

function getFramesetSizeStyles(
  flow: DynamicFramesetFlow,
  fullRowSize: number,
  fullColumnSize: number,
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
