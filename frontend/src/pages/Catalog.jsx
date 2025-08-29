import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Image from '../components/Image';

function formatCents(c) { if (c == null) return '-'; return `₹${(c / 100).toFixed(2)}`; }

function Pagination({ page, totalPages, onChange }) {
	return (
		<div className="pagination">
			<button className="ghost" disabled={page <= 1} onClick={() => onChange(page - 1)}>Prev</button>
			<span>{page} / {totalPages}</span>
			<button className="ghost" disabled={page >= totalPages} onClick={() => onChange(page + 1)}>Next</button>
		</div>
	);
}

export default function Catalog({ onAddToCart }) {
	const [page, setPage] = useState(1);
	const [data, setData] = useState({ items: [], totalPages: 1 });
	useEffect(() => { fetch(`/api/public/products?page=${page}&pageSize=12`).then(r => r.json()).then(setData); }, [page]);
	return (
		<div className="container">
			<h2>Products</h2>
			<div className="grid">
				{data.items.map(p => (
					<div className="card" key={p.id}>
						<Link to={`/products/${p.id}`}>
							<Image src={p.imageUrl} alt="" style={{ width: '100%', height: 140, objectFit: 'cover', border: '1px solid #000' }} />
						</Link>
						<div><strong>{p.name}</strong></div>
						<div className="muted">{formatCents(p.finalPriceCents ?? p.priceCents)}</div>
						<button onClick={() => onAddToCart(p.id)}>Add to cart</button>
					</div>
				))}
			</div>
			<Pagination page={page} totalPages={data.totalPages} onChange={setPage} />
		</div>
	);
}


