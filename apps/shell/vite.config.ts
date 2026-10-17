import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { federation } from '@module-federation/vite';
export default defineConfig(({ mode }) => { const env = loadEnv(mode, process.cwd(), ''); return { plugins: [react(), federation({ name: 'mercado_shell', remotes: { catalog: { type: 'module', name: 'catalog', entry: env.VITE_CATALOG_REMOTE_URL }, cart: { type: 'module', name: 'cart', entry: env.VITE_CART_REMOTE_URL }, checkout: { type: 'module', name: 'checkout', entry: env.VITE_CHECKOUT_REMOTE_URL } }, shared: { react: { singleton: true, requiredVersion: '^18.3.1' }, 'react-dom': { singleton: true, requiredVersion: '^18.3.1' } } })], server: { port: 3000, strictPort: true }, build: { target: 'esnext' } }; });
