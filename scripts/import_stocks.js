const readCsv = require('../utils').readCsv;
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  const file_path = './metadata/hk_stocks.csv';

  const stocks = await readCsv(file_path);
  await create_stocks(stocks);
}

async function create_stocks(data) {
  const stocks = data.map(stock => Object.fromEntries([
    ['name', stock.stock_name],
    ['code', stock.stock_code]
  ])
  )

  await prisma.stock.createMany({
    data: stocks
  })
}

main().catch(e => {
  throw e
})
  .finally(async () => {
    await prisma.$disconnect()
  })