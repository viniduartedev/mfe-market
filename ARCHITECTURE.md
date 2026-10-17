# Arquitetura

```mermaid
flowchart TB
  Browser --> Shell[Shell :3000]
  Shell --> Catalog[Catálogo :3001]
  Shell --> Cart[Carrinho :3002]
  Shell --> Checkout[Checkout :3003]
  Catalog --> Contracts[@mercado/contracts]
  Cart --> Contracts
  Checkout --> Contracts
  Contracts --> Storage[(localStorage)]
  Contracts --> Events[CustomEvent]
```

O shell é apenas integrador: React Router vive nele e cada domínio é carregado remotamente via Module Federation. Os micros não dependem um do outro; o contrato comum persiste o carrinho e notifica alterações por eventos do navegador.
