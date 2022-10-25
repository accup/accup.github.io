import { defineConfig } from "vite";
import emitDts from "@accup/vite-plugin-emit-dts";
import path from "node:path";

export default defineConfig(({ mode }) => ({
  plugins: [emitDts()],
  build: {
    outDir: "dist",
    emptyOutDir: mode !== "development",
    lib: {
      entry: path.resolve(__dirname, "./src/index.ts"),
      fileName: "it",
      name: "It",
    },
  },
}));
