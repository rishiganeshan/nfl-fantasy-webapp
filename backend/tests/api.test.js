const request = require('supertest');
const { app } = require('../index'); // ensure you export app in index.js

describe('API routes', () => {
    test('GET /health returns ok', async () => {
        const res = await request(app).get('/health');
        expect(res.statusCode).toBe(200);
        expect(res.text).toBe('ok');
    });

    test('POST /optimize returns starters and bench', async () => {
        const players = [
            { name: 'QB1', position: 'QB', projPts: 20 },
            { name: 'RB1', position: 'RB', projPts: 18 },
            { name: 'RB2', position: 'RB', projPts: 15 },
            { name: 'WR1', position: 'WR', projPts: 17 },
            { name: 'WR2', position: 'WR', projPts: 16 },
            { name: 'TE1', position: 'TE', projPts: 10 },
            { name: 'K1', position: 'K', projPts: 8 },
            { name: 'DST1', position: 'DST', projPts: 7 },
            { name: 'FlexRB', position: 'RB', projPts: 12 }
        ];
        const res = await request(app)
            .post('/optimize')
            .send({ players })
            .set('Content-Type', 'application/json');

        expect(res.statusCode).toBe(200);
        expect(res.body.starters).toBeDefined();
        expect(res.body.bench).toBeDefined();
        expect(res.body.totalProjected).toBeGreaterThan(0);
    });
});