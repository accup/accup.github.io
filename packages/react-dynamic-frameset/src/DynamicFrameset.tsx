import classNames from "classnames";
import {
  type CSSProperties,
  ComponentType,
  type ReactNode,
  useMemo,
} from "react";

import { getFramesetSizeStyles } from "./DynamicFrameset.utils";
import type {
  FrameComponentProps,
  FrameState,
  FramesetFlow,
  FramesetGrid,
  FramesetState,
} from "./types";
import { useFramesetGrid } from "./useFramesetGrid";

type FrameComponentPropsWithoutState<TProps extends FrameComponentProps> = Omit<
  TProps,
  "state"
>;

type FrameComponent<TProps extends FrameComponentProps> = ComponentType<
  Pick<TProps, "state"> & FrameComponentPropsWithoutState<TProps>
>;

export interface DynamicFramesetProps<TProps extends FrameComponentProps> {
  state: FramesetState<TProps>;
  classes?: DynamicFramesetClasses | undefined;
  FrameComponent: FrameComponent<TProps>;
  FrameComponentProps: FrameComponentPropsWithoutState<TProps>;
}

interface DynamicFramesetClasses {
  root?: string;
  frame?: string;
  thumb?: string;
}

export function DynamicFrameset<TProps extends FrameComponentProps>({
  state,
  classes,
  FrameComponent,
  FrameComponentProps,
}: DynamicFramesetProps<TProps>): ReactNode {
  const grid = useFramesetGrid(state);

  const rootStyle = useMemo<CSSProperties>(() => {
    const { fullRowSize, fullColumnSize } = grid.getFullSize();

    const sizeStyles: CSSProperties = getFramesetSizeStyles(
      state.flow,
      fullRowSize,
      fullColumnSize
    );

    return {
      display: "flow-root",
      isolation: "isolate",
      position: "relative",
      ...sizeStyles,
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

interface DynamicFramesetFrameProps<TProps extends FrameComponentProps> {
  flow: FramesetFlow;
  frame: FrameState<TProps>;
  grid: FramesetGrid;
  classes?: DynamicFramesetClasses | undefined;
  FrameComponent: FrameComponent<TProps>;
  FrameComponentProps: FrameComponentPropsWithoutState<TProps>;
}

function DynamicFramesetFrame<TProps extends FrameComponentProps>({
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
    const rowStyles: CSSProperties = (() => {
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
    })();
    const columnStyles: CSSProperties = (() => {
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
    })();

    return {
      position: "absolute",
      ...rowStyles,
      ...columnStyles,
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
