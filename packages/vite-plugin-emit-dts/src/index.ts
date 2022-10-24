import { type Plugin } from "vite";
import ts from "typescript";
import fs from "node:fs";
import path from "node:path";

const declarationCompilerOptions: ts.CompilerOptions = {
  declaration: true,
};

function emptyDir(dir: string | null | undefined) {
  if (dir == null) return;
  if (!fs.existsSync(dir)) return;

  for (const file of fs.readdirSync(dir)) {
    fs.rmSync(path.resolve(dir, file), { recursive: true, force: true });
  }
}

export interface PluginOptions {
  compilerOptions?: ts.CompilerOptions;
  configName?: string;
  emptyOutDirWhenOnlyBuild?: boolean;
}

export default (pluginOptions: PluginOptions = null): Plugin => {
  let outDir: string;

  return {
    name: "vite-plugin-emit-dts",

    config(config, { command }) {
      const emptyOutDirWhenOnlyBuild = pluginOptions?.emptyOutDirWhenOnlyBuild;
      if (emptyOutDirWhenOnlyBuild == null || emptyOutDirWhenOnlyBuild) {
        config.build = Object.assign({}, config.build, {
          emptyOutDir: command === "build",
        });
      }
    },

    configResolved(config) {
      outDir = config.build.outDir;
    },

    buildStart(inputOptions) {
      const currentDir = process.cwd();
      const outputDir = path.resolve(currentDir, outDir);

      const configFile = ts.findConfigFile(
        currentDir,
        ts.sys.fileExists,
        pluginOptions?.configName ?? "tsconfig.json"
      );
      if (configFile == undefined) {
        throw new Error("Valid TypeScript config file not found");
      }

      const { config } = ts.readConfigFile(configFile, ts.sys.readFile);
      config.compilerOptions = Object.assign(
        {},
        config.compilerOptions,
        declarationCompilerOptions,
        {
          declarationDir: path.resolve(outputDir, "types"),
        },
        pluginOptions?.compilerOptions
      );
      const { options, errors: configFileParsingDiagnostics } =
        ts.parseJsonConfigFileContent(config, ts.sys, currentDir);
      const rootNames = Array.isArray(inputOptions.input)
        ? inputOptions.input.map((entry) => entry)
        : Object.entries(inputOptions.input).map(([, fileName]) => fileName);
      const host = ts.createCompilerHost(options);
      host.writeFile = (fileName: string, source: string) => {
        if (path.isAbsolute(fileName)) {
          fileName = path.relative(outputDir, fileName);
        }

        this.emitFile({
          type: "asset",
          fileName,
          source,
        });
      };
      const program = ts.createProgram({
        options,
        rootNames,
        host,
        configFileParsingDiagnostics,
      });

      emptyDir(options.declarationDir);
      program.emit(undefined, undefined, undefined, true, undefined);
    },
  };
};
