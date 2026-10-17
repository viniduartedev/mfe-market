export type Category = 'Frutas e verduras' | 'Bebidas' | 'Mercearia' | 'Padaria' | 'Limpeza';
export interface Product { id: string; name: string; price: number; category: Category; image: string; unit: string; }
export interface CartItem { product: Product; quantity: number; }
export interface CartState { items: CartItem[]; updatedAt: string; }
export interface Order { id: string; items: CartItem[]; total: number; address: string; paymentMethod: string; createdAt: string; }

export const MARKET_EVENTS = { cartChanged: 'market:cart:changed', orderConfirmed: 'market:order:confirmed' } as const;
const CART_KEY = 'mercado-mfe:cart';
const emptyCart = (): CartState => ({ items: [], updatedAt: new Date().toISOString() });
const hasStorage = () => typeof window !== 'undefined' && !!window.localStorage;
export function getCart(): CartState { try { const value = hasStorage() ? localStorage.getItem(CART_KEY) : null; return value ? JSON.parse(value) : emptyCart(); } catch { return emptyCart(); } }
function emitCart(cart: CartState) { if (typeof window !== 'undefined') window.dispatchEvent(new CustomEvent<CartState>(MARKET_EVENTS.cartChanged, { detail: cart })); }
function save(cart: CartState) { if (hasStorage()) localStorage.setItem(CART_KEY, JSON.stringify(cart)); emitCart(cart); return cart; }
export function addToCart(product: Product, quantity = 1) { const cart = getCart(); const found = cart.items.find((item) => item.product.id === product.id); if (found) found.quantity += quantity; else cart.items.push({ product, quantity }); return save({ ...cart, updatedAt: new Date().toISOString() }); }
export function updateQuantity(productId: string, quantity: number) { const cart = getCart(); cart.items = quantity > 0 ? cart.items.map((item) => item.product.id === productId ? { ...item, quantity } : item) : cart.items.filter((item) => item.product.id !== productId); return save({ ...cart, updatedAt: new Date().toISOString() }); }
export function removeFromCart(productId: string) { return updateQuantity(productId, 0); }
export function clearCart() { return save(emptyCart()); }
export function subscribeToCart(listener: (cart: CartState) => void) { const handler = (event: Event) => listener((event as CustomEvent<CartState>).detail); window.addEventListener(MARKET_EVENTS.cartChanged, handler); return () => window.removeEventListener(MARKET_EVENTS.cartChanged, handler); }
export function confirmOrder(order: Order) { window.dispatchEvent(new CustomEvent<Order>(MARKET_EVENTS.orderConfirmed, { detail: order })); }
