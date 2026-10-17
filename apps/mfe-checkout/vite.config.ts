import { federation } from '@module-federation/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'checkout',
      filename: 'remoteEntry.js',
      exposes: { './CheckoutApp': './src/CheckoutApp.tsx' },
      shared: ['react', 'react-dom'],
    }),
  ],
  server: { port: 3003, strictPort: true },
  preview: { port: 3003, strictPort: true },
  build: { target: 'esnext' },
});
