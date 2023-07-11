import {
  DynamicFrameset,
  DynamicFramesetOnFrameRequested,
  DynamicFramesetState,
} from "../../ui/dynamic-frame/DynamicFrameset";
import * as classes from "./WavePresentation.css";
import { useCallback, useMemo, useState } from "react";

const SomeComponent = ({ initialCount }: { initialCount: number }) => {
  const [count, setCount] = useState(initialCount);

  const handleClick = useCallback(() => {
    setCount((prevValue) => prevValue + 1);
  }, [setCount]);

  return (
    <button
      type="button"
      style={{
        fontSize: 16,
        color: "inherit",
        background: "none",
        blockSize: "100%",
        inlineSize: "100%",
      }}
      onClick={handleClick}
    >
      {count.toString(16)}
    </button>
  );
};

export function WavePresentation() {
  const handleFrameRequested = useCallback<DynamicFramesetOnFrameRequested>(
    (key) => {
      let initialCount = parseInt(key, 16);
      if (Number.isNaN(initialCount)) {
        initialCount = 0;
      }

      return () => <SomeComponent initialCount={initialCount} />;
    },
    []
  );

  const initialFramesetState = useMemo<DynamicFramesetState>(
    () => ({
      root: {
        direction: "row",
        entries: [
          {
            type: "stack",
            stack: {
              direction: "row",
              entries: [
                { type: "frame", frame: { key: "0", size: 100 } },
                { type: "frame", frame: { key: "1", size: 100 } },
                { type: "frame", frame: { key: "2", size: 100 } },
                {
                  type: "stack",
                  stack: {
                    direction: "column",
                    entries: [
                      { type: "frame", frame: { key: "3", size: 100 } },
                      { type: "frame", frame: { key: "4", size: 100 } },
                      { type: "frame", frame: { key: "5", size: 100 } },
                      { type: "frame", frame: { key: "6", size: 100 } },
                    ],
                  },
                },
                { type: "frame", frame: { key: "4", size: 100 } },
              ],
            },
          },
          {
            type: "stack",
            stack: {
              direction: "column",
              entries: [
                { type: "frame", frame: { key: "7", size: 100 } },
                { type: "frame", frame: { key: "8", size: 100 } },
                { type: "frame", frame: { key: "9", size: 100 } },
                { type: "frame", frame: { key: "A", size: 100 } },
                { type: "frame", frame: { key: "B", size: 100 } },
              ],
            },
          },
        ],
      },
    }),
    []
  );

  return (
    <div className={classes.root}>
      <DynamicFrameset
        minRowSize={10}
        minColumnSize={10}
        initialFramesetState={initialFramesetState}
        onFrameRequested={handleFrameRequested}
      ></DynamicFrameset>
    </div>
  );
}
