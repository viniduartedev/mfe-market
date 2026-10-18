# Diagnóstico do botão de checkout

Reprodução local em Chromium via Playwright, com shell em 3000 e remotes em 3001–3003.

Antes da correção, o teste adicionou um produto, confirmou um item na lista do carrinho e clicou em “Ir para checkout”. A asserção de navegação falhou:

```text
Expected pattern: /\/checkout$/
Received string: "http://localhost:3000/"
response: 200 http://localhost:3003/remoteEntry.js
```

O console não apresentou erros de JavaScript, CORS ou Federation nesse fluxo. O runtime antecipou o carregamento do entry do checkout; seu componente só foi solicitado ao navegar. Clicar em Checkout no header abriu `/checkout` e renderizou “Seu pedido”, confirmando que a rota e o remote funcionavam.

A causa está no contrato de montagem: `CartApp` associa o botão à prop opcional `onCheckout`, mas o shell montava o remote sem fornecer essa prop, tanto na home quanto em `/cart`. A correção fornece `navigate('/checkout')` a partir do shell nas duas montagens. React Router continua restrito ao shell.

Valor efetivo na reprodução: `VITE_CHECKOUT_REMOTE_URL=http://localhost:3003/remoteEntry.js`, fornecido ao processo do Vite e confirmado nas requisições do navegador. O entry está na raiz, não em `/assets`. Não se infere o valor em produção a partir do `.env.example`: ele precisa ser conferido no bundle/rede do shell publicado.

Após a correção, o mesmo teste passou: URL `/checkout`, formulário renderizado, confirmação simulada e contador do carrinho zerado. Os testes adicionais cobrem o botão em `/cart`, quantidade no checkout, recarregamento e checkout vazio.

## Executar

Também reproduzido em `https://shell-six-woad.vercel.app/`: o botão manteve a URL `/`. O remote efetivo `https://mfe-checkout-seven.vercel.app/remoteEntry.js` respondeu HTTP 200 com `Access-Control-Allow-Origin: *`. A navegação pelo header funcionou, porém recarregar `/checkout` retornou HTTP 404. Por isso foram adicionados rewrites específicos de `/cart` e `/checkout` para `/index.html` no shell. Houve um 404 independente para a imagem emoji do produto (`/%F0%9F%8D%8C`); não é a causa da navegação interrompida.

Após publicar, execute `E2E_BASE_URL=https://shell-six-woad.vercel.app pnpm test:e2e` para testar o site público sem iniciar servidores locais. A suíte usa apenas carrinho no navegador e pedido simulado.

```bash
pnpm install --frozen-lockfile
pnpm exec playwright install chromium
pnpm test:e2e
```

O Playwright inicia os quatro servidores locais com URLs explícitas. Falhas preservam trace em `test-results`; o teste principal anexa console, falhas de rede e respostas do checkout. Os relatórios não são versionados. Os testes unitários continuam disponíveis em `pnpm test`.
