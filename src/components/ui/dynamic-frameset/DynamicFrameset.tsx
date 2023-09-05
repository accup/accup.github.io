import {
  useMemo,
  type CSSProperties,
  type ComponentType,
  type ReactNode,
} from "react";

import type {
  DynamicFramesetFramePropertyMap,
  DynamicFramesetFrameState,
  DynamicFramesetGrid,
  DynamicFramesetOrigin,
} from "./DynamicFrameset.types";
import {
  DynamicFramesetFrameContainer,
  type DynamicFramesetFrameContainerProps,
  type DynamicFramesetFrameContainerStyleKey,
} from "./DynamicFramesetFrameContainer";
import type { Classes, Styles } from "../../../utils/react/style";
import { useDynamicFramesetFrame } from "./useDynamicFramesetFrames";
import type { DynamicFramesetGridProps } from "./useDynamicFramesetGrid";

export type DynamicFramesetStyleKey =
  | "frameset"
  | "thumb"
  | DynamicFramesetFrameContainerStyleKey;

/**
 * DynamicFrameset slots
 */
export interface DynamicFramesetSlots<TFrameProps> {
  /**
   * Frame content
   */
  readonly Frame?: ComponentType<TFrameProps> | undefined;
  /**
   * Frame container
   */
  readonly FrameContainer?:
    | ComponentType<DynamicFramesetFrameContainerProps<TFrameProps>>
    | undefined;
}

/**
 * DynamicFrameset properties
 */
export interface DynamicFramesetProps<TFrameProps> {
  /**
   * Starting point of the DynamicFrameset flow
   */
  readonly origin: DynamicFramesetOrigin;
  /**
   * Grid operations
   */
  readonly grid: DynamicFramesetGrid;
  /**
   * List of frame states
   */
  readonly frameStates?: readonly DynamicFramesetFrameState[] | undefined;
  /**
   * Mapping of frame properties
   */
  readonly framePropsMap?:
    | DynamicFramesetFramePropertyMap<TFrameProps>
    | undefined;
  /**
   * DOM element classes
   */
  readonly classes?: Classes<DynamicFramesetStyleKey> | undefined;
  /**
   * DOM element styles
   */
  readonly styles?: Styles<DynamicFramesetStyleKey> | undefined;
  /**
   * Components
   */
  readonly slots?: DynamicFramesetSlots<TFrameProps> | undefined;
}

/**
 * Render the same component with different properties in a grid layout.
 */
export function DynamicFrameset<TFrameProps>(
  props: DynamicFramesetProps<TFrameProps>,
): ReactNode {
  const {
    origin,
    grid,
    frameStates = [],
    framePropsMap,
    classes,
    styles,
    slots,
  } = props;

  return (
    <div className={classes?.frameset} style={styles?.frameset}>
      {frameStates.map((frameState) => (
        <StandaloneFrameContainer
          key={frameState.id}
          origin={origin}
          grid={grid}
          frameState={frameState}
          frameProps={framePropsMap?.get?.(frameState.id)}
          classes={classes}
          styles={styles}
          slots={slots}
        />
      ))}
    </div>
  );
}

function StandaloneFrameContainer<TFrameProps>(
  props: {
    readonly origin: DynamicFramesetOrigin;
    readonly grid: DynamicFramesetGrid;
    readonly frameState: DynamicFramesetFrameState;
    readonly slots?: DynamicFramesetSlots<TFrameProps> | undefined;
  } & Pick<
    DynamicFramesetFrameContainerProps<TFrameProps>,
    "frameProps" | "classes" | "styles"
  >,
) {
  const {
    origin,
    grid,
    frameState,
    frameProps,
    slots: { Frame, FrameContainer = DynamicFramesetFrameContainer } = {},
  } = props;

  const frameContainerProps = useDynamicFramesetFrame({
    origin,
    grid,
    frameState,
  });

  return (
    <FrameContainer
      {...frameContainerProps}
      frameProps={frameProps}
      slots={{ Frame }}
    />
  );
}

export function useDynamicFrameset<TFrameComponentProps>(props: {
  readonly origin: DynamicFramesetOrigin;
  readonly grid: DynamicFramesetGridProps;
  readonly FrameComponent: ComponentType<TFrameComponentProps>;
}): DynamicFramesetProps<TFrameComponentProps> {
  const { origin, grid } = props;

  return {
    styles: {
      frameset: useMemo<CSSProperties>(() => {
        const { totalRowSize, totalColumnSize } = grid.getTotalSizes();

        return {
          display: "flow-root",
          isolation: "isolate",
          position: "relative",
          ...getFramesetSizeStyles(origin, totalRowSize, totalColumnSize),
        };
      }, [origin, grid]),
    },
  };
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
