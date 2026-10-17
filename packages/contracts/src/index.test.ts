import { describe, expect, it } from 'vitest';
import { addToCart, getCart, updateQuantity, type Product } from './index';
const product: Product = { id: '1', name: 'Maçã', price: 3, category: 'Frutas e verduras', image: '', unit: 'kg' };
describe('cart contract', () => { it('adds and updates products', () => { addToCart(product); expect(getCart().items[0].quantity).toBe(1); updateQuantity('1', 3); expect(getCart().items[0].quantity).toBe(3); }); });
