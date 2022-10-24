import { type Plugin } from "vite";
import ts from "typescript";
import path from "node:path";

const declarationCompilerOptions: ts.CompilerOptions = {
  declaration: true,
};

export interface PluginOptions {
  compilerOptions?: ts.CompilerOptions;
  configName?: string;
}

export default (pluginOptions: PluginOptions = null): Plugin => {
  let outDir: string;

  return {
    name: "vite-plugin-emit-dts",

    configResolved(config) {
      outDir = path.resolve(config.build.outDir);
    },

    buildStart(inputOptions) {
      const currentDir = process.cwd();
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
          declarationDir: path.resolve(outDir, "types"),
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
          fileName = path.relative(outDir, fileName);
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
      program.emit(undefined, undefined, undefined, true, undefined);
    },
  };
};
