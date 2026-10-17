# Regras de contribuição

- Cada domínio altera apenas sua pasta em `apps/`; pacotes compartilhados exigem coordenação.
- Catálogo expõe `./CatalogApp`; Carrinho, `./CartApp`; Checkout, `./CheckoutApp`.
- Use somente `@mercado/contracts` para eventos e carrinho; sem contexto React compartilhado.
- Componentes devem ser exportados como `default` e aceitar montagem independente.
- Mantenha estilos encapsulados e não use back-end ou autenticação.
- Antes de integrar, execute `pnpm --filter <pacote> build` e `test`.
