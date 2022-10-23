import { defineConfig } from "rollup";
import typescript from "@rollup/plugin-typescript";
import dts from "rollup-plugin-dts";

export interface Options {
  readonly main: string;
  readonly module: string;
  readonly types: string;
}

/** Generate bundled .js files */
export function defineJsConfig(options: Options, name: string) {
  return defineConfig({
    input: "./src/index.ts",
    output: [
      {
        file: options.module,
        format: "es",
      },
      {
        name: name,
        file: options.main,
        format: "umd",
      },
    ],
    plugins: [typescript()],
  });
}

/** Generate intermediate .d.ts (and .js) files. */
export function defineTsConfig() {
  return defineConfig({
    input: "./src/index.ts",
    output: [
      {
        dir: "dts",
        format: "esm",
      },
    ],
    plugins: [
      typescript({
        declaration: true,
        declarationDir: "dts",
        emitDeclarationOnly: true,
      }),
    ],
  });
}

/** Generate a bundled .d.ts file */
export function defineDtsConfig(options: Options) {
  return defineConfig({
    input: "./dts/index.d.ts",
    output: {
      file: options.types,
      format: "esm",
    },
    plugins: [
      dts({
        compilerOptions: {
          outDir: "dist",
        },
      }),
    ],
  });
}
