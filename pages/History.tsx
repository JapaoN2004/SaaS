import React, { useEffect, useState } from 'react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { useAuth } from '../contexts/AuthContext';
import { getUserHistory, AnalysisRecord } from '../services/historyService';
import { FileText, Calendar, ChevronRight, AlertCircle } from 'lucide-react';
import { AnalysisResult } from '../components/AnalysisResult';

export const History: React.FC = () => {
    const { user } = useAuth();
    const [history, setHistory] = useState<AnalysisRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedAnalysis, setSelectedAnalysis] = useState<AnalysisRecord | null>(null);

    useEffect(() => {
        if (user) {
            loadHistory();
        }
    }, [user]);

    const loadHistory = async () => {
        if (!user) return;
        try {
            const { data, error } = await getUserHistory(user.id);
            if (error) throw error;
            setHistory(data || []);
        } catch (err: any) {
            console.error(err);
            setError('Falha ao carregar o histórico. Verifique se você executou o script SQL no Supabase.');
        } finally {
            setLoading(false);
        }
    };

    if (selectedAnalysis) {
        return (
            <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
                <Header />
                <main className="flex-grow container mx-auto px-4 py-8">
                    <button
                        onClick={() => setSelectedAnalysis(null)}
                        className="mb-6 text-blue-600 hover:text-blue-800 flex items-center font-medium"
                    >
                        ← Voltar para o Histórico
                    </button>
                    <h2 className="text-2xl font-bold mb-4">{selectedAnalysis.contract_title || 'Análise de Contrato'}</h2>
                    <p className="text-sm text-gray-500 mb-6">Realizada em {new Date(selectedAnalysis.created_at).toLocaleDateString()}</p>

                    <AnalysisResult report={selectedAnalysis.analysis_report} onReset={() => setSelectedAnalysis(null)} />
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
            <Header />

            <main className="flex-grow container mx-auto px-4 py-8 md:py-12">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-3xl font-bold text-gray-900 mb-8">Histórico de Análises</h1>

                    {loading ? (
                        <div className="flex justify-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                        </div>
                    ) : error ? (
                        <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-lg flex items-center">
                            <AlertCircle size={20} className="mr-2" />
                            {error}
                        </div>
                    ) : history.length === 0 ? (
                        <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-100">
                            <FileText size={48} className="mx-auto text-gray-300 mb-4" />
                            <h3 className="text-lg font-medium text-gray-900">Nhuma análise encontrada</h3>
                            <p className="text-gray-500 mt-2">Comece a analisar seus contratos para vê-los aqui.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {history.map((item) => (
                                <div
                                    key={item.id}
                                    onClick={() => setSelectedAnalysis(item)}
                                    className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer flex items-center justify-between group"
                                >
                                    <div className="flex items-start space-x-4">
                                        <div className="bg-blue-50 p-3 rounded-lg group-hover:bg-blue-100 transition-colors">
                                            <FileText size={24} className="text-blue-600" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-900 mb-1">{item.contract_title || 'Contrato Sem Título'}</h3>
                                            <div className="flex items-center text-sm text-gray-500">
                                                <Calendar size={14} className="mr-1" />
                                                {new Date(item.created_at).toLocaleDateString()} às {new Date(item.created_at).toLocaleTimeString()}
                                            </div>
                                            <p className="text-xs text-gray-400 mt-2 line-clamp-1 max-w-md">
                                                {item.contract_content.substring(0, 100)}...
                                            </p>
                                        </div>
                                    </div>
                                    <ChevronRight size={20} className="text-gray-300 group-hover:text-blue-600 transition-colors" />
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
};
