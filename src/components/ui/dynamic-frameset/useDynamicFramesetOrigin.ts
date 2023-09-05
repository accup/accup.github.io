import { useState } from "react";
import type { DynamicFramesetOrigin } from "./DynamicFrameset.types";

export interface UseDynamicFramesetOriginProps {
  /**
   * Default origin
   *
   * @default "block-start/inline-start"
   */
  readonly initialize?:
    | DynamicFramesetOrigin
    | (() => DynamicFramesetOrigin)
    | undefined;
}

/**
 * Origin properties for DynamicFrameset
 */
export interface DynamicFramesetOriginProps {
  /**
   * Origin
   */
  origin: DynamicFramesetOrigin;
  /**
   * Change origin.
   */
  setOrigin(origin: DynamicFramesetOrigin): void;
}

export function useDynamicFramesetOrigin(
  props?: UseDynamicFramesetOriginProps | undefined,
): DynamicFramesetOriginProps {
  const { initialize = "block-start/inline-start" } = props ?? {};

  const [origin, setOrigin] = useState<DynamicFramesetOrigin>(initialize);

  return {
    origin,
    setOrigin,
  };
}
