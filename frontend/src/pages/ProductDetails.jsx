import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Image from '../components/Image';

function formatCents(c) { if (c == null) return '-'; return `₹${(c / 100).toFixed(2)}`; }

export default function ProductDetails() {
	const { id } = useParams();
	const [p, setP] = useState(null);
	useEffect(() => { fetch(`/api/products/${id}`).then(r => r.json()).then(setP); }, [id]);
	if (!p) return <div className="container">Loading…</div>;
	return (
		<div className="container">
			<div className="grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
				<div>
					<Image src={p.imageUrl} alt="" style={{ width: '100%', border: '1px solid #000' }} />
				</div>
				<div>
					<h2>{p.name}</h2>
					<div className="muted">SKU: {p.sku}</div>
					<p>{p.description || 'No description.'}</p>
					<div className="row">
						{p.mrpCents ? <span className="muted" style={{ textDecoration: 'line-through' }}>{formatCents(p.mrpCents)}</span> : null}
						<strong>{formatCents(p.finalPriceCents ?? p.priceCents)}</strong>
					</div>
				</div>
			</div>
		</div>
	);
}


