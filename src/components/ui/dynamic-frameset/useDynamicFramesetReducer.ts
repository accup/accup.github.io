import { useMemo, useState } from "react";

import type {
  DynamicFramesetFlow,
  DynamicFramesetFrameComponentProps,
  DynamicFramesetFrameState,
  DynamicFramesetLineState,
  DynamicFramesetState,
} from "./DynamicFrameset.types";

export function useDynamicFramesetReducer<
  TComponentProps extends DynamicFramesetFrameComponentProps
>(initializer?: (() => DynamicFramesetState<TComponentProps>) | undefined) {
  type State = DynamicFramesetState<TComponentProps>;
  type FrameState = DynamicFramesetFrameState<TComponentProps>["state"];

  const [state, setState] = useState<State>(
    () =>
      initializer?.() ?? {
        flow: "block-start/inline-start",
        rows: [],
        columns: [],
        frames: [],
      }
  );

  const actions = useMemo(
    () => ({
      reset: (state: State) => {
        setState(state);
      },
      setFrameGrid: (
        id: string,
        rowStart: number,
        columnStart: number,
        rowEnd: number,
        columnEnd: number
      ) => {
        setState((prevState) => ({
          ...prevState,
          frames: prevState.frames.map((frame) => {
            if (frame.id === id) {
              return {
                ...frame,
                gridRowStart: rowStart,
                gridRowEnd: rowEnd,
                gridColumnStart: columnStart,
                gridColumnEnd: columnEnd,
              };
            } else {
              return frame;
            }
          }),
        }));
      },
      setFrameState: (id: string, frameState: FrameState) => {
        setState((prevState) => ({
          ...prevState,
          frames: prevState.frames.map((frame) => {
            if (frame.id === id) {
              return {
                ...frame,
                state: frameState,
              };
            } else {
              return frame;
            }
          }),
        }));
      },
      changeFlow: (flow: DynamicFramesetFlow) => {
        setState((prevState) => ({ ...prevState, flow }));
      },
    }),
    [setState]
  );

  return [state, actions] as const;
}

function spreadFlex(
  lines: readonly DynamicFramesetLineState[],
  fullSize: number
): readonly DynamicFramesetLineState[] {
  const mutatedLines = lines.map((line) => ({ ...line }));

  let unfixedLines = mutatedLines;
  let unfixedFullSize = fullSize;

  const maxTrials = unfixedLines.length;

  for (let trial = 0; trial < maxTrials; ++trial) {
    if (unfixedLines.length <= 0) break;

    const fullBasis = unfixedLines.reduce(
      (subtotal, { basis }) => subtotal + basis,
      0
    );

    const fullFlex = unfixedFullSize - fullBasis;

    const remainingUnfixedLines = unfixedLines.filter((line, index) => {
      const lower = Math.floor((fullFlex * index) / unfixedLines.length);
      const upper = Math.floor((fullFlex * (index + 1)) / unfixedLines.length);

      let isFixed = false;

      const preferredFlex = upper - lower;
      let flex = preferredFlex;

      const minFlex = line.minSize - line.size;
      if (flex < minFlex) {
        flex = minFlex;
        isFixed = true;
      }

      if (line.maxSize != null) {
        const maxExtraSize = line.maxSize - line.size;
        if (flex > maxExtraSize) {
          flex = maxExtraSize;
          isFixed = true;
        }
      }

      line.flex = flex;

      if (isFixed) {
        unfixedFullSize -= line.basis + flex;
      }

      return !isFixed;
    });

    if (remainingUnfixedLines.length === unfixedLines.length) break;

    unfixedLines = remainingUnfixedLines;
  }

  return mutatedLines;
}
