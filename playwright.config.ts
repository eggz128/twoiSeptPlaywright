import { defineConfig, devices } from '@playwright/test';
import { TestOptions } from './tests/my-test';
export const STORAGE_STATE = 'user.json';
/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// import dotenv from 'dotenv';
// import path from 'path';
// dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig<TestOptions>({
  testDir: './tests',
  timeout: 30 * 1000, //Sets max test execution time 
  expect: {timeout: 7 * 1000}, //Default is 5s - now all expects have 7 seconds
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [
    ['html'],
    ['json', {outputFile: 'jsonresults/testresults.json'}]
  ],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: 'https://www.edgewordstraining.co.uk/',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on',
    //headless: false,
    actionTimeout: 20 * 1000,
    //launchOptions: {slowMo: 5000 }
  },

  /* Configure projects for major browsers */
  projects: [
        {
      name: 'setup',
      testMatch: /globalsetup\.ts/,
      teardown: 'teardown',
      timeout: 2 * 60 * 1000,
    },
    {
      name: 'teardown',
      testMatch: /globalteardown\.ts/,
      use: {
        storageState: STORAGE_STATE
      }
    },
    {
      name: 'chromium',
      
      //testMatch: /first.*\.spec\.ts/, //Chromium should only run tests where the file starts with "first"
      use: { ...devices['Desktop Chrome'],
        person: 'Bob',
        storageState: STORAGE_STATE
       },
       dependencies: ['setup']
    },

    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'],
        person: 'Sally',
        storageState: STORAGE_STATE
       },
       dependencies: ['setup']
    
    },

    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },

    /* Test against mobile viewports. */
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 7'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },

    /* Test against branded browsers. */
    {
      name: 'Microsoft Edge',
      use: { ...devices['Desktop Edge'], channel: 'msedge' },
    },
    {
      name: 'Google Chrome',
      use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    },
  ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://localhost:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});
