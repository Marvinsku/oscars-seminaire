'use client';
import { useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { firestore } from '../../lib/firebase';
import { collection, addDoc, Timestamp } from 'firebase/firestore';

const categories = [ /* vos 12 catégories */ ];
const participants = [ /* vos 30 noms */ ];

export default function VotePage() {
  const params = useSearchParams();
  const voter = params.get('name') || '';
  const [votes, setVotes] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const init = {};
    categories.forEach(c => (init[c] = []));
    setVotes(init);
  }, []);

  const toggle = (cat, p) => {
    setVotes(prev => {
      const arr = prev[cat] || [];
      return { ...prev, [cat]: arr.includes(p) ? arr.filter(x=>x!==p) : [...arr,p] };
    });
  };

  const submit = async () => {
    setSubmitting(true);
    try {
      await addDoc(collection(firestore, 'votes'), { voter, votes, createdAt: Timestamp.now() });
      setDone(true);
    } catch {
      alert('Erreur');
    }
  };

  if (done) return <div className="min-h-screen flex items-center justify-center"><h2>Merci {voter} !</h2></div>;

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <h1 style={{color:'#D4AF37'}}>Bonjour {voter}, faites vos choix :</h1>
      <form>
        {categories.map(cat => (
          <fieldset key={cat}>
            <legend>Oscar du {cat}</legend>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {participants.map(p => (
                <label key={p}>
                  <input
                    type="checkbox"
                    checked={votes[cat]?.includes(p)||false}
                    onChange={()=>toggle(cat,p)}
                  />
                  {p}
                </label>
              ))}
            </div>
          </fieldset>
        ))}
        <button onClick={submit} disabled={submitting}>
          {submitting?'Envoi…':'Valider mes votes'}
        </button>
      </form>
    </div>
  );
}
