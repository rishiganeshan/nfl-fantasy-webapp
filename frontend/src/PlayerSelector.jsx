import Select from "react-select";
import { useEffect, useState } from "react";

export default function PlayerSelector({ onAdd }) {
    const [options, setOptions] = useState([]);

    useEffect(() => {
        fetch(import.meta.env.VITE_API_URL + "/players")
            .then(r => r.json())
            .then(data => {
                setOptions(data.map(p => ({
                    value: p,
                    label: `${p.name} (${p.position}, ${p.projPts})`
                })));
            });
    }, []);

    return (
        <Select
            options={options}
            onChange={opt => onAdd(opt.value)}
            placeholder="Search players..."
        />
    );
}