class StockService {
  constructor(client) {
    this.client = client;
  }

  async first(query, include = null) {
    const stock = await this.client.stock.findFirst({ where: query, include: include });
    return stock;
  }

  async where(query, include = null) {
    const stocks = await this.client.stock.findMany({ where: query, include: include });
    return stocks;
  }

  async query(params) {
    const stocks = await this.client.stock.findMany(params);
    return stocks;
  }
}

exports.StockService = StockService;
