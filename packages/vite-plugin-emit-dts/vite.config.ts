import { defineConfig } from "vite";
import path from "node:path";
import emitDts from "./src/index";

export default defineConfig(({ command }) => ({
  plugins: [emitDts()],
  build: {
    outDir: "dist",
    emptyOutDir: command === "build",
    lib: {
      entry: path.resolve(__dirname, "./src/index.ts"),
      fileName: "vite-plugin-emit-dts",
      name: "VitePluginEmitDts",
      formats: ["es", "cjs"],
    },
    rollupOptions: {
      external: [
        "vite",
        "typescript",
        "@microsoft/api-extractor",
        "node:fs",
        "node:path",
      ],
    },
  },
}));
