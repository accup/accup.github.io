import {
  useMemo,
  type CSSProperties,
  type ComponentType,
  type ReactNode,
} from "react";

import type {
  DynamicFramesetFrameKey,
  DynamicFramesetOrigin,
} from "./DynamicFrameset.types";
import {
  DynamicFramesetFrameContainer,
  type DynamicFramesetFrameContainerClasses,
  type DynamicFramesetFrameContainerProps,
  type DynamicFramesetFrameContainerSlots,
} from "./DynamicFramesetFrameContainer";
import type { DynamicFramesetKit } from "./useDynamicFramesetKit";

export interface DynamicFramesetProps<
  K extends DynamicFramesetFrameKey,
  TFrameProps,
> {
  readonly framesetKit: DynamicFramesetKit<K>;
  readonly framePropsMap?: ReadonlyMap<K, TFrameProps> | undefined;
  readonly classes?: DynamicFramesetClasses | undefined;
  readonly slots?: DynamicFramesetSlots<K, TFrameProps> | undefined;
}

export interface DynamicFramesetClasses
  extends DynamicFramesetFrameContainerClasses {
  readonly root?: string | undefined;
  readonly thumb?: string | undefined;
}

export interface DynamicFramesetSlots<
  K extends DynamicFramesetFrameKey,
  TFrameProps,
> extends DynamicFramesetFrameContainerSlots<TFrameProps> {
  /**
   * Frame container
   */
  readonly FrameContainer?:
    | ComponentType<DynamicFramesetFrameContainerProps<K, TFrameProps>>
    | undefined;
}

/**
 * Render the same component with different properties in a grid layout.
 */
export function DynamicFrameset<K extends DynamicFramesetFrameKey, TFrameProps>(
  props: DynamicFramesetProps<K, TFrameProps>,
): ReactNode {
  const {
    framesetKit,
    framePropsMap = new Map<K, TFrameProps>(),
    classes,
    slots,
  } = props;
  const { FrameContainer = DynamicFramesetFrameContainer } = slots ?? {};

  const { origin, useFrameKits, rowSideSize, columnSideSize } = framesetKit;

  const frameKits = useFrameKits(framePropsMap);

  const rootStyle = useMemo<CSSProperties>(() => {
    return {
      display: "flow-root",
      isolation: "isolate",
      position: "relative",
      ...getFramesetSizeStyles(origin, rowSideSize, columnSideSize),
    };
  }, [origin, rowSideSize, columnSideSize]);

  return (
    <div className={classes?.root} style={rootStyle}>
      {frameKits.map((frameKit) => {
        const { key } = frameKit;

        return (
          <FrameContainer
            key={key}
            framesetKit={framesetKit}
            frameKit={frameKit}
            classes={classes}
            slots={slots}
          />
        );
      })}
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
