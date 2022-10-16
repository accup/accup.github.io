import { globalStyle } from "@vanilla-extract/css";
import { appVars } from "./styles/theme.css";

globalStyle("html, body", {
  margin: 0,
  padding: 0,
});

globalStyle(":root", {
  backgroundColor: appVars.color.background,
  fontFamily: appVars.font.default,
});
