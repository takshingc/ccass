-- CreateTable
CREATE TABLE "AgentStockHolding" (
    "id" SERIAL NOT NULL,
    "stock_code" TEXT NOT NULL,
    "agent_id" TEXT NOT NULL,
    "shares" BIGINT NOT NULL,
    "percentage" DOUBLE PRECISION NOT NULL,
    "on_date" TIMESTAMP(3) NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "AgentStockHolding.stock_code_index" ON "AgentStockHolding"("stock_code");

-- CreateIndex
CREATE INDEX "AgentStockHolding.agent_id_index" ON "AgentStockHolding"("agent_id");
