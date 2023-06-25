import { useLogicalConverter } from "../../../hooks/logical-property/useLogicalConverter";
import type { WritingModes } from "../../../hooks/logical-property/useWritingMode";
import * as classes from "../resizable-stack/ResizableStackBar.css";
import classNames from "classnames";
import { PointerEvent, memo, useCallback, useRef } from "react";

export type ResizableStackBarDirection = "row" | "column";

export type ResizeDetails = {
  lengthwiseShift: number;
  crosswiseShift: number;
};
type ResizingCallback = (details: ResizeDetails) => void;
type ResizedCallback = (details: ResizeDetails) => void;

export const ResizableStackBar = memo(
  ({
    direction,
    writingModes,
    onResizing,
    onResized,
  }: {
    direction: ResizableStackBarDirection;
    writingModes: WritingModes;
    onResizing?: ResizingCallback;
    onResized?: ResizedCallback;
  }) => {
    const logicalConvert = useLogicalConverter(writingModes);

    const getResizeDetails = useCallback(
      (record: {
        xStart: number;
        xEnd: number;
        yStart: number;
        yEnd: number;
      }): ResizeDetails => {
        const { xStart, xEnd, yStart, yEnd } = record;

        const { block, inline } = logicalConvert({
          x: { start: xStart, end: xEnd },
          y: { start: yStart, end: yEnd },
        });
        const { top, right, bottom, left } = logicalConvert({
          blockStart: block.start,
          blockEnd: block.end,
          inlineStart: inline.start,
          inlineEnd: inline.end,
        });
        const { block: blockShift, inline: inlineShift } = logicalConvert({
          x: right - left,
          y: bottom - top,
        });

        switch (direction) {
          case "row":
            return {
              lengthwiseShift: inlineShift,
              crosswiseShift: blockShift,
            };
          case "column":
            return {
              lengthwiseShift: blockShift,
              crosswiseShift: inlineShift,
            };
        }
      },
      [direction, logicalConvert]
    );

    const resizeStartStateRef = useRef<{
      pointerId: number;
      xStart: number;
      yStart: number;
    }>();

    const handleResizeStart = useCallback(
      (e: PointerEvent) => {
        if (!(e.target instanceof HTMLElement)) return;

        e.target.setPointerCapture(e.pointerId);

        resizeStartStateRef.current = {
          pointerId: e.pointerId,
          xStart: e.clientX,
          yStart: e.clientY,
        };

        const { xStart, yStart } = resizeStartStateRef.current;

        onResizing?.(
          getResizeDetails({
            xStart,
            xEnd: e.clientX,
            yStart,
            yEnd: e.clientY,
          })
        );
      },
      [resizeStartStateRef, onResizing, getResizeDetails]
    );

    const handleResize = useCallback(
      (e: PointerEvent) => {
        if (!(e.target instanceof HTMLElement)) return;
        if (resizeStartStateRef.current == null) return;

        const { pointerId, xStart, yStart } = resizeStartStateRef.current;

        if (e.pointerId !== pointerId) return;

        onResizing?.(
          getResizeDetails({
            xStart,
            xEnd: e.clientX,
            yStart,
            yEnd: e.clientY,
          })
        );
      },
      [resizeStartStateRef, onResizing, getResizeDetails]
    );

    const handleResizeEnd = useCallback(
      (e: PointerEvent) => {
        if (!(e.target instanceof HTMLElement)) return;
        if (resizeStartStateRef.current == null) return;

        const { pointerId, xStart, yStart } = resizeStartStateRef.current;
        if (e.pointerId !== pointerId) return;

        e.target.releasePointerCapture(pointerId);

        resizeStartStateRef.current = undefined;

        onResized?.(
          getResizeDetails({
            xStart,
            xEnd: e.clientX,
            yStart,
            yEnd: e.clientY,
          })
        );
      },
      [resizeStartStateRef, onResizing, getResizeDetails]
    );

    return (
      <div
        className={classNames(classes.root, {
          [classes.rootIs.row]: direction === "row",
          [classes.rootIs.column]: direction === "column",
        })}
        onPointerDown={handleResizeStart}
        onPointerMove={handleResize}
        onPointerCancel={handleResizeEnd}
        onPointerUp={handleResizeEnd}
      />
    );
  }
);
