import { defineConfig } from "vite";
import path from "node:path";
import tsc from "./src/index";

export default defineConfig({
  plugins: [
    tsc({
      compilerOptions: {
        declarationDir: "dist/types",
      },
    }),
  ],
  build: {
    outDir: "dist",
    lib: {
      entry: path.resolve(__dirname, "./src/index.ts"),
      fileName: "vite-plugin-emit-dts",
      name: "VitePluginEmitDts",
      formats: ["es"],
    },
    rollupOptions: {
      external: ["vite", "typescript", "node:path"],
    },
  },
});
