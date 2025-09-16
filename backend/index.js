const express = require('express');
const cors = require('cors');
const PORT = process.env.PORT || 8080;

const app = express();

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    preflightContinue: false,
    optionsSuccessStatus: 204
}));
// app.use(cors)
// app.options('*', cors());

// Root route for EB health check
app.get('/', (_req, res) => res.send('ok'));


app.use(express.json({ limit: '1mb' }));

// --- simple greedy optimizer ---
function optimize(players) {
    const by = (pos) => players.filter(p => p.position === pos).sort((a, b) => b.projPts - a.projPts);

    const qb = by('QB');
    const rb = by('RB');
    const wr = by('WR');
    const te = by('TE');
    const k = by('K');
    const dst = by('DST');

    const starters = [];
    const take = (slot, list, idx = 0) => { if (list[idx]) starters.push({ slot, pick: list[idx] }); };

    take('QB', qb);
    take('TE', te);
    take('K', k);
    take('DST', dst);
    take('RB1', rb, 0);
    take('RB2', rb, 1);
    take('WR1', wr, 0);
    take('WR2', wr, 1);

    const used = new Set(starters.map(s => s.pick.name));
    const flexPool = players
        .filter(p => ['RB', 'WR', 'TE'].includes(p.position) && !used.has(p.name))
        .sort((a, b) => b.projPts - a.projPts);
    if (flexPool[0]) starters.push({ slot: 'FLEX', pick: flexPool[0] });

    const starterNames = new Set(starters.map(s => s.pick.name));
    const bench = players.filter(p => !starterNames.has(p.name));
    const totalProjected = starters.reduce((sum, s) => sum + (s.pick.projPts || 0), 0);

    return { starters, bench, totalProjected };
}

app.get('/health', (_req, res) => res.send('ok'));

app.post('/optimize', (req, res) => {
    try {
        const { week = 1, teamName = 'My Team', players = [] } = req.body || {};
        if (!Array.isArray(players) || players.length === 0) {
            return res.status(400).json({ error: 'Provide players: [{name, position, projPts}]' });
        }
        const normalized = players.map(p => ({
            name: String(p.name).trim(),
            position: String(p.position).toUpperCase(),
            projPts: Number(p.projPts)
        }));
        const result = optimize(normalized);
        res.json({ week, teamName, ...result });
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Internal error' });
    }
});



const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

app.get('/players', async (_req, res) => {
    try {
        const players = await prisma.player.findMany({
            orderBy: { name: 'asc' }
        });
        res.json(players);
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'DB error' });
    }
});

// app.get('/players', (_req, res) => {
//     const players = require('./players.json');
//     res.json(players);
// });

if (require.main === module) {
    app.listen(PORT, () => console.log(`API on http://localhost:${PORT}`));
}

module.exports = { app, optimize }; // make app & optimizer testable