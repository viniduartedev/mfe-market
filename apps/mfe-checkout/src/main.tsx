import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import CheckoutApp from './CheckoutApp';

const root = document.getElementById('root');
if (root) createRoot(root).render(<StrictMode><CheckoutApp /></StrictMode>);
