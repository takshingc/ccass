const readCsv = require('../utils').readCsv;
const downloadHoldings = require('./download_holdings').downloadHoldings;
const client = require('../db_client').client;

async function main(stock_code, date, cached_data = false) {
  let holdings;

  if (cached_data) {
    holdings = await get_holdings_from_csv(stock_code, date, holdings);
  } else {
    holdings = await get_holdings_from_ccass(stock_code, date);
  }

  await create_holdings(holdings);
}

async function get_holdings_from_csv(stock_code, date) {
  const file_path = `./data/${stock_code}_${date}.csv`;
  const data = readCsv(file_path);

  const holdings = data.map(holding => Object.fromEntries([
    ['stock_code', stock_code],
    ['agent_id', holding.id],
    ['shares', parseShares(holding.shares)],
    ['percentage', parseFloat(holding.percentage)],
    ['on_date', new Date(date)]
  ])
  );

  return holdings;
}

async function get_holdings_from_ccass(stock_code, date) {
  const data = await downloadHoldings(stock_code, date);

  const holdings = data.map(holding => Object.fromEntries([
    ['stock_code', stock_code],
    ['agent_id', holding[0]],
    ['shares', parseShares(holding[3])],
    ['percentage', parseFloat(holding[4])],
    ['on_date', new Date(date)]
  ])
  );

  return holdings;
}

async function create_holdings(holdings) {
  const result = await client.agentStockHolding.createMany({
    data: holdings
  });

  console.log(result);
}

function parseShares(number) {
  return parseFloat(number.replace(/,/g, ''));
}

var myArgs = process.argv.slice(2);
const stock_code = myArgs[0];
const date = myArgs[1];

main(stock_code, date)
  .catch(e => {
    throw e
  })
  .finally(async () => {
    await client.$disconnect()
  })