'use client';
export const dynamic = 'force-dynamic';
import { useSearchParams } from 'next/navigation';
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
  'Mode Avion Jusqu’à 10h',
  'Dossier le plus Rapide de l’Ouest',
  'Meilleur Duo',
  'Acteur dans un Rôle de Calme Absolu',
  'Je Gère Tout et Même le Reste',
];

const participants = [
  'JULIE','CORALIE','EDWIGE','FLORENCE','VALERIE','RAPHAELLE','CAROLE MLD','PATRICIA P',
  'MATHIEU','VANESSA','CHARLES','CLEMENCE','THOMAS','SABRINA','ANGELIQUE','LYDIA',
  'CAROLE MPT','HALIMA','PATRICIA S','DALILA','CHRISTOPHE','ELODIE','SOPHEA','NESRINE',
  'AMANAR','YACINE','AUDREY','MARVIN','ZAHIA'
];

export default function VotePage() {
  const params = useSearchParams();
  const voter = params.get('name') || '';
  const [votes, setVotes] = useState<Record<string,string[]>>({});
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const init: Record<string,string[]> = {};
    categories.forEach(c => (init[c] = []));
    setVotes(init);
  }, []);

  const toggle = (cat: string, p: string) => {
    setVotes(prev => {
      const arr = prev[cat] || [];
      return { ...prev, [cat]: arr.includes(p) ? arr.filter(x=>x!==p) : [...arr,p] };
    });
  };

  const submit = async () => {
    if (submitting) return;
    setSubmitting(true);
    try {
      await addDoc(collection(firestore, 'votes'), { voter, votes, createdAt: Timestamp.now() });
      setDone(true);
    } catch {
      alert('Erreur lors de l’envoi');
    } finally {
      setSubmitting(false);
    }
  };

  if (done) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h2 className="text-2xl font-bold">Merci pour votre participation, {voter} !</h2>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-4" style={{ color: '#D4AF37' }}>
        Bonjour {voter}, faites vos choix :
      </h1>
      <form>
        {categories.map(cat => (
          <fieldset key={cat} className="mb-6">
            <legend className="font-semibold mb-2">Oscar du {cat}</legend>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {participants.map(p => (
                <label key={p} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={votes[cat]?.includes(p) || false}
                    onChange={() => toggle(cat, p)}
                    className="w-4 h-4"
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
          className="mt-4 px-6 py-3 rounded font-semibold"
          style={{ backgroundColor: '#D4AF37', color: '#121212' }}
        >
          {submitting ? 'Envoi…' : 'Valider mes votes'}
        </button>
      </form>
    </div>
  );
}
