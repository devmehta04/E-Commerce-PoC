import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import { useEffect, useMemo, useState } from 'react';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import ProductForm from './pages/ProductForm';
import Catalog from './pages/Catalog';
import Cart from './pages/Cart';
import ProductDetails from './pages/ProductDetails';

function App() {
	const [cart, setCart] = useState([]);
	const cartCount = useMemo(() => cart.reduce((n, i) => n + i.quantity, 0), [cart]);
	async function addToCart(productId) {
		await fetch('/api/cart/add', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ clientId: 'web', productId, quantity: 1 }) });
		const res = await fetch('/api/cart?clientId=web');
		const j = await res.json();
		setCart(j.items || []);
	}

	async function removeFromCart(productId) {
		await fetch('/api/cart/remove', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ clientId: 'web', productId }) });
		const res = await fetch('/api/cart?clientId=web');
		const j = await res.json();
		setCart(j.items || []);
	}

	async function clearCart() {
		await fetch('/api/cart/clear', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ clientId: 'web' }) });
		setCart([]);
	}
	useEffect(() => { (async () => { const res = await fetch('/api/cart?clientId=web'); const j = await res.json(); setCart(j.items || []); })(); }, []);
	return (
		<BrowserRouter>
			<Layout cartCount={cartCount}>
				<Routes>
					<Route path="/" element={<Dashboard />} />
					<Route path="/products/new" element={<ProductForm />} />
					<Route path="/products/:id/edit" element={<ProductForm />} />
 					<Route path="/products/:id" element={<ProductDetails />} />
					<Route path="/catalog" element={<Catalog onAddToCart={addToCart} />} />
					<Route path="/cart" element={<Cart items={cart} onRemove={removeFromCart} onClear={clearCart} />} />
				</Routes>
			</Layout>
		</BrowserRouter>
	);
}

export default App;
