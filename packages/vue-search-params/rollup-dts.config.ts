import { defineDtsConfig } from "@accup/util-rollup";
import packageJson from "./package.json" assert { type: "json" };

export default defineDtsConfig(packageJson);
