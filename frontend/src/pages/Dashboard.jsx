import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

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

export default function Dashboard() {
	const navigate = useNavigate();
	const [data, setData] = useState({ items: [], total: 0, page: 1, totalPages: 1 });
	const [page, setPage] = useState(1);
	const pageSize = 10;
	async function load() {
		const r = await fetch(`/api/products?page=${page}&pageSize=${pageSize}`);
		setData(await r.json());
	}
	useEffect(() => { load(); }, [page]);
	async function handleDelete(id) {
		await fetch(`/api/products/${id}`, { method: 'DELETE' });
		load();
	}
	return (
		<div className="container">
			<div className="space-between">
				<h2>Dashboard</h2>
				<button onClick={() => navigate('/products/new')}>Add Product</button>
			</div>
			<table className="table">
				<thead>
					<tr>
						<th>Name</th><th>SKU</th><th>Brand</th><th>MRP</th><th>Final</th><th>Stock</th><th>Master</th><th></th>
					</tr>
				</thead>
				<tbody>
					{data.items.map(p => (
						<tr key={p.id}>
							<td>{p.name}</td><td>{p.sku}</td><td>{p.brand || '-'}</td><td>{formatCents(p.mrpCents)}</td><td>{formatCents(p.finalPriceCents ?? p.priceCents)}</td><td>{p.stock}</td><td>{p.isMaster ? 'Yes' : 'No'}</td>
							<td className="row"><button className="ghost" onClick={() => navigate(`/products/${p.id}/edit`)}>Edit</button><button onClick={() => handleDelete(p.id)}>Delete</button></td>
						</tr>
					))}
				</tbody>
			</table>
			<Pagination page={data.page} totalPages={data.totalPages} onChange={setPage} />
		</div>
	);
}


