import React, { useState, useRef } from 'react';
import { Upload, FileText, Search, AlertCircle, X, FileType } from 'lucide-react';
import { ContractInputProps, ContractAttachment } from '../types';

export const ContractInput: React.FC<ContractInputProps> = ({ onAnalyze, isLoading }) => {
  const [text, setText] = useState('');
  const [fileName, setFileName] = useState<string | null>(null);
  const [attachment, setAttachment] = useState<ContractAttachment | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    // If user starts typing, we clear the file attachment to avoid confusion
    if (attachment) {
      setAttachment(null);
      setFileName(null);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      
      // Check if it is a text file or binary (PDF/Image)
      const isText = file.type === 'text/plain' || file.name.endsWith('.txt') || file.name.endsWith('.md');

      if (isText) {
        reader.onload = (event) => {
          const content = event.target?.result as string;
          setText(content);
          setFileName(file.name);
          setAttachment(null);
        };
        reader.readAsText(file);
      } else {
        // Handle PDF or Images
        reader.onload = (event) => {
          const result = event.target?.result as string;
          // Extract base64 part
          const base64Data = result.split(',')[1];
          
          setAttachment({
            mimeType: file.type,
            data: base64Data
          });
          setFileName(file.name);
          setText(''); // Clear text input when file is attached
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const clearFile = () => {
    setAttachment(null);
    setFileName(null);
    setText('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (attachment) {
      onAnalyze(attachment);
    } else if (text.trim().length >= 50) {
      onAnalyze(text);
    }
  };

  const isSubmitDisabled = isLoading || (!attachment && text.trim().length < 50);

  return (
    <div className="max-w-4xl mx-auto w-full">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
        <div className="p-8 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
          <h2 className="text-3xl font-bold mb-2">Analise seu Contrato</h2>
          <p className="text-blue-100 text-lg">
            Cole o texto, envie um PDF ou imagens do contrato para descobrir cláusulas abusivas e riscos ocultos.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-8">
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <label htmlFor="contract-text" className="block text-sm font-semibold text-gray-700">
                Conteúdo do Contrato
              </label>
              <div className="flex space-x-2">
                {fileName && (
                   <button
                    type="button"
                    onClick={clearFile}
                    className="text-sm text-red-500 hover:text-red-700 font-medium flex items-center transition-colors"
                  >
                    <X size={16} className="mr-1" />
                    Remover arquivo
                  </button>
                )}
                <button
                  type="button"
                  onClick={triggerFileUpload}
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center transition-colors"
                >
                  <Upload size={16} className="mr-1" />
                  {fileName ? 'Trocar arquivo' : 'Carregar PDF/Imagem/Texto'}
                </button>
              </div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".txt,.md,.pdf,.png,.jpg,.jpeg,.webp"
                className="hidden"
              />
            </div>
            
            <div className="relative">
              {attachment ? (
                <div className="w-full h-64 border-2 border-dashed border-blue-300 bg-blue-50 rounded-lg flex flex-col items-center justify-center text-blue-800">
                   <FileType size={48} className="mb-4 text-blue-500" />
                   <h3 className="text-lg font-bold mb-1">{fileName}</h3>
                   <span className="text-sm text-blue-600 uppercase font-semibold tracking-wider bg-blue-100 px-3 py-1 rounded-full">
                     {attachment.mimeType.split('/')[1] || 'Arquivo'}
                   </span>
                   <p className="mt-4 text-sm text-blue-400">Arquivo pronto para análise pela IA</p>
                </div>
              ) : (
                <textarea
                  id="contract-text"
                  value={text}
                  onChange={handleTextChange}
                  placeholder="Cole o texto do contrato aqui..."
                  className="w-full h-64 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none text-gray-800 text-sm font-mono leading-relaxed"
                  disabled={isLoading}
                />
              )}
              
              {!attachment && fileName && (
                <div className="absolute bottom-4 right-4 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-medium border border-blue-200 flex items-center">
                  <FileText size={12} className="mr-1" />
                  Lendo texto: {fileName}
                </div>
              )}
            </div>
            <p className="mt-2 text-xs text-gray-500 flex items-center">
              <AlertCircle size={12} className="mr-1" />
              Seus dados não são armazenados. A análise é feita em tempo real pela IA. Suporta PDF, Imagens e Texto.
            </p>
          </div>

          <button
            type="submit"
            disabled={isSubmitDisabled}
            className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center transition-all transform hover:scale-[1.01] shadow-lg ${
              isSubmitDisabled
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-brand-primary hover:bg-blue-700 text-white'
            }`}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Analisando com IA Jurídica...
              </>
            ) : (
              <>
                <Search size={20} className="mr-2" />
                Analisar Riscos Agora
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};