import React from 'react';
import { ShieldCheck, UserCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

import { useAuth } from '../contexts/AuthContext';

export const Header: React.FC = () => {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-50 transition-all border-b border-white/5 glass-panel">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-3 hover:opacity-90 transition-opacity group">
          <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-2.5 rounded-xl shadow-lg shadow-blue-500/20 group-hover:shadow-blue-500/40 transition-all">
            <ShieldCheck size={28} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white/90">Não Assine</h1>
            <p className="text-[10px] text-blue-300 uppercase tracking-[0.2em] font-medium">Proteção ao Inquilino</p>
          </div>
        </Link>
        <div className="flex items-center space-x-6">
          <div className="hidden md:block">
            <span className="text-xs text-slate-400 font-medium tracking-wide border border-slate-700/50 px-3 py-1 rounded-full bg-slate-800/30">Lei do Inquilinato (No 8.245/91)</span>
          </div>

          {user ? (
            <div className="flex items-center space-x-4">
              <Link to="/history" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
                Histórico
              </Link>
              <Link to="/profile" className="flex items-center space-x-2 bg-slate-800/50 hover:bg-slate-800 hover:text-white px-4 py-2 rounded-lg transition-all border border-slate-700 group">
                <UserCircle size={20} className="text-blue-400 group-hover:text-blue-300 transition-colors" />
                <span className="text-sm font-medium text-slate-200 group-hover:text-white max-w-[100px] truncate">{user.email?.split('@')[0]}</span>
              </Link>
            </div>
          ) : (
            <Link to="/login" className="flex items-center space-x-2 bg-white/5 hover:bg-white/10 px-5 py-2 rounded-lg transition-all border border-white/5 hover:border-white/10">
              <UserCircle size={20} className="text-blue-400" />
              <span className="text-sm font-medium text-slate-200">Entrar</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};