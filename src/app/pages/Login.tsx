import React, { useState } from 'react';
import { useAzure } from '../context/AzureContext';
import { useNavigate } from 'react-router';
import { User, ArrowRight } from 'lucide-react';

export function Login() {
  const { login } = useAzure();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      login(username);
      navigate('/scan');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <div className="bg-white p-8 rounded-3xl shadow-lg border border-stone-100 text-center space-y-6">
        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <User size={32} />
        </div>
        
        <h1 className="text-2xl font-serif text-stone-900">Bem-vindo à ESTufa</h1>
        <p className="text-stone-500 text-sm">Entre para guardar as suas descobertas e partilhar com a comunidade.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Nome de Utilizador"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 pl-10 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
              required
            />
            <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
          </div>

          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 rounded-xl shadow-lg hover:shadow-green-200/50 transition-all flex items-center justify-center gap-2"
          >
            Entrar
            <ArrowRight size={18} />
          </button>
        </form>

        <p className="text-xs text-stone-400 mt-6">
          Esta é uma demonstração. Nenhuma senha é necessária.
        </p>
      </div>
    </div>
  );
}
