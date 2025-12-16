import React, { useState } from 'react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { ContractInput } from '../components/ContractInput';
import { AnalysisResult } from '../components/AnalysisResult';
import { analyzeContractText } from '../services/geminiService';
import { AnalysisStatus, ContractAttachment } from '../types';
import { AlertTriangle } from 'lucide-react';

import { saveAnalysis } from '../services/historyService';
import { useAuth } from '../contexts/AuthContext';
import { checkSubscriptionStatus } from '../services/subscriptionService';
import { useNavigate } from 'react-router-dom';


export const Home: React.FC = () => {
    const { user } = useAuth();
    const [status, setStatus] = useState<AnalysisStatus>(AnalysisStatus.IDLE);
    const [report, setReport] = useState<string>('');
    const [error, setError] = useState<string>('');
    const navigate = useNavigate();

    const handleAnalyze = async (content: string | ContractAttachment) => {
        setStatus(AnalysisStatus.ANALYZING);
        setError('');

        try {
            // 1. First, get the analysis result (let them wait/see the loading)
            const result = await analyzeContractText(content);

            // 2. Check Subscription before revealing
            if (user) {
                const isSubscribed = await checkSubscriptionStatus(user.id);
                if (!isSubscribed) {
                    // Save draft or something? For now, just redirect or show gating.
                    // Let's redirect to Pricing, maybe passing state so they know why.
                    // Or we could have a "Gated" status.
                    // Let's try redirecting for now as per plan Step 2.
                    navigate('/pricing');
                    return;
                }

                // Save to history if user is logged in AND subscribed
                // Simple title extraction or default
                const title = typeof content === 'string'
                    ? "Contrato de Texto"
                    : "Análise de Arquivo"; // Filename not available in current type definition

                const textContent = typeof content === 'string'
                    ? content
                    : "Conteúdo de arquivo (não salvo em texto plano no momento)"; // TODO: Extract text from file for storage if needed

                await saveAnalysis(user.id, title, textContent, result);
            } else {
                // Guest user? Maybe limit them or force login.
                // For now, let's assume guests need to login to subscribe.
                navigate('/login');
                return;
            }

            setReport(result);
            setStatus(AnalysisStatus.SUCCESS);

        } catch (err: any) {
            setError(err.message || "Ocorreu um erro desconhecido.");
            setStatus(AnalysisStatus.ERROR);
        }
    };


    const handleReset = () => {
        setStatus(AnalysisStatus.IDLE);
        setReport('');
        setError('');
    };

    return (
        <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
            <Header />

            <main className="flex-grow container mx-auto px-4 py-8 md:py-12">
                <div className="max-w-5xl mx-auto">

                    {status === AnalysisStatus.IDLE && (
                        <div className="animate-fade-in-up">
                            <div className="text-center mb-10">
                                <h2 className="text-4xl md:text-5xl font-extrabold text-brand-dark mb-4 tracking-tight">
                                    Não Assine Sem Saber <span className="text-blue-600">Onde Está Pisando.</span>
                                </h2>
                                <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                                    A inteligência artificial que lê as "letras miúdas" do seu contrato de aluguel e alerta sobre multas abusivas e armadilhas legais.
                                </p>
                            </div>
                            <ContractInput onAnalyze={handleAnalyze} isLoading={false} />

                            {/* Features Grid */}
                            <div className="grid md:grid-cols-3 gap-6 mt-16 text-center">
                                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">🔴</div>
                                    <h3 className="font-bold text-gray-900 mb-2">Alertas Vermelhos</h3>
                                    <p className="text-gray-500 text-sm">Identificamos cláusulas ilegais ou abusivas que podem te custar caro.</p>
                                </div>
                                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                                    <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">🟡</div>
                                    <h3 className="font-bold text-gray-900 mb-2">Pontos de Atenção</h3>
                                    <p className="text-gray-500 text-sm">Destacamos regras rígidas ou taxas que você pode (e deve) negociar.</p>
                                </div>
                                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">💬</div>
                                    <h3 className="font-bold text-gray-900 mb-2">Negociação Pronta</h3>
                                    <p className="text-gray-500 text-sm">Geramos uma mensagem pronta para você enviar ao proprietário.</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {status === AnalysisStatus.ANALYZING && (
                        <ContractInput onAnalyze={handleAnalyze} isLoading={true} />
                    )}

                    {status === AnalysisStatus.ERROR && (
                        <div className="max-w-4xl mx-auto w-full bg-red-50 border border-red-200 rounded-xl p-6 mb-8 text-center animate-shake">
                            <AlertTriangle className="mx-auto text-red-500 mb-3" size={48} />
                            <h3 className="text-lg font-bold text-red-800 mb-2">Ops! Algo deu errado.</h3>
                            <p className="text-red-600 mb-6">{error}</p>
                            <button
                                onClick={() => setStatus(AnalysisStatus.IDLE)}
                                className="bg-red-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-red-700 transition-colors"
                            >
                                Tentar Novamente
                            </button>
                        </div>
                    )}

                    {status === AnalysisStatus.SUCCESS && (
                        <AnalysisResult report={report} onReset={handleReset} />
                    )}

                </div>
            </main>

            <Footer />
        </div>
    );
};
