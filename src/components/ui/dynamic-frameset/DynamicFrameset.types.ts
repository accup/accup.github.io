/**
 * Frameset flow
 */
export type DynamicFramesetFlow =
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

type ComponentDynamicProps<
  TComponentProps,
  TComponentStaticProps extends Partial<TComponentProps>,
> = {
  [K in Exclude<
    keyof TComponentProps,
    keyof TComponentStaticProps
  >]: TComponentProps[K];
} & {
  [K in keyof TComponentProps &
    keyof TComponentStaticProps]?: TComponentProps[K];
};

/**
 * State of the entire DynamicFrameset
 */
export interface DynamicFramesetState<
  TFrameComponentProps,
  TFrameComponentStaticProps extends Partial<TFrameComponentProps>,
> {
  /**
   * Frameset flow
   */
  readonly flow: DynamicFramesetFlow;
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
  readonly frames: readonly DynamicFramesetFrameState<
    TFrameComponentProps,
    TFrameComponentStaticProps
  >[];
}

/**
 * Track state
 */
export interface DynamicFramesetTrackState {
  /**
   * Determined size
   */
  readonly basis: number;
  /**
   * Undetermined size
   */
  readonly flex: number;
}

/**
 * Frame state
 */
export interface DynamicFramesetFrameState<
  TFrameComponentProps,
  TFrameComponentStaticProps extends Partial<TFrameComponentProps>,
> {
  /**
   * Frame identifier
   */
  readonly id: string;
  /**
   * Dynamic properties of the frame component
   */
  readonly props: ComponentDynamicProps<
    TFrameComponentProps,
    TFrameComponentStaticProps
  >;
  /**
   * First row grid line
   */
  readonly gridRowStart: number;
  /**
   * Last row grid line
   */
  readonly gridRowEnd: number;
  /**
   * First column grid line
   */
  readonly gridColumnStart: number;
  /**
   * Last column grid line
   */
  readonly gridColumnEnd: number;
  /**
   * Inclusive lower limit of the row-side frame size
   */
  readonly minRowSize?: number | undefined;
  /**
   * Inclusive upper limit of the row-side frame size
   */
  readonly maxRowSize?: number | undefined;
  /**
   * Inclusive lower limit of the column-side frame size
   */
  readonly minColumnSize?: number | undefined;
  /**
   * Inclusive upper limit of the column-side frame size
   */
  readonly maxColumnSize?: number | undefined;
}

/**
 * Grid operations for DynamicFrameset
 */
export interface DynamicFramesetGrid {
  /**
   * Get the properties related to the total size of the grid tracks.
   */
  getTotalSizes(this: void): {
    /**
     * Total size of all row tracks.
     */
    totalRowSize: number;
    /**
     * Total size of all column tracks.
     */
    totalColumnSize: number;
  };

  /**
   * Get the properties related to the size and position of a single grid track.
   */
  getAreaRect(
    this: void,
    gridArea: {
      readonly gridRowStart: number;
      readonly gridRowEnd: number;
      readonly gridColumnStart: number;
      readonly gridColumnEnd: number;
    },
  ): {
    rowSize: number;
    columnSize: number;
    insetRowStart: number;
    insetRowEnd: number;
    insetColumnStart: number;
    insetColumnEnd: number;
  };
}
