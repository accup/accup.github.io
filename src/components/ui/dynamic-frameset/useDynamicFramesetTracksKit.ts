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
  /**
   * Track states
   */
  readonly tracks: readonly DynamicFramesetTrackState[];

  /**
   * Replace tracks.
   */
  replaceTracks(tracks: readonly DynamicFramesetTrackState[]): void;
  /**
   * Append a new track.
   */
  appendTrack(track: DynamicFramesetTrackState): void;
  /**
   * Insert a new track.
   */
  insertTrack(index: number, track: DynamicFramesetTrackState): void;
  /**
   * Update a track.
   */
  updateTrack(index: number, track: DynamicFramesetTrackState): void;
  /**
   * Remove a track.
   */
  removeTrack(index: number): void;
}

export function useDynamicFramesetTracksKit(
  props?: UseDynamicFramesetTracksKitProps | undefined,
): DynamicFramesetTracksKit {
  const { initialize = [] } = props ?? {};

  const {
    items: tracks,
    replaceItems: replaceTracks,
    appendItem: appendTrack,
    insertItem: insertTrack,
    updateItem: updateTrack,
    removeItem: removeTrack,
  } = useArrayStateKit({ initialize });

  return {
    tracks,
    replaceTracks,
    appendTrack,
    insertTrack,
    updateTrack,
    removeTrack,
  };
}
