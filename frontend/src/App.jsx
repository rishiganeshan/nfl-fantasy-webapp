import { useState } from "react";
import PlayerSelector from "./PlayerSelector";

function App() {
  const [roster, setRoster] = useState([]);
  const [result, setResult] = useState(null);

  const addPlayer = (player) => {
    setRoster([...roster, player]);
  };

  const optimize = async () => {
    const resp = await fetch(import.meta.env.VITE_API_URL + "/optimize", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ players: roster })
    });
    const data = await resp.json();
    setResult(data);
  };

  return (
    <div style={{ maxWidth: 900, margin: "40px auto", fontFamily: "system-ui" }}>
      <h1>NFL Fantasy Lineup Optimiser</h1>

      <PlayerSelector onAdd={addPlayer} />

      <h2>Roster</h2>
      <ul>
        {roster.map((p, idx) => (
          <li key={idx}>{p.name} — {p.position} — {p.projPts}</li>
        ))}
      </ul>

      <button onClick={optimize} disabled={!roster.length}>Optimize</button>

      {result && (
        <div style={{ marginTop: 24 }}>
          <h2>Starters (Total: {result.totalProjected?.toFixed(2)})</h2>
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

          <h3>Bench</h3>
          <ul>
            {result.bench?.map((p, idx) => (
              <li key={idx}>{p.name} — {p.position} — {p.projPts}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;