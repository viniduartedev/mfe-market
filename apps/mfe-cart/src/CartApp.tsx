import { getCart, removeFromCart, subscribeToCart, updateQuantity, type CartState } from '@mercado/contracts';
import { useEffect, useState } from 'react';
import { cartTotal, formatPrice } from './cart-utils';
import './cart.css';

export interface CartAppProps {
  onCheckout?: () => void;
}

const clampQuantity = (value: number) => Math.max(1, Math.floor(value) || 1);

export default function CartApp({ onCheckout }: CartAppProps) {
  const [cart, setCart] = useState<CartState>(() => getCart());

  useEffect(() => subscribeToCart(setCart), []);

  const total = cartTotal(cart);

  return (
    <section className="market-cart" aria-labelledby="cart-title">
      <header className="market-cart__header">
        <div>
          <p className="market-cart__eyebrow">Sua compra</p>
          <h1 id="cart-title">Carrinho</h1>
        </div>
        <span className="market-cart__count" aria-label={`${cart.items.length} tipos de produto`}>
          {cart.items.reduce((count, item) => count + item.quantity, 0)} itens
        </span>
      </header>

      {cart.items.length === 0 ? (
        <div className="market-cart__empty">
          <span aria-hidden="true">🛒</span>
          <h2>Seu carrinho está vazio</h2>
          <p>Adicione produtos pelo catálogo para vê-los aqui.</p>
        </div>
      ) : (
        <>
          <ul className="market-cart__items" aria-label="Produtos no carrinho">
            {cart.items.map(({ product, quantity }) => (
              <li className="market-cart__item" key={product.id}>
                {/^(https?:\/\/|data:image\/|\/)/i.test(product.image) ? (
                  <img className="market-cart__image" src={product.image} alt="" />
                ) : (
                  <div className="market-cart__image market-cart__image--placeholder" aria-hidden="true">{product.image || '🛍️'}</div>
                )}
                <div className="market-cart__product">
                  <h2>{product.name}</h2>
                  <p>{formatPrice(product.price)} / {product.unit}</p>
                  <button className="market-cart__remove" type="button" onClick={() => removeFromCart(product.id)}>
                    Remover
                  </button>
                </div>
                <div className="market-cart__controls">
                  <div className="market-cart__quantity" aria-label={`Quantidade de ${product.name}`}>
                    <button type="button" aria-label={`Diminuir ${product.name}`} onClick={() => updateQuantity(product.id, quantity - 1)}>−</button>
                    <input
                      aria-label={`Quantidade de ${product.name}`}
                      type="number"
                      min="1"
                      value={quantity}
                      onChange={(event) => updateQuantity(product.id, clampQuantity(Number(event.target.value)))}
                    />
                    <button type="button" aria-label={`Aumentar ${product.name}`} onClick={() => updateQuantity(product.id, quantity + 1)}>+</button>
                  </div>
                  <strong>{formatPrice(product.price * quantity)}</strong>
                </div>
              </li>
            ))}
          </ul>
          <footer className="market-cart__summary">
            <div><span>Subtotal</span><strong>{formatPrice(total)}</strong></div>
            <div><span>Entrega</span><span>A calcular no checkout</span></div>
            <div className="market-cart__total"><span>Total</span><strong>{formatPrice(total)}</strong></div>
            <button className="market-cart__checkout" type="button" onClick={onCheckout}>
              Ir para checkout <span aria-hidden="true">→</span>
            </button>
          </footer>
        </>
      )}
    </section>
  );
}
