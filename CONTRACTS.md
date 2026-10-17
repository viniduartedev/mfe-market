# Contratos de integração

`@mercado/contracts` é a única superfície de integração entre domínios. Não compartilhe estado React entre micros.

| Item | Regra |
| --- | --- |
| Carrinho | `getCart`, `addToCart`, `updateQuantity`, `removeFromCart` e `clearCart` persistem em `localStorage` na chave `mercado-mfe:cart`. |
| Evento | `market:cart:changed` contém `CustomEvent<CartState>` em `detail`. Use `subscribeToCart`. |
| Pedido | `market:order:confirmed` contém `CustomEvent<Order>` em `detail`; é emitido por `confirmOrder`. |
| Compatibilidade | Adicione campos opcionais; nunca renomeie eventos, chave de storage ou campos existentes sem release coordenado. |

Tipos públicos: `Product`, `CartItem`, `CartState` e `Order`.
