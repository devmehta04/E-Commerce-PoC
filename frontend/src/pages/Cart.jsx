export default function Cart({ items, onRemove, onClear }) {
	return (
		<div className="container">
			<div className="space-between">
				<h2>Cart</h2>
				{items.length > 0 ? <button className="ghost" onClick={onClear}>Clear cart</button> : null}
			</div>
			{items.length === 0 ? <div className="muted">Cart is empty</div> : (
				<div className="grid">
					{items.map(i => (
						<div className="card" key={i.productId}>
							<div><strong>{i.product?.name || i.productId}</strong></div>
							<div className="muted">Qty: {i.quantity}</div>
							<div className="row">
								<button className="ghost" onClick={() => onRemove(i.productId)}>Remove</button>
							</div>
						</div>
					))}
				</div>
			)}
		</div>
	);
}


