import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",

  fullyParallel: true,

  forbidOnly: false,

  retries: 0,

  reporter: "html",

  use: {
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: {
        launchOptions: {
          args: ["--start-maximized"],
        },
        viewport: null,
      },
    },
  ],
});
