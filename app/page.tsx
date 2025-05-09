'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [name, setName] = useState('');
  const router = useRouter();

  const handleStart = () => {
    if (name.trim()) {
      router.push(`/vote?name=${encodeURIComponent(name)}`);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-matteBlack">
      <div className="max-w-md w-full text-center">
        <h1
          className="text-4xl font-bold mb-8"
          style={{ color: '#D4AF37' }}
        >
          Cérémonie des Oscars Interne
        </h1>
        <input
          type="text"
          placeholder="Entrez votre nom"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full mb-4 p-2 rounded"
        />
        <button
          onClick={handleStart}
          className="w-full py-2 font-semibold rounded"
          style={{ backgroundColor: '#D4AF37', color: '#121212' }}
        >
          Commencer le vote
        </button>
      </div>
    </div>
  );
}
