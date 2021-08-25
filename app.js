const express = require('express');
const cors = require('cors');
const path = require('path');

const { jsonify } = require('./utils.js');

const client = require('./db_client').client;
const HoldingService = require('./services/holding_service').HoldingService;
const StockService = require('./services/stock_service').StockService;

const app = express();
const holding_service = new HoldingService(client);
const stock_service = new StockService(client);

app.use(cors())

const port = 3000;

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/stock.html'));
})

app.get('/holding', async (req, res) => {
    let stock_code = req.query.stock_code || '6060';
    let date = req.query.date || new Date().toISOString().substring(0, 10);

    const holdings = await holding_service.where({
        stock_code: stock_code,
        on_date: new Date(date)
    });

    for (let holding of holdings) {
        defaultDict[holding.agent_id].push(holding.shares);
    };

    const ret = jsonify(holdings);

    res.send(ret);
});

app.get('/stock', async (req, res) => {
    let stock_code = req.query.code || '6060';
    let from_date = req.query.from_date || '2021-01-01';
    let to_date = req.query.to_date || new Date().toISOString().substring(0, 10);
    let agent_code = req.query.agent_code;

    let data = new DefaultDict(Array);
    let agents = {};

    // use holding_service
    let stock = await stock_service.first(
        { code: stock_code },
        {
            agent_holdings: {
                where: {
                    on_date: { gt: new Date(from_date), lte: new Date(to_date) },
                    shares: { gt: 100000 },
                    agent_id: agent_code
                },
                orderBy: [{ on_date: 'asc' }],
                include: {
                    agent: true
                }
            }
        }
    );

    for (let holding of stock.agent_holdings) {
        data[holding.agent_id].push({
            on_date: holding.on_date,
            shares: holding.shares
        });
        agents[holding.agent_id] = holding.agent.name;
    }

    let response_data = {};

    for (let agent of Object.keys(data)) {
        response_data[agent] = data[agent];
    };

    const ret = jsonify({
        agent_holdings: response_data,
        agents: agents
    });

    res.send(ret);
});

app.get('/agent', async (req, res) => {
    let stock_code = req.query.stock_code || '6060';

    const agents = await holding_service.query({
        where: {
            stock_code: stock_code
        },
        distinct: ['agent_id'],
        orderBy: [{ shares: 'desc' }],
        select: {
            agent_id: true
        }
    });

    res.json(agents.map(agent => agent['agent_id']));
});

app.listen(port, () => {
    console.log(`server is listening on port ${port}`);
});

class DefaultDict {
    constructor(defaultInit) {
        return new Proxy({}, {
            get: (target, name) => name in target ?
                target[name] :
                (target[name] = typeof defaultInit === 'function' ?
                    new defaultInit().valueOf() :
                    defaultInit)
        })
    }
}