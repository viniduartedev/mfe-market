# Mercado MFE

Demonstração de e-commerce em micro-frontends: shell integrador, catálogo, carrinho e checkout independentes. Dados são mockados; o carrinho usa apenas `localStorage` e `CustomEvent` por meio de `@mercado/contracts`.

## Início rápido

```bash
pnpm install
cp apps/shell/.env.example apps/shell/.env
pnpm dev
```

Abra `http://localhost:3000`. As portas são shell 3000, catálogo 3001, carrinho 3002 e checkout 3003. Em terminais separados, também é possível rodar `pnpm --filter @mercado/mfe-catalog dev` (e os equivalentes cart/checkout/shell).

```bash
pnpm lint
pnpm test
pnpm build
```

Consulte [ARCHITECTURE.md](ARCHITECTURE.md), [CONTRACTS.md](CONTRACTS.md) e [DEPLOYMENT.md](DEPLOYMENT.md) para detalhes da integração, compatibilidade e publicação.
