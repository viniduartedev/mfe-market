# Deploy independente na Vercel

Os quatro projetos são independentes e usam o mesmo repositório. Antes de publicar, execute `pnpm install && pnpm build` localmente.

1. Publique os remotes primeiro: `mercado-catalog` (`apps/mfe-catalog`), `mercado-cart` (`apps/mfe-cart`) e `mercado-checkout` (`apps/mfe-checkout`). A configuração atual entrega `remoteEntry.js` na raiz do `dist`, portanto a URL é `https://<remote>.vercel.app/remoteEntry.js` (confirme no output do build ao atualizar o plugin).
2. Crie `mercado-shell` com Root Directory `apps/shell`.
3. Em Settings → Environment Variables do shell, defina `VITE_CATALOG_REMOTE_URL`, `VITE_CART_REMOTE_URL` e `VITE_CHECKOUT_REMOTE_URL` com a URL HTTPS final de cada `remoteEntry.js`.
4. Faça novo deploy do shell.

Pelo painel: importe o mesmo repositório quatro vezes, configure a Root Directory indicada e aceite os comandos detectados (`pnpm install`, `pnpm build`). Pelo CLI, confirme antes que está autenticado com `vercel whoami`; então, dentro de cada diretório de app, use `vercel` e siga o assistente. Não execute deploy se `whoami` falhar ou se o build local falhar.

Os `vercel.json` dos remotes adicionam CORS aos assets federados para que o shell em outro domínio possa importá-los.
