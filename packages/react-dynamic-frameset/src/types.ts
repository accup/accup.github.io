export interface FrameComponentProps<TState = unknown> {
  readonly state: TState;
}

export type FramesetFlow =
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

export interface FramesetState<TComponentProps extends FrameComponentProps> {
  /**
   * flow
   */
  readonly flow: FramesetFlow;
  /**
   * row lines
   */
  readonly rows: readonly LineState[];
  /**
   * column lines
   */
  readonly columns: readonly LineState[];
  /**
   * frames
   */
  readonly frames: readonly FrameState<TComponentProps>[];
}

export interface LineState {
  /**
   * determined space
   */
  readonly basis: number;
  /**
   * undetermined space
   */
  readonly flex: number;
}

export interface FrameState<TComponentProps extends FrameComponentProps> {
  /**
   * frame identifier
   */
  readonly id: string;
  /**
   * frame state
   */
  readonly state: TComponentProps["state"];
  /**
   * first row line number
   */
  readonly gridRowStart: number;
  /**
   * last row line number
   */
  readonly gridRowEnd: number;
  /**
   * first column line number
   */
  readonly gridColumnStart: number;
  /**
   * last column line number
   */
  readonly gridColumnEnd: number;
  /**
   * lower bound constraint of the row space
   */
  readonly minRowSize?: number | undefined;
  /**
   * upper bound constraint of the row space
   */
  readonly maxRowSize?: number | undefined;
  /**
   * lower bound constraint of the column space
   */
  readonly minColumnSize?: number | undefined;
  /**
   * upper bound constraint of the column space
   */
  readonly maxColumnSize?: number | undefined;
}

export interface FramesetGrid {
  getFullSize(this: void): {
    fullRowSize: number;
    fullColumnSize: number;
  };

  getAreaRect(
    this: void,
    gridArea: {
      readonly rowStart: number;
      readonly rowEnd: number;
      readonly columnStart: number;
      readonly columnEnd: number;
    }
  ): {
    rowSize: number;
    columnSize: number;
    insetRowStart: number;
    insetRowEnd: number;
    insetColumnStart: number;
    insetColumnEnd: number;
  };
}
