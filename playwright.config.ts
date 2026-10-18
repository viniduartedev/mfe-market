import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  use: { baseURL: process.env.E2E_BASE_URL || 'http://localhost:3000', trace: 'retain-on-failure' },
  webServer: process.env.E2E_BASE_URL ? undefined : {
    command: 'pnpm dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    env: {
      VITE_CATALOG_REMOTE_URL: 'http://localhost:3001/remoteEntry.js',
      VITE_CART_REMOTE_URL: 'http://localhost:3002/remoteEntry.js',
      VITE_CHECKOUT_REMOTE_URL: 'http://localhost:3003/remoteEntry.js',
    },
  },
});
