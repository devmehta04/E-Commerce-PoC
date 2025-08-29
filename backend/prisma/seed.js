const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const electronics = await prisma.category.upsert({
    where: { slug: 'electronics' },
    update: {},
    create: { name: 'Electronics', slug: 'electronics' }
  });

  await prisma.product.createMany({
    data: [
      {
        name: 'Wireless Headphones',
        description: 'Over-ear Bluetooth headphones with noise cancellation',
        priceCents: 8999,
        sku: 'WH-001',
        stock: 25,
        imageUrl: 'https://picsum.photos/seed/headphones/600/400',
        categoryId: electronics.id
      },
      {
        name: 'Smart Watch',
        description: 'Fitness tracking and notifications',
        priceCents: 12999,
        sku: 'SW-002',
        stock: 15,
        imageUrl: 'https://picsum.photos/seed/smartwatch/600/400',
        categoryId: electronics.id
      }
    ]
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });


