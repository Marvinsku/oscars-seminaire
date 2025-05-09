'use client';
export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import { firestore } from '../../lib/firebase';
import { collection, addDoc, Timestamp } from 'firebase/firestore';

const categories = [
  'Fashion Week Interne',
  "Râlage d’Excellence",
  'Maître de l’Humour',
  'Micro Toujours Ouvert',
  'Meilleur Partageur de Calories',
  'Même le vent respecte sa coiffure',
  'Rayon de Soleil du Service',
  "Mode Avion Jusqu’à 10h",
  "Dossier le plus Rapide de l’Ouest",
  'Meilleur Duo',
  'Acteur dans un Rôle de Calme Absolu',
  'Je Gère Tout et Même le Reste',
];

const participants = [
  /* vos 30 noms ici, comme avant */
];

export default function VotePage() {
  const [voter, setVoter] = useState('');
  const [votes, setVotes] = useState<Record<string, string[]>>({});
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  // on récupère le paramètre ?name=… depuis window
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const name = params.get('name');
    if (name) setVoter(name);
  }, []);

  // initialisation du state votes
  useEffect(() => {
    const init: Record<string, string[]> = {};
    categories.forEach((c) => (init[c] = []));
    setVotes(init);
  }, []);

  const toggle = (cat: string, p: string) => {
    setVotes((prev) => {
      const arr = prev[cat] ?? [];
      return {
        ...prev,
        [cat]: arr.includes(p)
          ? arr.filter((x) => x !== p)
          : [...arr, p],
      };
    });
  };

  const submit = async () => {
    setSubmitting(true);
    const docRef = await addDoc(collection(firestore, 'votes'), {
      voter,
      votes,
      createdAt: Timestamp.now(),
    });
    if (docRef.id) setDone(true);
    setSubmitting(false);
  };

  if (done) {
    return (
      <div className="p-8 text-center">
        <h2 style={{ color: '#D4AF37' }}>Merci pour votre vote !</h2>
      </div>
    );
  }

  return (
    <div className="p-4 bg-matteBlack min-h-screen">
      <h2 className="text-2xl font-semibold mb-4" style={{ color: '#D4AF37' }}>
        Bonjour, {voter}
      </h2>
      <form>
        {categories.map((cat) => (
          <fieldset key={cat} className="mb-6 border p-3 rounded">
            <legend className="font-bold mb-2" style={{ color: '#D4AF37' }}>
              Oscar du {cat}
            </legend>
            <div className="grid grid-cols-2 gap-2">
              {participants.map((p) => (
                <label key={p} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={votes[cat]?.includes(p) || false}
                    onChange={() => toggle(cat, p)}
                  />
                  <span className="text-sm">{p}</span>
                </label>
              ))}
            </div>
          </fieldset>
        ))}
        <button
          type="button"
          onClick={submit}
          disabled={submitting}
          className="py-2 px-4 rounded font-semibold"
          style={{ backgroundColor: '#D4AF37', color: '#121212' }}
        >
          {submitting ? 'Envoi…' : 'Valider mes votes'}
        </button>
      </form>
    </div>
  );
}
