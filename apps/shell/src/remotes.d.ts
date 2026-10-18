declare module 'catalog/CatalogApp' { const Component: React.ComponentType; export default Component; }
declare module 'cart/CartApp' { const Component: React.ComponentType<{ onCheckout?: () => void }>; export default Component; }
declare module 'checkout/CheckoutApp' { const Component: React.ComponentType; export default Component; }
