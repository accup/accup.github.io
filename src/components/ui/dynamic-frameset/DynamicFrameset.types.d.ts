/**
 * The starting point of a DynamicFrameset flow.
 */
export type DynamicFramesetOrigin =
  | "top/left"
  | "top/right"
  | "bottom/left"
  | "bottom/right"
  | "left/top"
  | "left/bottom"
  | "right/top"
  | "right/bottom"
  | "block-start/inline-start"
  | "block-start/inline-end"
  | "block-end/inline-start"
  | "block-end/inline-end"
  | "inline-start/block-start"
  | "inline-start/block-end"
  | "inline-end/block-start"
  | "inline-end/block-end";

/**
 * Frame identifier
 */
export type DynamicFramesetFrameId = string;

/**
 * State of the entire DynamicFrameset
 */
export interface DynamicFramesetState {
  /**
   * Starting point of the DynamicFrameset flow.
   */
  readonly origin: DynamicFramesetOrigin;
  /**
   * Row tracks
   */
  readonly rowTracks: readonly DynamicFramesetTrackState[];
  /**
   * Column tracks
   */
  readonly columnTracks: readonly DynamicFramesetTrackState[];
  /**
   * Frames
   */
  readonly frames: readonly DynamicFramesetFrameState[];
}

/**
 * Mapping of frame properties
 */
export type DynamicFramesetFramePropertyMap<TFrameComponentProps> = ReadonlyMap<
  DynamicFramesetFrameId,
  TFrameComponentProps
>;
