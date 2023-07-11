import { style } from "@vanilla-extract/css";

import {
  colorSprinkles,
  fontSprinkles,
} from "../../../themes-astro/variants.astro.css";

export const root = style([
  {
    padding: 16,
  },
]);

export const fieldset = style([
  {
    padding: 16,
  },
  {
    display: "flex",
    flexFlow: "column",
    alignItems: "flex-start",
    gap: 16,
  },
  colorSprinkles({
    borderColor: "text-01",
  }),
  {
    borderWidth: 1,
    borderStyle: "solid",
  },
  {
    selectors: {
      "& + &": {
        marginBlockStart: 16,
      },
    },
  },
]);

export const code = style([
  {
    paddingInline: 4,
  },
  {
    borderRadius: 4,
  },
  colorSprinkles({
    color: "text-04",
    backgroundColor: "text-02",
  }),
  fontSprinkles({
    fontFamily: "sans",
  }),
]);

export const output = style([
  {
    marginInline: 4,
  },
  {
    paddingInline: 4,
  },
  colorSprinkles({
    borderBottomColor: "text-03",
  }),
  {
    borderBottomWidth: 1,
    borderBottomStyle: "solid",
  },
]);
