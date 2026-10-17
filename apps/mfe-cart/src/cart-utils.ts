import type { CartState } from '@mercado/contracts';

export const cartTotal = (cart: CartState) =>
  cart.items.reduce((total, item) => total + item.product.price * item.quantity, 0);

export const formatPrice = (value: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
