import { defineConfig } from "vite";
import path from "node:path";
import typescript from "@rollup/plugin-typescript";

export default defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, "src/index.ts"),
      name: "VueSearchParams",
      fileName: "vue-search-params",
    },
    rollupOptions: {
      plugins: [typescript()],
    },
  },
});
