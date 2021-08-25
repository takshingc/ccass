class HoldingService {
  constructor(client) {
    this.client = client;
  }

  async first(query, include = null) {
    const holdings = await this.client.agentStockHolding.findFirst({ where: query, include: include });
    return holdings;
  }

  async where(query, include = null) {
    const holdings = await this.client.agentStockHolding.findMany({ where: query, include: include });
    return holdings;
  }

  async query(params) {
    const holdings = await this.client.agentStockHolding.findMany(params);
    return holdings;
  }
}

exports.HoldingService = HoldingService;
