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
  const [props, { setFrameGrid }] = useDynamicFrameset({
    initializer: () => ({
      flow: "block-start/inline-start",
      rowTracks: Array.from({ length: 9 }, () => ({ basis: 100, flex: 0 })),
      columnTracks: Array.from({ length: 9 }, () => ({
        basis: 100,
        flex: 0,
      })),
      frames: Array.from({ length: 14 }, (_, index) => ({
        id: index.toString(),
        props: {
          label: index.toString() + 4,
          onClick: () => {
            const row = Math.floor(Math.random() * 9);
            const column = Math.floor(Math.random() * 9);
            // HACK: illegal but available callback in React
            setFrameGrid(index.toString(), row, column, row + 1, column + 1);
          },
        },
        gridRowStart: index % 8,
        gridRowEnd: (index % 8) + 1,
        gridColumnStart: Math.floor(index / 8),
        gridColumnEnd: Math.floor(index / 8) + 1,
      })),
    }),
    FrameComponent: SomeComponent,
    FrameComponentStaticProps: {},
  });

  return (
    <div className={classes.root}>
      <DynamicFrameset {...props} classes={{ frame: classes.frame }} />
    </div>
  );
}
