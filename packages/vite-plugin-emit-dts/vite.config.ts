import { defineConfig } from "vite";
import path from "node:path";
import emitDts from "./src/index";

export default defineConfig({
  plugins: [emitDts()],
  build: {
    outDir: "dist",
    lib: {
      entry: path.resolve(__dirname, "./src/index.ts"),
      fileName: "vite-plugin-emit-dts",
      name: "VitePluginEmitDts",
      formats: ["es", "cjs"],
    },
    rollupOptions: {
      external: ["vite", "typescript", "node:fs", "node:path"],
    },
  },
});
