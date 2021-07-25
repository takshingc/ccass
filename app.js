const express = require('express');
const cors = require('cors');
const fs = require('fs');
const csv = require('csv-parser');
const client = require('./db_client').client;

const app = express();

app.use(cors())

const port = 3000;

app.get('/', async (req, res) => {
    let stock_code = req.query.stock_code || '6060';
    let date = req.query.date || new Date().toISOString().substring(0, 10);

    const holdings = await client.agentStockHolding.findMany({
        where: {
            stock_code: stock_code,
            on_date: new Date(date)
        }
    });

    const ret = JSON.stringify(
        holdings,
        (key, value) => (typeof value === 'bigint' ? value.toString() : value) // return everything else unchanged
    )

    res.send(ret);
});

app.listen(port, () => {
    console.log(`server is listening on port ${port}`);
});
