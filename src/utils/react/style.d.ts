import type { CSSProperties } from "react";

export type Classes<Key> = {
  [K in Key]?: string | undefined;
};

export type Styles<Key> = {
  [K in Key]?: CSSProperties | undefined;
};
