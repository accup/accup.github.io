import {
  useMemo,
  type CSSProperties,
  type ComponentType,
  type ReactNode,
} from "react";

import type {
  DynamicFramesetFramePropertyMap,
  DynamicFramesetOrigin,
} from "./DynamicFrameset.types";
import {
  DynamicFramesetFrameContainer,
  type DynamicFramesetFrameContainerClasses,
  type DynamicFramesetFrameContainerProps,
  type DynamicFramesetFrameContainerSlots,
} from "./DynamicFramesetFrameContainer";
import type { DynamicFramesetKit } from "./useDynamicFramesetKit";

export interface DynamicFramesetProps<TFrameProps> {
  readonly frameset: DynamicFramesetKit;
  readonly framePropsMap?:
    | DynamicFramesetFramePropertyMap<TFrameProps>
    | undefined;
  readonly classes?: DynamicFramesetClasses | undefined;
  readonly slots?: DynamicFramesetSlots<TFrameProps> | undefined;
}

export interface DynamicFramesetClasses
  extends DynamicFramesetFrameContainerClasses {
  readonly root?: string | undefined;
  readonly thumb?: string | undefined;
}

export interface DynamicFramesetSlots<TFrameProps>
  extends DynamicFramesetFrameContainerSlots<TFrameProps> {
  /**
   * Frame container
   */
  readonly FrameContainer?:
    | ComponentType<DynamicFramesetFrameContainerProps<TFrameProps>>
    | undefined;
}

/**
 * Render the same component with different properties in a grid layout.
 */
export function DynamicFrameset<TFrameProps>(
  props: DynamicFramesetProps<TFrameProps>,
): ReactNode {
  const { frameset, framePropsMap, classes, slots } = props;
  const { origin, grid, frames: framesKit } = frameset;
  const { FrameContainer = DynamicFramesetFrameContainer } = slots ?? {};

  const frames = useMemo(
    () => framesKit.getFrames(framePropsMap),
    [framesKit, framePropsMap],
  );

  const rootStyle = useMemo<CSSProperties>(() => {
    return {
      display: "flow-root",
      isolation: "isolate",
      position: "relative",
      ...getFramesetSizeStyles(
        origin.state,
        grid.totalRowSize,
        grid.totalColumnSize,
      ),
    };
  }, [origin, grid]);

  return (
    <div className={classes?.root} style={rootStyle}>
      {frames.map((frame) => (
        <FrameContainer
          key={frame.state.id}
          origin={frameset.origin}
          grid={frameset.grid}
          frame={frame}
          classes={classes}
          slots={slots}
        />
      ))}
    </div>
  );
}

function getFramesetSizeStyles(
  origin: DynamicFramesetOrigin,
  totalRowSize: number,
  totalColumnSize: number,
): Pick<CSSProperties, "width" | "height" | "blockSize" | "inlineSize"> {
  switch (origin) {
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
