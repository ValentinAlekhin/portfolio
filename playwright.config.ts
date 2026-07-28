import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  expect: {
    timeout: 15000,
  },
  fullyParallel: false,
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  testDir: './tests/e2e',
  testMatch: '**/*.e2e.ts',
  use: {
    baseURL: 'http://127.0.0.1:3000',
    trace: 'retain-on-failure',
  },
  workers: 1,
  webServer: {
    command: 'pnpm dev --host 127.0.0.1',
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
    url: 'http://127.0.0.1:3000/card/',
  },
})
