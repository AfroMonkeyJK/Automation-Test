/* eslint-disable no-undef */
/* eslint-env node */
// @ts-check
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './features',
  /* Run tests in files in parallel */
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 4 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: 'html',

  /* Shared settings for all the projects below */
  use: {
    /* Collect trace when retrying the failed test */
    trace: 'on-first-retry',
    video: {
      mode: 'retain-on-failure', // ✅ Only keep videos of failed tests
      size: { width: 1280, height: 720 }
    },
    screenshot: {
      mode: 'only-on-failure', // ✅ Only screenshot failed tests
      fullPage: true
    },

    /* ⏱️ Set reasonable timeouts */
    actionTimeout: 30000, // 30s for actions
    navigationTimeout: 60000 // 60s for page loads
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chrome',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1280, height: 720 },

        /* Chrome-specific optimizations */
        launchOptions: {
          args: [
            '--disable-dev-shm-usage', // Prevent memory issues in CI
            '--no-sandbox' // Required for CI environments
          ]
        }
      }
    },

    {
      name: 'safari',
      use: {
        ...devices['Desktop Safari'],
        viewport: { width: 1280, height: 720 }
      }
    }
  ],

  /* 🧹 CLEANUP: Define output directories */
  outputDir: 'test-results/',

  /* 📊 Configure HTML reporter */
  reportSlowTests: {
    max: 5,
    threshold: 60000 // Tests slower than 1min are reported
  }
});
