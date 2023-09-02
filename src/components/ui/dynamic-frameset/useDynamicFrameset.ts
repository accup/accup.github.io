import { useState, type ComponentType, useMemo } from "react";
import type { DynamicFramesetProps } from "./DynamicFrameset";
import type { DynamicFramesetState } from ".";
import type {
  DynamicFramesetFlow,
  DynamicFramesetFrameState,
} from "./DynamicFrameset.types";

export interface UseDynamicFramesetProps<
  FrameProps,
  StaticProps extends Partial<FrameProps>,
  FramesetState = DynamicFramesetState<FrameProps, StaticProps>,
> {
  initializer?: ((this: void) => FramesetState) | undefined;
  FrameComponent: ComponentType<FrameProps>;
  FrameComponentStaticProps: StaticProps;
}

export interface DynamicFramesetActions<
  FrameProps,
  StaticProps extends Partial<FrameProps>,
  FramesetState = DynamicFramesetState<FrameProps, StaticProps>,
  DynamicProps = DynamicFramesetFrameState<FrameProps, StaticProps>["props"],
> {
  reset(this: void, state: FramesetState): void;

  setFrameGrid(
    this: void,
    id: string,
    gridRowStart: number,
    gridColumnStart: number,
    gridRowEnd: number,
    gridColumnEnd: number,
  ): void;

  setFrameProps(this: void, id: string, props: DynamicProps): void;

  changeFlow(this: void, flow: DynamicFramesetFlow): void;
}

export function useDynamicFrameset<
  FrameProps,
  StaticProps extends Partial<FrameProps>,
>(
  props: UseDynamicFramesetProps<FrameProps, StaticProps>,
): [
  DynamicFramesetProps<FrameProps, StaticProps>,
  DynamicFramesetActions<FrameProps, StaticProps>,
] {
  type FramesetState = DynamicFramesetState<FrameProps, StaticProps>;
  type DynamicProps = DynamicFramesetFrameState<
    FrameProps,
    StaticProps
  >["props"];

  const { initializer, FrameComponent, FrameComponentStaticProps } = props;

  const [state, setState] = useState<FramesetState>(
    () =>
      initializer?.() ?? {
        flow: "block-start/inline-start",
        rowTracks: [],
        columnTracks: [],
        frames: [],
      },
  );

  const use = useMemo<DynamicFramesetActions<FrameProps, StaticProps>>(
    () => ({
      reset: (state: FramesetState) => {
        setState(state);
      },

      setFrameGrid: (
        id: string,
        gridRowStart: number,
        gridColumnStart: number,
        gridRowEnd: number,
        gridColumnEnd: number,
      ) => {
        setState((prevState) => ({
          ...prevState,
          frames: prevState.frames.map((frame) => {
            if (frame.id === id) {
              return {
                ...frame,
                gridRowStart,
                gridRowEnd,
                gridColumnStart,
                gridColumnEnd,
              };
            } else {
              return frame;
            }
          }),
        }));
      },

      setFrameProps: (id: string, props: DynamicProps) => {
        setState((prevState) => ({
          ...prevState,
          frames: prevState.frames.map((frame) => {
            if (frame.id === id) {
              return {
                ...frame,
                props,
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
    [setState],
  );

  return [
    {
      state,
      FrameComponent,
      FrameComponentStaticProps,
    },
    use,
  ];
}
