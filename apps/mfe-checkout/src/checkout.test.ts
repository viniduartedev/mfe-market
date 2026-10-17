import { describe, expect, it } from 'vitest';
import type { CartItem } from '@mercado/contracts';
import { cartQuantity, cartTotal, formatBRL } from './checkout';

const items: CartItem[] = [
  { product: { id: 'banana', name: 'Banana', price: 7.5, category: 'Frutas e verduras', image: '', unit: 'kg' }, quantity: 2 },
  { product: { id: 'cafe', name: 'Café', price: 15, category: 'Mercearia', image: '', unit: 'un' }, quantity: 1 },
];

describe('checkout calculations', () => {
  it('calculates item quantity and payable total', () => {
    expect(cartQuantity(items)).toBe(3);
    expect(cartTotal(items)).toBe(30);
    expect(formatBRL(cartTotal(items))).toBe('R$ 30,00');
  });
});
