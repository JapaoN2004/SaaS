import React from 'react';
import { ShieldCheck, UserCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

import { useAuth } from '../contexts/AuthContext';

export const Header: React.FC = () => {
  const { user } = useAuth();

  return (
    <header className="bg-brand-dark text-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-3 hover:opacity-90 transition-opacity">
          <div className="bg-blue-600 p-2 rounded-lg">
            <ShieldCheck size={32} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Não Assine</h1>
            <p className="text-xs text-blue-200 uppercase tracking-widest font-semibold">Proteção ao Inquilino</p>
          </div>
        </Link>
        <div className="flex items-center space-x-6">
          <div className="hidden md:block">
            <span className="text-sm text-gray-400">Lei do Inquilinato (No 8.245/91)</span>
          </div>

          {user ? (
            <div className="flex items-center space-x-4">
              <Link to="/history" className="text-sm font-medium text-blue-100 hover:text-white transition-colors">
                Histórico
              </Link>
              <Link to="/profile" className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors border border-blue-500">
                <UserCircle size={20} className="text-white" />
                <span className="text-sm font-medium max-w-[100px] truncate">{user.email?.split('@')[0]}</span>
              </Link>
            </div>
          ) : (
            <Link to="/login" className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition-colors">
              <UserCircle size={20} className="text-blue-300" />
              <span className="text-sm font-medium">Entrar</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};