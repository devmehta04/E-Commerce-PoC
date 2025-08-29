-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Product" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "brand" TEXT,
    "size" TEXT,
    "mrpCents" INTEGER,
    "finalPriceCents" INTEGER NOT NULL DEFAULT 0,
    "priceCents" INTEGER NOT NULL,
    "sku" TEXT NOT NULL,
    "stock" INTEGER NOT NULL DEFAULT 0,
    "imageUrl" TEXT,
    "isMaster" BOOLEAN NOT NULL DEFAULT true,
    "categoryId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Product_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Product" ("categoryId", "createdAt", "description", "id", "imageUrl", "name", "priceCents", "sku", "stock", "updatedAt") SELECT "categoryId", "createdAt", "description", "id", "imageUrl", "name", "priceCents", "sku", "stock", "updatedAt" FROM "Product";
DROP TABLE "Product";
ALTER TABLE "new_Product" RENAME TO "Product";
CREATE UNIQUE INDEX "Product_sku_key" ON "Product"("sku");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
