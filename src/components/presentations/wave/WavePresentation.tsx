import {
  ResizableStack,
  ResizableStackItem,
} from "../../ui/resizable-stack/ResizableStack";
import * as classes from "./WavePresentation.css";
import { useCallback, useEffect, useState } from "react";

export function WavePresentation() {
  const [children, setChildren] = useState<readonly ResizableStackItem[]>([]);

  const resortChildren = useCallback(
    (...order: readonly string[]) => {
      setChildren((prev) =>
        order
          .map((key) => prev.find((child) => child.key === key))
          .filter((child): child is NonNullable<typeof child> => child != null)
      );
    },
    [setChildren]
  );

  useEffect(() => {
    setChildren([
      {
        key: "0",
        initialSize: 150,
        children: (
          <button
            type="button"
            onClick={() => resortChildren("1", "4", "2", "3", "0")}
          >
            1 - 4 - 2 - 3 - 0
          </button>
        ),
      },
      {
        key: "1",
        initialSize: 150,
        children: (
          <button
            type="button"
            onClick={() => resortChildren("0", "1", "2", "3", "4")}
          >
            0 - 1 - 2 - 3 - 4
          </button>
        ),
      },
      {
        key: "2",
        initialSize: 150,
        children: (
          <button
            type="button"
            onClick={() => resortChildren("0", "3", "4", "1", "2")}
          >
            0 - 3 - 4 - 1 - 2
          </button>
        ),
      },
      {
        key: "3",
        initialSize: 150,
        children: <span>3</span>,
      },
      {
        key: "4",
        initialSize: 150,
        children: <span>4</span>,
      },
    ]);
  }, [setChildren, resortChildren]);

  return (
    <div className={classes.root}>
      <ResizableStack direction="column">{children}</ResizableStack>
    </div>
  );
}
