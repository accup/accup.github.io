import { createTheme } from "@vanilla-extract/css";
import { fonts } from "./variants.css";

export const [appTheme, appVars] = createTheme({
  color: {
    background: "#000000",
  },
  font: {
    default: fonts.NotoSansJP.regular,
  },
});
