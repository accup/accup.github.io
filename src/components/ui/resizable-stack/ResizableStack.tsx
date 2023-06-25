import { useWritingModes } from "../../../hooks/logical-property/useWritingMode";
import * as classes from "../resizable-stack/ResizableStack.css";
import { ResizableStackBar, ResizeDetails } from "./ResizableStackBar";
import classNames from "classnames";
import {
  type ReactNode,
  Fragment,
  useState,
  useEffect,
  useMemo,
  useRef,
  useCallback,
} from "react";

type ResizableStackDirection = "row" | "column";

export type ResizableStackItem = {
  key: string;
  initialSize: number;
  children: ReactNode;
};

type ChildState = ResizableStackItem & {
  size: number;
  pendingSize: number;
  resizeBar?:
    | {
        onResizing: (details: ResizeDetails) => void;
        onResized: (details: ResizeDetails) => void;
      }
    | undefined;
};

export const ResizableStack = ({
  direction,
  children,
}: {
  direction: ResizableStackDirection;
  children: readonly ResizableStackItem[];
}) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const writingModes = useWritingModes(rootRef);

  const initialStateMap = useMemo(() => new Map(), []);
  const stateMapRef = useRef<Map<string, ChildState>>(initialStateMap);
  const [stateList, setStateList] = useState<ChildState[]>([]);

  const createInitialState = useCallback(
    (child: ResizableStackItem): ChildState => {
      return {
        ...child,
        size: child.initialSize,
        pendingSize: child.initialSize,
      };
    },
    []
  );

  const updateStateList = useCallback(() => {
    const stateMap = stateMapRef.current;

    setStateList(
      children
        .map((child) => stateMap.get(child.key))
        .filter((state): state is ChildState => state != null)
    );
  }, [children, stateMapRef]);

  const mutatePendingState = useCallback(
    (details: ResizeDetails, prevKey: string, nextKey: string) => {
      const stateMap = stateMapRef.current;
      const prevState = stateMap.get(prevKey);
      const nextState = stateMap.get(nextKey);

      let { lengthwiseShift } = details;

      if (prevState != null) {
        lengthwiseShift = Math.max(lengthwiseShift, -prevState.size);
      }
      if (nextState != null) {
        lengthwiseShift = Math.min(lengthwiseShift, nextState.size);
      }

      if (prevState != null) {
        prevState.pendingSize = prevState.size + lengthwiseShift;
      }
      if (nextState != null) {
        nextState.pendingSize = nextState.size - lengthwiseShift;
      }
    },
    [stateMapRef]
  );

  const handleResizing = useCallback(
    (details: ResizeDetails, prevKey: string, nextKey: string) => {
      mutatePendingState(details, prevKey, nextKey);
      updateStateList();
    },
    [stateMapRef, updateStateList, mutatePendingState]
  );

  const handleResized = useCallback(
    (details: ResizeDetails, prevKey: string, nextKey: string) => {
      mutatePendingState(details, prevKey, nextKey);

      const stateMap = stateMapRef.current;
      const prevState = stateMap.get(prevKey);
      const nextState = stateMap.get(nextKey);

      if (prevState != null) {
        prevState.size = prevState.pendingSize;
      }
      if (nextState != null) {
        nextState.size = nextState.pendingSize;
      }

      updateStateList();
    },
    [stateMapRef, updateStateList, mutatePendingState]
  );

  useEffect(() => {
    const prevStateMap = stateMapRef.current;

    stateMapRef.current = new Map(
      children.map<[string, ChildState]>((child, index, self) => {
        const prevChild = self[index - 1];

        return [
          child.key,
          {
            ...(prevStateMap.get(child.key) ?? createInitialState(child)),
            resizeBar:
              prevChild == null
                ? undefined
                : {
                    onResizing: (details) => {
                      handleResizing(details, prevChild.key, child.key);
                    },
                    onResized: (details) => {
                      handleResized(details, prevChild.key, child.key);
                    },
                  },
          },
        ];
      })
    );

    updateStateList();
  }, [children, stateMapRef, updateStateList, handleResizing, handleResized]);

  return (
    <div
      ref={rootRef}
      className={classNames(classes.root, {
        [classes.rootIs.row]: direction === "row",
        [classes.rootIs.column]: direction === "column",
      })}
    >
      {stateList?.map((child) => (
        <Fragment key={child.key}>
          {child.resizeBar != null && (
            <ResizableStackBar
              direction={direction}
              writingModes={writingModes}
              onResizing={child.resizeBar.onResizing}
              onResized={child.resizeBar.onResized}
            />
          )}
          <div
            className={classes.child}
            style={{
              blockSize: direction === "column" ? child.pendingSize : undefined,
              inlineSize: direction === "row" ? child.pendingSize : undefined,
            }}
          >
            {child.children}
          </div>
        </Fragment>
      ))}
    </div>
  );
};
