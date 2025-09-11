const { optimize } = require('../index'); // adjust path if optimize is in another file

describe('optimize()', () => {
    const samplePlayers = [
        { name: 'QB1', position: 'QB', projPts: 20 },
        { name: 'RB1', position: 'RB', projPts: 18 },
        { name: 'RB2', position: 'RB', projPts: 15 },
        { name: 'WR1', position: 'WR', projPts: 17 },
        { name: 'WR2', position: 'WR', projPts: 16 },
        { name: 'TE1', position: 'TE', projPts: 10 },
        { name: 'K1', position: 'K', projPts: 8 },
        { name: 'DST1', position: 'DST', projPts: 7 },
        { name: 'FlexWR', position: 'WR', projPts: 14 }
    ];

    test('fills all starter slots', () => {
        const result = optimize(samplePlayers);
        const slots = result.starters.map(s => s.slot);
        expect(slots).toEqual(expect.arrayContaining(['QB', 'RB1', 'RB2', 'WR1', 'WR2', 'TE', 'K', 'DST', 'FLEX']));
    });

    test('does not reuse players', () => {
        const result = optimize(samplePlayers);
        const names = result.starters.map(s => s.pick.name);
        expect(new Set(names).size).toBe(names.length);
    });

    test('computes total projected correctly', () => {
        const result = optimize(samplePlayers);
        const sum = result.starters.reduce((acc, s) => acc + s.pick.projPts, 0);
        expect(result.totalProjected).toBe(sum);
    });
});