const fs = require('fs');
const csv = require('csv-parser');

async function readCsv(file_path) {
  const records = [];
  const parser = await fs.createReadStream(file_path).pipe(csv());
  for await (const record of parser) {
    records.push(record);
  }
  return records
}

function jsonify(data) {
  return JSON.stringify(
    data,
    (key, value) => (typeof value === 'bigint' ? value.toString() : value)
  )
}

module.exports = {
  readCsv: readCsv,
  jsonify: jsonify
}
