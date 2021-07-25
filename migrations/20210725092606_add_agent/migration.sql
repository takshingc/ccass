-- CreateTable
CREATE TABLE "Agent" (
    "id" SERIAL NOT NULL,
    "aid" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT,

    PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Agent.aid_index" ON "Agent"("aid");
