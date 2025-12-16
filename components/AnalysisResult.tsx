import React, { useEffect, useRef } from 'react';
import { ArrowLeft, Copy, Check } from 'lucide-react';
import { ResultDisplayProps } from '../types';

// Declare marked on window interface since we load it via CDN
declare global {
  interface Window {
    marked: {
      parse: (text: string) => string;
    };
  }
}

export const AnalysisResult: React.FC<ResultDisplayProps> = ({ report, onReset }) => {
  const resultRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = React.useState(false);

  useEffect(() => {
    if (resultRef.current) {
      resultRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  const getHtml = (markdown: string) => {
    // Basic sanitization and parsing using marked from CDN
    if (window.marked) {
      return { __html: window.marked.parse(markdown) };
    }
    return { __html: markdown }; // Fallback
  };

  const copyToClipboard = () => {
    // Attempt to extract the "Mensagem para o dono" part
    const messageRegex = /## 💬 MENSAGEM PARA O DONO[\s\S]*?(?=##|$)/i;
    const match = report.match(messageRegex);
    
    let textToCopy = match ? match[0].replace('## 💬 MENSAGEM PARA O DONO', '').trim() : report;
    // Remove "Copy & Paste" instructions if present
    textToCopy = textToCopy.replace(/\(Copy & Paste\)/i, '').trim();

    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto w-full animate-fade-in" ref={resultRef}>
      <div className="mb-6 flex items-center justify-between">
         <button
          onClick={onReset}
          className="flex items-center text-blue-600 font-semibold hover:text-blue-800 transition-colors bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-200"
        >
          <ArrowLeft size={18} className="mr-2" />
          Analisar Outro Contrato
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
        <div className="p-8">
          
          {/* Markdown Content Renderer */}
          <div 
            className="prose prose-lg max-w-none 
              prose-headings:font-bold prose-headings:text-gray-900 
              prose-h1:text-3xl prose-h1:text-center prose-h1:mb-8 prose-h1:text-blue-800
              prose-h2:text-xl prose-h2:mt-8 prose-h2:mb-4 prose-h2:pb-2 prose-h2:border-b prose-h2:border-gray-200
              prose-ul:list-disc prose-ul:pl-6 prose-li:mb-2
              prose-p:text-gray-700 prose-p:leading-relaxed
              prose-strong:text-gray-900 prose-strong:font-bold
            "
            dangerouslySetInnerHTML={getHtml(report)}
          />

          {/* Copy Message Action Area */}
          <div className="mt-10 bg-gray-50 rounded-xl p-6 border border-gray-200 flex flex-col md:flex-row items-center justify-between">
            <div className="mb-4 md:mb-0">
              <h4 className="font-bold text-gray-900 text-lg">Precisa negociar?</h4>
              <p className="text-gray-600 text-sm">Copie a mensagem sugerida para enviar ao proprietário/imobiliária.</p>
            </div>
            <button
              onClick={copyToClipboard}
              className={`flex items-center px-6 py-3 rounded-lg font-bold text-white transition-all transform active:scale-95 shadow-md ${
                copied ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {copied ? (
                <>
                  <Check size={20} className="mr-2" />
                  Copiado!
                </>
              ) : (
                <>
                  <Copy size={20} className="mr-2" />
                  Copiar Mensagem Sugerida
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
