import { defineConfig, devices } from '@playwright/test';

const isCI = !!process.env['CI'];

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 2 : 0,
  workers: isCI ? 1 : undefined,
  reporter: isCI ? [['list'], ['html', { open: 'never' }]] : 'html',
  use: {
    baseURL: 'http://127.0.0.1:4200',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    // Keep CI server memory usage bounded to avoid OOM kills on shared runners.
    command: isCI
      ? 'NODE_OPTIONS=--max-old-space-size=1536 npx ng serve --host 127.0.0.1 --port 4200 --watch=false --live-reload=false --no-hmr'
      : 'npm start',
    url: 'http://127.0.0.1:4200',
    reuseExistingServer: !isCI,
    timeout: 120 * 1000,
  },
});
