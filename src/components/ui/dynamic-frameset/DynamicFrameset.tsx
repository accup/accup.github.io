import classNames from "classnames";
import {
  type CSSProperties,
  type ComponentType,
  type ReactNode,
  useMemo,
} from "react";

import type {
  DynamicFramesetFlow,
  DynamicFramesetState,
} from "./DynamicFrameset.types";
import { useDynamicFramesetGrid } from "./useDynamicFramesetGrid";
import { DynamicFramesetFrame } from "./DynamicFramesetFrame";

export interface DynamicFramesetClasses {
  frameset?: string | undefined;
  frame?: string | undefined;
  thumb?: string | undefined;
}

/**
 * DynamicFrameset properties
 */
export interface DynamicFramesetProps<
  TFrameComponentProps,
  TFrameComponentStaticProps extends Partial<TFrameComponentProps>,
> {
  state: DynamicFramesetState<TFrameComponentProps, TFrameComponentStaticProps>;
  classes?: DynamicFramesetClasses | undefined;
  FrameComponent: ComponentType<TFrameComponentProps>;
  FrameComponentStaticProps: TFrameComponentStaticProps;
}

/**
 * Render the same component with different properties in a grid layout.
 */
export function DynamicFrameset<
  TFrameComponentProps,
  TFrameComponentStaticProps extends Partial<TFrameComponentProps>,
>({
  state,
  classes,
  FrameComponent,
  FrameComponentStaticProps,
}: DynamicFramesetProps<
  TFrameComponentProps,
  TFrameComponentStaticProps
>): ReactNode {
  const grid = useDynamicFramesetGrid(state);

  const rootStyle = useMemo<CSSProperties>(() => {
    const { totalRowSize, totalColumnSize } = grid.getTotalSizes();

    return {
      display: "flow-root",
      isolation: "isolate",
      position: "relative",
      ...getFramesetSizeStyles(state.flow, totalRowSize, totalColumnSize),
    };
  }, [state.flow, grid]);

  return (
    <div className={classNames(classes?.frameset)} style={rootStyle}>
      {state.frames.map((frame) => (
        <DynamicFramesetFrame
          key={frame.id}
          flow={state.flow}
          frame={frame}
          grid={grid}
          classes={classes}
          FrameComponent={FrameComponent}
          FrameComponentStaticProps={FrameComponentStaticProps}
        />
      ))}
    </div>
  );
}

function getFramesetSizeStyles(
  flow: DynamicFramesetFlow,
  totalRowSize: number,
  totalColumnSize: number,
): Pick<CSSProperties, "width" | "height" | "blockSize" | "inlineSize"> {
  switch (flow) {
    case "left/top":
    case "left/bottom":
    case "right/top":
    case "right/bottom":
      return {
        width: totalRowSize,
        height: totalColumnSize,
      };

    case "top/left":
    case "top/right":
    case "bottom/left":
    case "bottom/right":
      return {
        width: totalColumnSize,
        height: totalRowSize,
      };

    case "block-start/inline-start":
    case "block-start/inline-end":
    case "block-end/inline-start":
    case "block-end/inline-end":
      return {
        blockSize: totalRowSize,
        inlineSize: totalColumnSize,
      };

    case "inline-start/block-start":
    case "inline-start/block-end":
    case "inline-end/block-start":
    case "inline-end/block-end":
      return {
        blockSize: totalColumnSize,
        inlineSize: totalRowSize,
      };
  }
}
