import { defineJsConfig } from "@accup/util-rollup";
import packageJson from "./package.json" assert { type: "json" };

const NAME = "VueSearchParams";

export default defineJsConfig(packageJson, NAME);
