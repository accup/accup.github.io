import { defineConfig } from "vite";
import emitDts from "@accup/vite-plugin-emit-dts";
import path from "node:path";

export default defineConfig({
  plugins: [emitDts()],
  build: {
    outDir: "dist",
    lib: {
      entry: path.resolve(__dirname, "./src/index.ts"),
      fileName: "it",
      name: "It",
    },
  },
});
