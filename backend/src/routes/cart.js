const express = require('express');
const router = express.Router();
const { prisma } = require('../lib/prisma');

// In-memory cart store keyed by session-less clientId (simple PoC)
const carts = new Map();

function getCart(clientId) {
  if (!carts.has(clientId)) carts.set(clientId, new Map());
  return carts.get(clientId);
}

router.get('/', async (req, res, next) => {
  try {
    const clientId = req.query.clientId || 'anonymous';
    const cartMap = getCart(clientId);
    const entries = Array.from(cartMap.entries());
    const items = entries.map(([productId, val]) => {
      if (typeof val === 'number') return { productId, quantity: val };
      return { productId, quantity: val.quantity, product: val.product || null };
    });
    const missingIds = items.filter(i => !i.product).map(i => i.productId);
    const products = missingIds.length ? await prisma.product.findMany({ where: { id: { in: missingIds } } }) : [];
    const byId = new Map(products.map(p => [p.id, p]));
    const enriched = items.map(i => ({ ...i, product: i.product || (byId.get(i.productId) ? { id: i.productId, name: byId.get(i.productId).name } : null) }));
    res.json({ items: enriched });
  } catch (err) {
    next(err);
  }
});

router.post('/add', async (req, res, next) => {
  try {
    const clientId = req.body.clientId || 'anonymous';
    const { productId, quantity } = req.body;
    if (!productId || !quantity) return res.status(400).json({ error: 'productId and quantity required' });
    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product || !product.isMaster) return res.status(404).json({ error: 'Product not found' });
    const cart = getCart(clientId);
    const existing = cart.get(productId);
    if (existing && typeof existing === 'object') {
      existing.quantity += Number(quantity);
      cart.set(productId, existing);
    } else if (typeof existing === 'number') {
      cart.set(productId, { quantity: existing + Number(quantity), product: { id: product.id, name: product.name } });
    } else {
      cart.set(productId, { quantity: Number(quantity), product: { id: product.id, name: product.name } });
    }
    res.status(204).end();
  } catch (err) { next(err); }
});

router.post('/remove', (req, res) => {
  const clientId = req.body.clientId || 'anonymous';
  const { productId } = req.body;
  if (!productId) return res.status(400).json({ error: 'productId required' });
  const cart = getCart(clientId);
  cart.delete(productId);
  res.status(204).end();
});

router.post('/clear', (req, res) => {
  const clientId = req.body.clientId || 'anonymous';
  carts.set(clientId, new Map());
  res.status(204).end();
});

module.exports = router;


