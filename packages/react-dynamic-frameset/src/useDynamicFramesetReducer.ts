import { useMemo, useState } from "react";

import type {
  FrameComponentProps,
  FrameState,
  FramesetFlow,
  FramesetState,
} from "./types";

export function useDynamicFramesetReducer<
  TComponentProps extends FrameComponentProps
>(initializer?: (() => FramesetState<TComponentProps>) | undefined) {
  const [state, setState] = useState<FramesetState<TComponentProps>>(
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
      reset: (state: FramesetState<TComponentProps>) => {
        setState(state);
      },
      setFrameState: (
        id: string,
        frameState: FrameState<TComponentProps>["state"]
      ) => {
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
      changeFlow: (flow: FramesetFlow) => {
        setState((prevState) => ({ ...prevState, flow }));
      },
    }),
    [setState]
  );

  return [state, actions] as const;
}
