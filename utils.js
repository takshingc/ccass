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

exports.readCsv = readCsv;
