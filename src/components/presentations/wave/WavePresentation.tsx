import { DynamicFrameset, useDynamicFrameset } from "../../ui/dynamic-frameset";

import * as classes from "./WavePresentation.css";

interface SomeComponentProps {
  readonly label: string;
  onClick?(this: void): void;
}

function SomeComponent(props: SomeComponentProps) {
  const { label, onClick } = props;

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
      onClick={onClick}
    >
      {label}
    </button>
  );
}

export function WavePresentation() {
  const frameset = useDynamicFrameset({
    origin: {
      initialize: () => "block-start/inline-start",
    },
    rowTracks: {
      initialize: () =>
        Array.from({ length: 9 }, () => ({ basis: 100, flex: 0 })),
    },
    columnTracks: {
      initialize: () =>
        Array.from({ length: 9 }, () => ({
          basis: 100,
          flex: 0,
        })),
    },
    frames: {
      initialize: () =>
        Array.from({ length: 14 }, (_, index) => ({
          id: index.toString(),
          gridArea: {
            gridRowStart: index % 8,
            gridRowEnd: (index % 8) + 1,
            gridColumnStart: Math.floor(index / 8),
            gridColumnEnd: Math.floor(index / 8) + 1,
          },
          constraints: {},
        })),
    },
  });

  return (
    <div className={classes.root}>
      <DynamicFrameset {...frameset} classes={{ frame: classes.frame }} />
    </div>
  );
}
