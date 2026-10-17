import { lazy, Suspense, useEffect, useState, Component, type ComponentType, type ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Link, NavLink, Route, Routes } from 'react-router-dom';
import { getCart, subscribeToCart, type CartState } from '@mercado/contracts';
import './styles.css';

const Catalog = lazy(() => import('catalog/CatalogApp'));
const Cart = lazy(() => import('cart/CartApp'));
const Checkout = lazy(() => import('checkout/CheckoutApp'));
function Remote({ component: Component, name }: { component: ComponentType; name: string }) { return <RemoteBoundary name={name}><Suspense fallback={<div className="remote-state">Carregando {name}…</div>}><Component /></Suspense></RemoteBoundary>; }
class RemoteBoundary extends Component<{ name: string; children: ReactNode }, { failed: boolean }> { state = { failed: false }; static getDerivedStateFromError() { return { failed: true }; } render() { return this.state.failed ? <div className="remote-state error">Não foi possível carregar <b>{this.props.name}</b>. Verifique se o micro está disponível e a URL remota configurada.</div> : this.props.children; } }
function Header() { const [cart, setCart] = useState<CartState>(() => getCart()); useEffect(() => subscribeToCart(setCart), []); const count = cart.items.reduce((total, item) => total + item.quantity, 0); return <header><Link className="brand" to="/">Mercado <span>MFE</span></Link><nav><NavLink to="/">Catálogo</NavLink><NavLink to="/cart">Carrinho <i>{count}</i></NavLink><NavLink to="/checkout">Checkout</NavLink></nav></header>; }
function Storefront() { return <div className="split"><section><div className="eyebrow">FRESCO, RÁPIDO, MODULAR</div><h1>Seu mercado digital, em micros.</h1><p>Catálogo e carrinho carregados de forma independente.</p><Remote component={Catalog} name="Catálogo" /></section><aside><Remote component={Cart} name="Carrinho" /></aside></div>; }
function App() { return <BrowserRouter><Header /><main><Routes><Route path="/" element={<Storefront />} /><Route path="/cart" element={<Remote component={Cart} name="Carrinho" />} /><Route path="/checkout" element={<Remote component={Checkout} name="Checkout" />} /></Routes></main><footer>Demonstração técnica · Module Federation · contratos explícitos</footer></BrowserRouter>; }
createRoot(document.getElementById('root')!).render(<App />);
