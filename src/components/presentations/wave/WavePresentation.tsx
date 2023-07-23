import { ComponentProps, useCallback } from "react";

import { DynamicFrameset } from "../../ui/dynamic-frameset/DynamicFrameset";
import type { DynamicFramesetFlow } from "../../ui/dynamic-frameset/DynamicFrameset.types";
import { useDynamicFramesetReducer } from "../../ui/dynamic-frameset/useDynamicFramesetReducer";

import * as classes from "./WavePresentation.css";

function SomeComponent({
  flow,
  setFlow,
}: {
  flow: DynamicFramesetFlow;
  setFlow: (flow: DynamicFramesetFlow) => void;
}) {
  const handleClick = useCallback(() => {
    setFlow(flow);
  }, [flow, setFlow]);

  return (
    <button
      type="button"
      style={{
        fontSize: 16,
        color: "inherit",
        display: "block",
        background: "none",
        blockSize: "100%",
        inlineSize: "100%",
      }}
      onClick={handleClick}
    >
      {flow}
    </button>
  );
}

export function WavePresentation() {
  const [dynamicFramesetState, dispatchDynamicFramesetState] =
    useDynamicFramesetReducer<ComponentProps<typeof SomeComponent>>(() => ({
      flow: "block-start/inline-start",
      rows: [
        { basis: 70, flex: 0 },
        { basis: 80, flex: 0 },
        { basis: 90, flex: 0 },
        { basis: 100, flex: 0 },
        { basis: 110, flex: 0 },
        { basis: 120, flex: 0 },
        { basis: 130, flex: 0 },
        { basis: 140, flex: 0 },
      ],
      columns: [
        { basis: 100, flex: 0 },
        { basis: 200, flex: 0 },
        { basis: 300, flex: 0 },
      ],
      frames: (
        [
          "top/left",
          "top/right",
          "bottom/left",
          "bottom/right",
          "left/top",
          "left/bottom",
          "right/top",
          "right/bottom",
          "block-start/inline-start",
          "block-start/inline-end",
          "block-end/inline-start",
          "block-end/inline-end",
          "inline-start/block-start",
          "inline-start/block-end",
          "inline-end/block-start",
          "inline-end/block-end",
        ] satisfies readonly DynamicFramesetFlow[]
      ).map((flow, index) => ({
        id: flow,
        props: {
          flow,
          setFlow: (flow) =>
            dispatchDynamicFramesetState({ type: "change-flow", flow }),
        },
        gridRowStart: index % 8,
        gridRowEnd: (index % 8) + 1,
        gridColumnStart: Math.floor(index / 8),
        gridColumnEnd: Math.floor(index / 8) + 1,
      })),
    }));

  return (
    <div className={classes.root}>
      <DynamicFrameset
        state={dynamicFramesetState}
        FrameComponent={SomeComponent}
      />
    </div>
  );
}
