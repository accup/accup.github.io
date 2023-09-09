import { useState } from "react";
import type { InitializeState } from "../../../utils/react/state";
import type { DynamicFramesetOrigin } from "./DynamicFrameset.types";

export interface UseDynamicFramesetOriginProps {
  /**
   * Default origin
   *
   * @default "block-start/inline-start"
   */
  readonly initialize?: InitializeState<DynamicFramesetOrigin> | undefined;
}

/**
 * Origin properties for DynamicFrameset
 */
export interface DynamicFramesetOriginKit {
  /**
   * Origin state
   */
  readonly state: DynamicFramesetOrigin;
  /**
   * Change origin.
   */
  setState(state: DynamicFramesetOrigin): void;
}

export function useDynamicFramesetOriginKit(
  props?: UseDynamicFramesetOriginProps | undefined,
): DynamicFramesetOriginKit {
  const { initialize = "block-start/inline-start" } = props ?? {};

  const [state, setState] = useState<DynamicFramesetOrigin>(initialize);

  return {
    state,
    setState,
  };
}
