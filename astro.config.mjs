// @ts-check
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://wsoltani.com",
  trailingSlash: "never",
  build: { format: "file", inlineStylesheets: "always" },
  // Pages load in the background when a link is pointed at, so moving between them is instant.
  prefetch: { prefetchAll: true, defaultStrategy: "hover" },
  integrations: [sitemap({ filter: (page) => !page.includes("/resume-print") })],
});
