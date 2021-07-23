const express = require('express');
const cors = require('cors');
const fs = require('fs');
const csv = require('csv-parser');
const fetcher = require('./main').fetcher;

const app = express();

app.use(cors())

const port = 3000;

app.get('/', (req, res) => {

    const agents = [];

    let stock_code = req.query.stock_code || '6060';
    let date = req.query.date || new Date().toISOString().substring(0, 10);

    const file_path = `./data/${stock_code}_${date}.csv`;

    const done = () => {
        fs.createReadStream(file_path)
            .pipe(csv())
            .on('data', (data) => {
                agents.push(data);
            })
            .on('end', function () {
                res.json(agents);
            });
    }

    if (fs.existsSync(file_path)) {
        done()
    } else {
        console.log(`download ${stock_code} on ${date} began`);

        fetcher(stock_code, date).then(() => {
            console.log(`download ${stock_code} on ${date} finished`);
            done();
        });
    };
});

app.listen(port, () => {
    console.log(`server is listening on port ${port}`);
});
