import { clearCart, confirmOrder, getCart, subscribeToCart, type CartState } from '@mercado/contracts';
import { FormEvent, useEffect, useMemo, useState } from 'react';
import { cartQuantity, cartTotal, formatBRL } from './checkout';
import './checkout.css';

type PaymentMethod = 'Pix' | 'Cartão de crédito' | 'Cartão na entrega';

const initialCart = (): CartState => getCart();

export default function CheckoutApp() {
  const [cart, setCart] = useState<CartState>(initialCart);
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Pix');
  const [orderId, setOrderId] = useState<string | null>(null);
  const total = useMemo(() => cartTotal(cart.items), [cart.items]);
  const quantity = useMemo(() => cartQuantity(cart.items), [cart.items]);

  useEffect(() => subscribeToCart(setCart), []);

  function placeOrder(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!address.trim() || !cart.items.length) return;

    const id = `PED-${Date.now().toString(36).toUpperCase()}`;
    confirmOrder({
      id,
      items: cart.items,
      total,
      address: address.trim(),
      paymentMethod,
      createdAt: new Date().toISOString(),
    });
    clearCart();
    setOrderId(id);
  }

  if (orderId) {
    return (
      <section className="checkout-root checkout-success" aria-live="polite">
        <div className="checkout-success__icon" aria-hidden="true">✓</div>
        <p className="checkout-eyebrow">Pedido confirmado</p>
        <h1>Compra realizada!</h1>
        <p>Seu pedido <strong>{orderId}</strong> foi enviado para separação.</p>
        <p className="checkout-success__total">Total: {formatBRL(total)}</p>
        <button type="button" onClick={() => setOrderId(null)}>Fazer novo pedido</button>
      </section>
    );
  }

  return (
    <section className="checkout-root" aria-label="Checkout">
      <header className="checkout-header">
        <p className="checkout-eyebrow">Finalizar compra</p>
        <h1>Seu pedido</h1>
        <span>{quantity} {quantity === 1 ? 'item' : 'itens'}</span>
      </header>

      <form className="checkout-layout" onSubmit={placeOrder}>
        <div className="checkout-steps">
          <fieldset className="checkout-card">
            <legend>1. Endereço de entrega</legend>
            <label htmlFor="checkout-address">Onde devemos entregar?</label>
            <textarea
              id="checkout-address"
              name="address"
              value={address}
              onChange={(event) => setAddress(event.target.value)}
              placeholder="Rua, número, complemento e bairro"
              required
              rows={3}
            />
          </fieldset>

          <fieldset className="checkout-card">
            <legend>2. Forma de pagamento</legend>
            <div className="checkout-payments">
              {(['Pix', 'Cartão de crédito', 'Cartão na entrega'] as PaymentMethod[]).map((method) => (
                <label className="checkout-payment" key={method}>
                  <input
                    type="radio"
                    name="payment"
                    value={method}
                    checked={paymentMethod === method}
                    onChange={() => setPaymentMethod(method)}
                  />
                  <span>{method}</span>
                </label>
              ))}
            </div>
          </fieldset>
        </div>

        <aside className="checkout-summary" aria-label="Resumo do pedido">
          <h2>Resumo</h2>
          {cart.items.length ? (
            <ul>
              {cart.items.map(({ product, quantity: itemQuantity }) => (
                <li key={product.id}>
                  <span><b>{itemQuantity}×</b> {product.name}</span>
                  <strong>{formatBRL(product.price * itemQuantity)}</strong>
                </li>
              ))}
            </ul>
          ) : <p className="checkout-empty">Seu carrinho está vazio.</p>}
          <div className="checkout-total"><span>Total</span><strong>{formatBRL(total)}</strong></div>
          <button className="checkout-submit" type="submit" disabled={!cart.items.length}>
            Confirmar pedido
          </button>
          <small>Ambiente de demonstração: nenhum pagamento será processado.</small>
        </aside>
      </form>
    </section>
  );
}
