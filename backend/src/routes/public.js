const express = require('express');
const router = express.Router();
const { prisma } = require('../lib/prisma');

// Public: list master products with pagination
router.get('/products', async (req, res, next) => {
  try {
    const page = Math.max(parseInt(req.query.page || '1', 10), 1);
    const pageSize = Math.min(Math.max(parseInt(req.query.pageSize || '12', 10), 1), 60);
    const skip = (page - 1) * pageSize;
    const where = { isMaster: true };
    const [items, total] = await Promise.all([
      prisma.product.findMany({ where, orderBy: { createdAt: 'desc' }, skip, take: pageSize }),
      prisma.product.count({ where })
    ]);
    res.json({ items, page, pageSize, total, totalPages: Math.ceil(total / pageSize) });
  } catch (err) {
    next(err);
  }
});

module.exports = router;


