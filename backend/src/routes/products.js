const express = require('express');
const router = express.Router();
const { prisma } = require('../lib/prisma');

// Admin: list with pagination
router.get('/', async (req, res, next) => {
  try {
    const page = Math.max(parseInt(req.query.page || '1', 10), 1);
    const pageSize = Math.min(Math.max(parseInt(req.query.pageSize || '10', 10), 1), 50);
    const skip = (page - 1) * pageSize;
    const [items, total] = await Promise.all([
      prisma.product.findMany({ orderBy: { createdAt: 'desc' }, skip, take: pageSize }),
      prisma.product.count()
    ]);
    res.json({ items, page, pageSize, total, totalPages: Math.ceil(total / pageSize) });
  } catch (err) {
    next(err);
  }
});

// Admin: create product
router.post('/', async (req, res, next) => {
  try {
    const {
      name, description, brand, size, mrpCents, finalPriceCents, sku, stock, imageUrl, isMaster, categoryId
    } = req.body;
    if (!name || !sku) {
      return res.status(400).json({ error: 'name and sku are required' });
    }
    const data = {
      name,
      description: description || null,
      brand: brand || null,
      size: size || null,
      mrpCents: mrpCents ?? null,
      finalPriceCents: typeof finalPriceCents === 'number' ? finalPriceCents : 0,
      priceCents: typeof finalPriceCents === 'number' ? finalPriceCents : 0,
      sku,
      stock: typeof stock === 'number' ? stock : 0,
      imageUrl: imageUrl || null,
      isMaster: typeof isMaster === 'boolean' ? isMaster : true,
      categoryId: categoryId || null
    };
    const created = await prisma.product.create({ data });
    res.status(201).json(created);
  } catch (err) {
    next(err);
  }
});

// Admin: update product
router.put('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = { ...req.body };
    const updated = await prisma.product.update({ where: { id }, data });
    res.json(updated);
  } catch (err) {
    next(err);
  }
});

// Admin: get product by id
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await prisma.product.findUnique({ where: { id } });
    if (!product) return res.status(404).json({ error: 'Not found' });
    res.json(product);
  } catch (err) {
    next(err);
  }
});

// Admin: delete product
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    await prisma.product.delete({ where: { id } });
    res.status(204).end();
  } catch (err) {
    next(err);
  }
});

module.exports = router;


