import type { InitializeState } from "../../../utils/react/state";
import { useArrayStateKit } from "../../../utils/react/useArrayStateKit";

/**
 * Track state
 */
export interface DynamicFramesetTrackState {
  /**
   * Determined track size
   */
  readonly basis: number;
  /**
   * Undetermined track size
   */
  readonly flex: number;
}

export interface UseDynamicFramesetTracksKitProps {
  readonly initialize?:
    | InitializeState<readonly DynamicFramesetTrackState[]>
    | undefined;
}

export interface DynamicFramesetTracksKit {
  readonly state: readonly DynamicFramesetTrackState[];
  setState(tracks: readonly DynamicFramesetTrackState[]): void;
  insertTrack(index: number, track: DynamicFramesetTrackState): void;
  updateTrack(index: number, track: DynamicFramesetTrackState): void;
  removeTrack(index: number): void;
}

export function useDynamicFramesetTracksKit(
  props?: UseDynamicFramesetTracksKitProps | undefined,
): DynamicFramesetTracksKit {
  const { initialize = [] } = props ?? {};

  const {
    state,
    setState,
    insertItem: insertTrack,
    updateItem: updateTrack,
    removeItem: removeTrack,
  } = useArrayStateKit({ initialize });

  return {
    state,
    setState,
    insertTrack,
    updateTrack,
    removeTrack,
  };
}
