import { useState } from "react";
import {
  useInitialState,
  type InitializeState,
} from "../../../utils/react/state";
import type {
  DynamicFramesetFrameKey,
  DynamicFramesetOrigin,
} from "./DynamicFrameset.types";
import {
  useDynamicFramesetFramesKit,
  type DynamicFramesetFrameKit,
  type DynamicFramesetFrameState,
} from "./useDynamicFramesetFramesKit";
import {
  useDynamicFramesetGrid,
  type DynamicFramesetGridArea,
  type DynamicFramesetGridRect,
} from "./useDynamicFramesetGridKit";
import {
  useDynamicFramesetTracksKit,
  type DynamicFramesetTrackState,
} from "./useDynamicFramesetTracksKit";

export interface DynamicFramesetKit<K extends DynamicFramesetFrameKey> {
  /**
   * The starting point of a DynamicFrameset flow
   */
  readonly origin: DynamicFramesetOrigin;

  /**
   * Update the origin.
   */
  replaceOrigin(origin: DynamicFramesetOrigin): void;

  /**
   * Row side track states
   */
  readonly rowSideTracks: readonly DynamicFramesetTrackState[];

  /**
   * Replace row-side tracks.
   */
  replaceRowSideTracks(tracks: readonly DynamicFramesetTrackState[]): void;
  /**
   * Append a new row-side track.
   */
  appendRowSideTrack(track: DynamicFramesetTrackState): void;
  /**
   * Insert a new row-side track.
   */
  insertRowSideTrack(index: number, track: DynamicFramesetTrackState): void;
  /**
   * Update a row-side track.
   */
  updateRowSideTrack(index: number, track: DynamicFramesetTrackState): void;
  /**
   * Remove a row-side track.
   */
  removeRowSideTrack(index: number): void;

  /**
   * Column side track states
   */
  readonly columnSideTracks: readonly DynamicFramesetTrackState[];

  /**
   * Replace column-side tracks.
   */
  replaceColumnSideTracks(tracks: readonly DynamicFramesetTrackState[]): void;
  /**
   * Append a new column-side track.
   */
  appendColumnSideTrack(track: DynamicFramesetTrackState): void;
  /**
   * Insert a new column-side track.
   */
  insertColumnSideTrack(index: number, track: DynamicFramesetTrackState): void;
  /**
   * Update a column-side track.
   */
  updateColumnSideTrack(index: number, track: DynamicFramesetTrackState): void;
  /**
   * Remove a column-side track.
   */
  removeColumnSideTrack(index: number): void;

  /**
   * Mapping of frame states
   */
  readonly frameMap: ReadonlyMap<K, DynamicFramesetFrameState>;
  /**
   * Replace a mapping of frame states.
   */
  replaceFrameMap(frameMap: ReadonlyMap<K, DynamicFramesetFrameState>): void;
  /**
   * Set a frame with a key.
   */
  setFrame(key: K, frame: DynamicFramesetFrameState): void;
  /**
   * Remove a frame by a key.
   */
  removeFrame(key: K): void;
  /**
   * Get frame kits.
   */
  useFrameKits<TFrameProps>(
    framePropsMap: ReadonlyMap<K, TFrameProps>,
  ): readonly DynamicFramesetFrameKit<K, TFrameProps>[];

  /**
   * Total size of all row-side tracks
   */
  readonly rowSideSize: number;
  /**
   * Total size of all column-side tracks
   */
  readonly columnSideSize: number;

  /**
   * Get the properties related to the size and position of a single grid area.
   */
  getGridAreaRect(gridArea: DynamicFramesetGridArea): DynamicFramesetGridRect;
}

export interface UseDynamicFramesetKitProps<K extends DynamicFramesetFrameKey> {
  readonly initialize?:
    | InitializeState<{
        readonly origin?: DynamicFramesetOrigin | undefined;
        readonly rowSideTracks?:
          | readonly DynamicFramesetTrackState[]
          | undefined;
        readonly columnSideTracks?:
          | readonly DynamicFramesetTrackState[]
          | undefined;
        readonly frames?: ReadonlyMap<K, DynamicFramesetFrameState> | undefined;
      }>
    | undefined;
}

export function useDynamicFramesetKit<K extends DynamicFramesetFrameKey>(
  props: UseDynamicFramesetKitProps<K>,
): DynamicFramesetKit<K> {
  const { initialize } = props;

  const initialState = useInitialState(initialize);

  const [origin, replaceOrigin] = useState<DynamicFramesetOrigin>(
    initialState?.origin ?? "block-start/inline-start",
  );

  const rowSideTracksKit = useDynamicFramesetTracksKit({
    initialize: initialState?.rowSideTracks,
  });

  const columnSideTracksKit = useDynamicFramesetTracksKit({
    initialize: initialState?.columnSideTracks,
  });

  const frameMapKit = useDynamicFramesetFramesKit({
    initialize: initialState?.frames,
  });

  const {
    rowSideSize,
    columnSideSize,
    getAreaRect: getGridAreaRect,
  } = useDynamicFramesetGrid({ rowSideTracksKit, columnSideTracksKit });

  return {
    origin,
    replaceOrigin,

    rowSideTracks: rowSideTracksKit.tracks,
    replaceRowSideTracks: rowSideTracksKit.replaceTracks,
    appendRowSideTrack: rowSideTracksKit.appendTrack,
    insertRowSideTrack: rowSideTracksKit.insertTrack,
    updateRowSideTrack: rowSideTracksKit.updateTrack,
    removeRowSideTrack: rowSideTracksKit.removeTrack,

    columnSideTracks: columnSideTracksKit.tracks,
    replaceColumnSideTracks: columnSideTracksKit.replaceTracks,
    appendColumnSideTrack: columnSideTracksKit.appendTrack,
    insertColumnSideTrack: columnSideTracksKit.insertTrack,
    updateColumnSideTrack: columnSideTracksKit.updateTrack,
    removeColumnSideTrack: columnSideTracksKit.removeTrack,

    frameMap: frameMapKit.frameMap,
    replaceFrameMap: frameMapKit.replaceFrameMap,
    setFrame: frameMapKit.setFrame,
    removeFrame: frameMapKit.removeFrame,
    useFrameKits: frameMapKit.useFrameKits,

    rowSideSize,
    columnSideSize,

    getGridAreaRect,
  };
}
