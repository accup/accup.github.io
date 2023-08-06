import { useMemo, useState } from "react";

import type {
  DynamicFramesetFlow,
  DynamicFramesetFrameComponentProps,
  DynamicFramesetFrameState,
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
