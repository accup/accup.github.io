import { defineConfig } from "vite";
import path from "node:path";
import ts from "typescript";

const tsOptions: ts.CompilerOptions = {
  target: ts.ScriptTarget.ESNext,
  module: ts.ModuleKind.ESNext,
  moduleResolution: ts.ModuleResolutionKind.NodeJs,
  strict: true,
  jsx: ts.JsxEmit.Preserve,
  resolveJsonModule: true,
  isolatedModules: true,
  esModuleInterop: true,
  lib: ["ESNext", "DOM"],
  strictNullChecks: true,
  declaration: true,
  declarationDir: "types",
  preserveValueImports: true,
  preserveWatchOutput: true,
};

export default defineConfig({
  plugins: [
    {
      name: "tsc",
      buildStart(options) {
        const host = ts.createCompilerHost(tsOptions);
        host.writeFile = (fileName: string, source: string) => {
          this.emitFile({
            type: "asset",
            fileName,
            source,
          });
        };
        const inputFileNames = Array.isArray(options.input)
          ? options.input.map((entry) => entry)
          : Object.entries(options.input).map(([, fileName]) => fileName);
        const program = ts.createProgram(inputFileNames, tsOptions, host);
        program.emit(undefined, undefined, undefined, true, undefined);
      },
    },
  ],
  build: {
    outDir: "dist",
    lib: {
      entry: path.resolve(__dirname, "./src/index.ts"),
      fileName: "vue-search-params",
      name: "VueSearchParams",
      formats: ["es", "umd"],
    },
  },
});
