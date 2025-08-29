const { PrismaClient } = require('@prisma/client');

let prismaClient;

function getPrismaClient() {
  if (!prismaClient) {
    prismaClient = new PrismaClient();
  }
  return prismaClient;
}

module.exports = {
  prisma: getPrismaClient()
};


