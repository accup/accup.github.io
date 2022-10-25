import { type Plugin } from "vite";
import ts from "typescript";
import { Extractor, ExtractorConfig } from "@microsoft/api-extractor";
import fs from "node:fs";
import path from "node:path";

const declarationCompilerOptions: ts.CompilerOptions = {
  declaration: true,
};

export interface PluginOptions {
  /**
   * Options to override TypeScript configuration file
   */
  compilerOptions?: ts.CompilerOptions;
  /**
   * Name of bundled d.ts file
   *
   * @defaultValue `build.lib.fileName` if it is string, otherwise same name as `build.lib.entry`
   */
  name?: string;
  /**
   * Name of TypeScript configuration file
   *
   * @defaultValue `"tsconfig.json"`
   */
  configName?: string;
  /**
   * Temporary directory where this plugin generates individual d.ts files
   *
   * @defaultValue `".temp"`
   */
  temporaryDir?: string;
}

export default (pluginOptions: PluginOptions = null): Plugin => {
  let root: string;
  let out: string;
  let entry: string;
  let name: string;

  return {
    name: "vite-plugin-emit-dts",

    configResolved(config) {
      if (config.build.lib == false) {
        throw new Error(`Not in library mode.`);
      }

      root = config.root;
      out = config.build.outDir;
      entry = path.resolve(config.build.lib.entry);

      if (typeof config.build.lib.fileName === "string") {
        name = config.build.lib.fileName;
      } else {
        name = path.basename(entry, path.extname(entry));
      }
    },

    buildStart() {
      const currentDir = process.cwd();
      const rootDir = path.resolve(currentDir, root);
      const outputDir = path.resolve(currentDir, out);
      const tempDir = path.resolve(
        rootDir,
        pluginOptions?.temporaryDir ?? ".temp"
      );
      const tempTsDir = path.resolve(tempDir, "ts");
      const tempDtsDir = path.resolve(tempDir, "dts");

      const configFile = ts.findConfigFile(
        currentDir,
        ts.sys.fileExists,
        pluginOptions?.configName ?? "tsconfig.json"
      );
      if (configFile == undefined) {
        throw new Error("Valid TypeScript config file not found");
      }

      const { config } = ts.readConfigFile(configFile, ts.sys.readFile);
      const tscConfig = Object.assign({}, config, {
        compilerOptions: Object.assign(
          {},
          config.compilerOptions,
          declarationCompilerOptions,
          pluginOptions?.compilerOptions,
          {
            // Force to Vite configuration
            rootDir: rootDir,
            outDir: outputDir,
            declarationDir: tempTsDir,
          }
        ),
      });
      const { options, errors: configFileParsingDiagnostics } =
        ts.parseJsonConfigFileContent(tscConfig, ts.sys, currentDir);
      const rootNames = [entry];

      const host = ts.createCompilerHost(options);
      host.writeFile = (fileName: string, source: string) => {
        // Ensure to write files into `tempDir`
        fileName = path.relative(tempTsDir, path.resolve(out, fileName));
        const filePath = path.resolve(tempTsDir, fileName);
        fs.mkdirSync(path.dirname(filePath), { recursive: true });
        fs.writeFileSync(filePath, source);
      };
      const program = ts.createProgram({
        options,
        rootNames,
        host,
        configFileParsingDiagnostics,
      });
      program.emit(undefined, undefined, undefined, true, undefined);

      const entryTsFromRoot = path.relative(rootDir, entry);
      const entryDtsDir = path.dirname(entryTsFromRoot);
      const entryDtsName = `${path.basename(entry, path.extname(entry))}.d.ts`;
      const entryDtsFromTemp = path.join(entryDtsDir, entryDtsName);
      const mainEntryPointFilePath = path.resolve(tempTsDir, entryDtsFromTemp);
      const overrideTsconfig = Object.assign({}, config, {
        compilerOptions: Object.assign(
          {},
          config.compilerOptions,
          pluginOptions?.compilerOptions,
          {
            rootDir: tempTsDir,
            outDir: tempDtsDir,
          }
        ),
        includes: ["**/*.d.ts"],
      });
      const extractorConfig = ExtractorConfig.prepare({
        configObject: {
          projectFolder: currentDir,
          mainEntryPointFilePath,
          dtsRollup: {
            enabled: true,
            untrimmedFilePath: path.resolve(tempDtsDir, `${name}.d.ts`),
          },
          compiler: {
            overrideTsconfig,
          },
        },
        configObjectFullPath: undefined,
        packageJson: undefined,
        packageJsonFullPath: ts.findConfigFile(
          currentDir,
          ts.sys.fileExists,
          "package.json"
        ),
      });
      Extractor.invoke(extractorConfig, { localBuild: true });

      const source = fs.readFileSync(path.resolve(tempDtsDir, `${name}.d.ts`), {
        encoding: "utf-8",
      });
      this.emitFile({
        type: "asset",
        fileName: `${name}.d.ts`,
        source,
      });

      fs.rmSync(tempDir, { recursive: true, force: true });
    },
  };
};
