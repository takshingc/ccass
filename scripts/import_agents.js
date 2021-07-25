const readCsv = require('../utils').readCsv;
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  const file_path = './metadata/hk_agents.csv';

  const agents = await readCsv(file_path);
  await create_agents(agents);
}

async function create_agents(data) {
  const agents = data.map(agent => Object.fromEntries([
    ['name', agent.participant_name],
    ['aid', agent.participant_id]
  ])
  )

  await prisma.agent.createMany({
    data: agents
  })
}

main()
  .catch(e => {
    throw e
  })
  .finally(async () => {
    await prisma.$disconnect()
  })