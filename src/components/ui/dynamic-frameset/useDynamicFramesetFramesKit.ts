import { useCallback } from "react";
import { type InitializeState } from "../../../utils/react/state";
import { useArrayStateKit } from "../../../utils/react/useArrayStateKit";
import type {
  DynamicFramesetFrameId,
  DynamicFramesetFramePropertyMap,
} from "./DynamicFrameset.types";
import type {
  DynamicFramesetGridArea,
  DynamicFramesetGridAreaConstraints,
} from "./useDynamicFramesetGridKit";

/**
 * DynamicFrameset Frame state
 */
export interface DynamicFramesetFrameState {
  /**
   * Frame identifier
   */
  readonly id: DynamicFramesetFrameId;
  /**
   * Position and size of the frame
   */
  readonly gridArea: DynamicFramesetGridArea;
  /**
   * Constraints of the frame grid area
   */
  readonly constraints: DynamicFramesetGridAreaConstraints;
}

export interface DynamicFramesetFrameKit<TFrameProps> {
  readonly state: DynamicFramesetFrameState;
  readonly frameProps: TFrameProps | undefined;
  setState(state: DynamicFramesetFrameState): void;
}

export interface UseDynamicFramesetFramesProps {
  initialize?:
    | InitializeState<readonly DynamicFramesetFrameState[]>
    | undefined;
}

export interface DynamicFramesetFramesKit {
  getFrames<TFrameProps>(
    framePropsMap?: DynamicFramesetFramePropertyMap<TFrameProps> | undefined,
  ): readonly DynamicFramesetFrameKit<TFrameProps>[];
  replaceFrames(frameStates: readonly DynamicFramesetFrameState[]): void;
  insertFrame(index: number, frameState: DynamicFramesetFrameState): void;
  updateFrame(index: number, frameState: DynamicFramesetFrameState): void;
  removeFrame(index: number, frameState: DynamicFramesetFrameState): void;
}

export function useDynamicFramesetFramesKit(
  props: UseDynamicFramesetFramesProps,
): DynamicFramesetFramesKit {
  const { initialize = [] } = props;

  const {
    state,
    setState: replaceFrames,
    insertItem: insertFrame,
    updateItem: updateFrame,
    removeItem: removeFrame,
  } = useArrayStateKit({ initialize });

  const getFrames = useCallback<DynamicFramesetFramesKit["getFrames"]>(
    (framePropsMap) =>
      state.map((state, index) => {
        const frameProps = framePropsMap?.get?.(state.id);

        return {
          state,
          frameProps,
          setState: (state) => updateFrame(index, state),
        };
      }),
    [state, updateFrame],
  );

  return {
    getFrames,
    replaceFrames,
    insertFrame,
    updateFrame,
    removeFrame,
  };
}
