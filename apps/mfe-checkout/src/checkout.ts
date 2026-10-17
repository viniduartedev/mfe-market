import type { CartItem } from '@mercado/contracts';

export const cartTotal = (items: CartItem[]) =>
  items.reduce((total, item) => total + item.product.price * item.quantity, 0);

export const cartQuantity = (items: CartItem[]) =>
  items.reduce((quantity, item) => quantity + item.quantity, 0);

export const formatBRL = (value: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
