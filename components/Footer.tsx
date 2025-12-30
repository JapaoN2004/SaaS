import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-white/5 text-slate-500 py-8 mt-12 backdrop-blur-sm">
      <div className="container mx-auto px-4 text-center">
        <p className="text-sm mb-3 font-medium">
          &copy; {new Date().getFullYear()} Não Assine.
        </p>
        <p className="text-[10px] max-w-xl mx-auto opacity-60 leading-relaxed uppercase tracking-wide">
          <strong>Aviso Legal:</strong> Esta ferramenta utiliza Inteligência Artificial para análise preliminar e educativa.
          As informações fornecidas não substituem o aconselhamento de um advogado especializado.
        </p>
      </div>
    </footer>
  );
};