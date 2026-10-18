import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = process.cwd();
const remotes = ['mfe-catalog', 'mfe-cart', 'mfe-checkout'];
const apps = ['shell', ...remotes];
let failures = 0;

function fail(message) {
  failures += 1;
  console.error(`✗ ${message}`);
}

function pass(message) {
  console.log(`✓ ${message}`);
}

for (const app of apps) {
  const configPath = resolve(root, 'apps', app, 'vercel.json');
  if (!existsSync(configPath)) {
    fail(`apps/${app}/vercel.json não encontrado`);
    continue;
  }
  try {
    const config = JSON.parse(readFileSync(configPath, 'utf8'));
    if (!Array.isArray(config.headers)) fail(`apps/${app}/vercel.json deve definir headers`);
    else pass(`apps/${app}/vercel.json é JSON válido e possui headers`);
  } catch {
    fail(`apps/${app}/vercel.json não é JSON válido`);
  }
}

for (const remote of remotes) {
  const entry = resolve(root, 'apps', remote, 'dist', 'remoteEntry.js');
  if (existsSync(entry)) pass(`apps/${remote}/dist/remoteEntry.js gerado`);
  else fail(`apps/${remote}/dist/remoteEntry.js não encontrado após build`);
}

const shellEnv = resolve(root, 'apps/shell/.env.example');
const expectedEntries = remotes.map((remote) => `http://localhost:${({ 'mfe-catalog': 3001, 'mfe-cart': 3002, 'mfe-checkout': 3003 })[remote]}/remoteEntry.js`);
if (!existsSync(shellEnv)) fail('apps/shell/.env.example não encontrado');
else {
  const contents = readFileSync(shellEnv, 'utf8');
  for (const entry of expectedEntries) {
    if (contents.includes(entry)) pass(`URL local configurada: ${entry}`);
    else fail(`URL ausente em apps/shell/.env.example: ${entry}`);
  }
}

if (failures) process.exitCode = 1;
else console.log('\nPreparação para Vercel validada: builds, entries federados, variáveis e configurações estão prontos. Nenhum deploy foi executado.');
