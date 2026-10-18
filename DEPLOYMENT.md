# Preparação para publicação independente na Vercel

Esta etapa não cria projetos, não exige autenticação e não executa deploy. Os quatro projetos usarão o mesmo repositório, cada qual com seu próprio Root Directory.

## Validação local obrigatória

```bash
pnpm install --frozen-lockfile
pnpm validate:vercel
```

O comando valida lint, TypeScript, testes, build, os três arquivos federados e os quatro `vercel.json`. O build atual confirmou estes artefatos:

- `apps/mfe-catalog/dist/remoteEntry.js`
- `apps/mfe-cart/dist/remoteEntry.js`
- `apps/mfe-checkout/dist/remoteEntry.js`

Consequentemente, as variáveis do shell usam `/remoteEntry.js` na raiz do domínio de cada remote.

## Configuração futura no painel

Quando estiver pronto para publicar, importe este repositório quatro vezes e configure:

| Projeto | Root Directory | Framework |
| --- | --- | --- |
| `mercado-shell` | `apps/shell` | Vite |
| `mercado-catalog` | `apps/mfe-catalog` | Vite |
| `mercado-cart` | `apps/mfe-cart` | Vite |
| `mercado-checkout` | `apps/mfe-checkout` | Vite |

Mantenha a instalação baseada em pnpm e o comando de build detectado pelo `package.json` de cada app. O campo `packageManager` e o lockfile na raiz fixam a versão esperada do pnpm; a raiz também declara Node `>=20.19.0`.

## Ordem de publicação futura

1. Publique os remotes primeiro: `mercado-catalog` (`apps/mfe-catalog`), `mercado-cart` (`apps/mfe-cart`) e `mercado-checkout` (`apps/mfe-checkout`). A configuração atual entrega `remoteEntry.js` na raiz do `dist`, portanto a URL é `https://<remote>.vercel.app/remoteEntry.js` (confirme no output do build ao atualizar o plugin).
2. Crie `mercado-shell` com Root Directory `apps/shell`.
3. Em Settings → Environment Variables do shell, defina `VITE_CATALOG_REMOTE_URL`, `VITE_CART_REMOTE_URL` e `VITE_CHECKOUT_REMOTE_URL` com a URL HTTPS final de cada `remoteEntry.js`.
4. Faça novo deploy do shell.

Defina as três variáveis para todos os ambientes que serão utilizados (Production, Preview e Development), usando URLs HTTPS públicas dos remotes. Em mudanças futuras de URL de remote, atualize as variáveis e faça novo deploy somente do shell.

Os `vercel.json` dos remotes adicionam CORS aos assets federados para que o shell em outro domínio possa importá-los. Não faça deploy antes de `pnpm validate:vercel` terminar com sucesso.
