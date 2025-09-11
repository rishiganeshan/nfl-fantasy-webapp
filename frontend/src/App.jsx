import { useState } from 'react';

function App() {
  const [playersText, setPlayersText] = useState(`[
  {"name":"Josh Allen","position":"QB","projPts":22.4},
  {"name":"Christian McCaffrey","position":"RB","projPts":20.1},
  {"name":"Saquon Barkley","position":"RB","projPts":16.8},
  {"name":"Tyreek Hill","position":"WR","projPts":19.0},
  {"name":"CeeDee Lamb","position":"WR","projPts":17.2},
  {"name":"Travis Kelce","position":"TE","projPts":15.3},
  {"name":"Jake Elliott","position":"K","projPts":8.2},
  {"name":"Cowboys","position":"DST","projPts":7.5},
  {"name":"George Kittle","position":"TE","projPts":11.0},
  {"name":"Raheem Mostert","position":"RB","projPts":12.1}
]`);
  const [result, setResult] = useState(null);
  const API = import.meta.env.VITE_API_URL;

  const optimize = async () => {
    try {
      const players = JSON.parse(playersText);
      const resp = await fetch(`${API}/optimize`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ players })
      });
      const data = await resp.json();
      setResult(data);
    } catch (e) {
      alert('Invalid JSON or server error. Check console.');
      console.error(e);
    }
  };

  return (
    <div style={{ maxWidth: 900, margin: '40px auto', fontFamily: 'system-ui' }}>
      <h1>NFL Fantasy Lineup Optimiser</h1>
      <p>Paste JSON array of players with: <code>name, position, projPts</code></p>
      <textarea
        style={{ width: '100%', height: 240, fontFamily: 'monospace' }}
        value={playersText}
        onChange={(e) => setPlayersText(e.target.value)}
      />
      <br />
      <button onClick={optimize} style={{ marginTop: 12 }}>Optimize</button>

      {result && (
        <div style={{ marginTop: 24 }}>
          <h2>Starters (Total: {result.totalProjected?.toFixed?.(2)})</h2>
          <table border="1" cellPadding="6">
            <thead>
              <tr><th>Slot</th><th>Name</th><th>Pos</th><th>Proj</th></tr>
            </thead>
            <tbody>
              {result.starters?.map(s => (
                <tr key={s.slot}>
                  <td>{s.slot}</td>
                  <td>{s.pick.name}</td>
                  <td>{s.pick.position}</td>
                  <td>{s.pick.projPts}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <h3 style={{ marginTop: 16 }}>Bench</h3>
          <ul>
            {result.bench?.map(p => (
              <li key={p.name}>{p.name} — {p.position} — {p.projPts}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;