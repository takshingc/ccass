-- CreateTable
CREATE TABLE "Stock" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "sector" TEXT,

    PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Stock.code_index" ON "Stock"("code");
