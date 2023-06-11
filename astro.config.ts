import vue from "@astrojs/vue";
import { vanillaExtractPlugin } from "@vanilla-extract/vite-plugin";
import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
  output: "static",
  integrations: [vue()],
  vite: {
    plugins: [vanillaExtractPlugin()],
  },
});
