'use client';
import { useState } from 'react';
import * as XLSX from 'xlsx';

type Row = { voter: string; category: string; selections: string[] };

export default function AdminPage() {
  const [pw, setPw] = useState('');
  const [authed, setAuthed] = useState(false);
  const [data, setData] = useState<Row[]>([]);
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    if (pw === process.env.NEXT_PUBLIC_ADMIN_PASSWORD) {
      setAuthed(true);
    } else {
      alert('Mot de passe incorrect');
    }
  };

  const fetchData = async () => {
    setLoading(true);
    const res = await fetch('/api/votes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: pw }),
    });
    if (res.ok) {
      const json = await res.json();
      setData(json);
    } else {
      alert('Erreur d’authentification');
    }
    setLoading(false);
  };

  const exportExcel = () => {
    const aoa = [
      ['Votant', 'Catégorie', 'Sélections'],
      ...data.map(r => [r.voter, r.category, r.selections.join(', ')]),
    ];
    const ws = XLSX.utils.aoa_to_sheet(aoa);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Résultats');
    XLSX.writeFile(wb, 'votes.xlsx');
  };

  if (!authed) {
    return (
      <div className="p-8">
        <h1 className="text-2xl mb-4">Admin Login</h1>
        <input
          type="password"
          placeholder="Mot de passe"
          value={pw}
          onChange={(e) => setPw(e.target.value)}
          className="border p-2 mr-2"
        />
        <button onClick={handleLogin} className="bg-gold p-2 rounded">
          Valider
        </button>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl mb-4">Dashboard des votes</h1>
      <button
        onClick={fetchData}
        className="bg-gold p-2 rounded mr-2"
        disabled={loading}
      >
        {loading ? 'Chargement…' : 'Rafraîchir'}
      </button>
      <button onClick={exportExcel} className="bg-gold p-2 rounded">
        Exporter Excel
      </button>
      <div className="overflow-auto mt-4">
        <table className="min-w-full border-collapse">
          <thead className="bg-matteBlack text-white">
            <tr>
              <th className="p-2 border">Votant</th>
              <th className="p-2 border">Catégorie</th>
              <th className="p-2 border">Sélections</th>
            </tr>
          </thead>
          <tbody>
            {data.map((r, i) => (
              <tr key={i} className={i % 2 ? 'bg-gray-100' : ''}>
                <td className="p-2 border">{r.voter}</td>
                <td className="p-2 border">{r.category}</td>
                <td className="p-2 border">{r.selections.join(', ')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
