import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-gray-400 py-8 mt-12">
      <div className="container mx-auto px-4 text-center">
        <p className="text-sm mb-2">
          &copy; {new Date().getFullYear()} Não Assine.
        </p>
        <p className="text-xs max-w-2xl mx-auto opacity-70">
          <strong>Aviso Legal:</strong> Esta ferramenta utiliza Inteligência Artificial para análise preliminar e educativa. 
          As informações fornecidas não substituem o aconselhamento de um advogado especializado. 
          Sempre consulte um profissional antes de tomar decisões legais vinculantes.
        </p>
      </div>
    </footer>
  );
};