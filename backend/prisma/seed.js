const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const prisma = new PrismaClient();

async function main() {
    const players = JSON.parse(fs.readFileSync('players.json', 'utf-8'));
    await prisma.player.createMany({
        data: players,
        skipDuplicates: true
    });
    console.log(`Seeded ${players.length} players`);
}

main()
    .then(() => prisma.$disconnect())
    .catch(e => {
        console.error(e);
        prisma.$disconnect();
    });