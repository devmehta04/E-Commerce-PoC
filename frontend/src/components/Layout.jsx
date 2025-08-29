import { Link } from 'react-router-dom';

export default function Layout({ cartCount, children }) {
	return (
		<div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', minHeight: '100vh' }}>
			<aside style={{ borderRight: '1px solid #000', padding: 16 }}>
				<h3 style={{ marginTop: 0 }}>Admin</h3>
				<nav style={{ display: 'grid', gap: 8 }}>
					<Link to="/">Dashboard</Link>
					<Link to="/catalog">Catalog</Link>
				</nav>
			</aside>
			<main>
				<header className="container space-between" style={{ borderBottom: '1px solid #000' }}>
					<strong>E-Commerce Store</strong>
					<Link to="/cart">Cart ({cartCount})</Link>
				</header>
				<div>{children}</div>
			</main>
		</div>
	);
}


