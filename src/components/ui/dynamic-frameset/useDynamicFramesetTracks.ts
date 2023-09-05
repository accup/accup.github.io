import { useArrayState, type UseStateProps } from "../../../utils/react/state";

/**
 * Track state
 */
export interface DynamicFramesetTrack {
  /**
   * Determined track size
   */
  readonly basis: number;
  /**
   * Undetermined track size
   */
  readonly flex: number;
}

export interface UseDynamicFramesetTracksProps
  extends UseStateProps<readonly DynamicFramesetTrack[]> {}

export interface DynamicFramesetTracksProps {
  tracks: readonly DynamicFramesetTrack[];
  setTracks(tracks: readonly DynamicFramesetTrack[]): void;
  insertTrack(index: number, track: DynamicFramesetTrack): void;
  updateTrack(index: number, track: DynamicFramesetTrack): void;
  removeTrack(index: number): void;
}

export function useDynamicFramesetTracks(
  props?: UseDynamicFramesetTracksProps | undefined,
): DynamicFramesetTracksProps {
  const { initialize = [] } = props ?? {};

  const {
    array: tracks,
    setArray: setTracks,
    insertItem: insertTrack,
    updateItem: updateTrack,
    removeItem: removeTrack,
  } = useArrayState(initialize);

  return {
    tracks,
    setTracks,
    insertTrack,
    updateTrack,
    removeTrack,
  };
}
