/*
  Warnings:

  - A unique constraint covering the columns `[aid]` on the table `Agent` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[code]` on the table `Stock` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Agent.aid_index";

-- DropIndex
DROP INDEX "Stock.code_index";

-- CreateIndex
CREATE UNIQUE INDEX "Agent.aid_unique" ON "Agent"("aid");

-- CreateIndex
CREATE UNIQUE INDEX "Stock.code_unique" ON "Stock"("code");

-- AddForeignKey
ALTER TABLE "AgentStockHolding" ADD FOREIGN KEY ("stock_code") REFERENCES "Stock"("code") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AgentStockHolding" ADD FOREIGN KEY ("agent_id") REFERENCES "Agent"("aid") ON DELETE CASCADE ON UPDATE CASCADE;
