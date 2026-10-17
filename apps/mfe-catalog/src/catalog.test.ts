import { describe, expect, it } from 'vitest';
import { products } from '@mercado/mock-data';
import { ALL_CATEGORIES, filterProducts, formatPrice } from './catalog';

describe('catalog helpers', () => {
  it('filters products by a case-insensitive name and category', () => {
    expect(filterProducts(products, 'CAFÉ', ALL_CATEGORIES).map((product) => product.id)).toEqual(['cafe']);
    expect(filterProducts(products, '', 'Limpeza').map((product) => product.id)).toEqual(['detergente']);
  });

  it('formats prices for Brazilian currency', () => {
    expect(formatPrice(6.49)).toBe('R$ 6,49');
  });
});
