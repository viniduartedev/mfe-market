import { describe, expect, it } from 'vitest';
import type { CartState } from '@mercado/contracts';
import { cartTotal } from './cart-utils';

describe('cartTotal', () => {
  it('sums every item according to its quantity', () => {
    const cart: CartState = {
      updatedAt: '2026-01-01T00:00:00.000Z',
      items: [
        { product: { id: 'banana', name: 'Banana', price: 4.5, category: 'Frutas e verduras', image: '', unit: 'kg' }, quantity: 2 },
        { product: { id: 'water', name: 'Água', price: 3, category: 'Bebidas', image: '', unit: 'un' }, quantity: 1 },
      ],
    };

    expect(cartTotal(cart)).toBe(12);
  });
});
