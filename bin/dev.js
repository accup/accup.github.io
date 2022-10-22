import concurrently from "concurrently";
import path from "path";
import { fileURLToPath } from "url";
import fsPromises from "fs/promises";

const REL_PATH_PACKAGES = "./packages";

const PATH_BIN = path.dirname(fileURLToPath(import.meta.url));
const PATH_ROOT = path.dirname(PATH_BIN);
const PATH_PACKAGES = path.resolve(PATH_ROOT, REL_PATH_PACKAGES);

const namesPackage = (
  await fsPromises.readdir(PATH_PACKAGES, { withFileTypes: true })
)
  .filter((dirent) => dirent.isDirectory())
  .map((dirent) => dirent.name);

concurrently([
  {
    command: `npm run dev:self`,
    name: "dev",
  },
  ...namesPackage.map((name) => ({
    command: `npm run dev -w ${REL_PATH_PACKAGES}/${name} --if-present`,
    name: `dev:${path.basename(name)}`,
  })),
]);
