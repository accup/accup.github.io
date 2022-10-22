import { defineConfig } from "vite";
import path from "node:path";
import typescript from "@rollup/plugin-typescript";

export default defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, "src/index.ts"),
      name: "It",
      fileName: "it",
    },
    rollupOptions: {
      plugins: [typescript()],
    },
  },
});
