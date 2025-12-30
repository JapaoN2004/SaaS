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
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 to-slate-100 font-sans text-gray-800">
            <Header />

            <main className="flex-grow container mx-auto px-4 py-12 md:py-20">
                <div className="max-w-5xl mx-auto">

                    {status === AnalysisStatus.IDLE && (
                        <div className="animate-fade-in-up">
                            {/* Hero Section */}
                            <div className="text-center mb-16 relative">
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-400/20 rounded-full blur-3xl -z-10"></div>
                                <div className="inline-block mb-4 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-sm font-semibold tracking-wide uppercase shadow-sm">
                                    Inteligência Artificial Jurídica
                                </div>
                                <h2 className="text-5xl md:text-7xl font-extrabold text-slate-900 mb-6 tracking-tight leading-tight">
                                    Não Assine Sem Saber <br className="hidden md:block" />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Onde Está Pisando.</span>
                                </h2>
                                <p className="text-xl md:text-2xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
                                    A IA que lê as "letras miúdas" do seu contrato de aluguel e alerta sobre multas abusivas e armadilhas legais em segundos.
                                </p>
                            </div>

                            {/* Main Input Area */}
                            <div className="glass-panel p-1 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 md:p-2 mb-20 bg-white/50 border-white/50 border">
                                <ContractInput onAnalyze={handleAnalyze} isLoading={false} />
                            </div>

                            {/* Features Grid */}
                            <div className="grid md:grid-cols-3 gap-8">
                                <div className="feature-card bg-white p-8 rounded-2xl shadow-lg border border-slate-100 relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 w-24 h-24 bg-red-50 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
                                    <div className="w-14 h-14 bg-red-100 text-red-600 rounded-xl flex items-center justify-center mb-6 text-3xl shadow-sm relative z-10">
                                        🛡️
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900 mb-3">Alertas de Perigo</h3>
                                    <p className="text-slate-600 leading-relaxed">
                                        Identificamos cláusulas <strong className="text-red-600">ilegais</strong> ou abusivas que podem te custar caro no futuro.
                                    </p>
                                </div>

                                <div className="feature-card bg-white p-8 rounded-2xl shadow-lg border border-slate-100 relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 w-24 h-24 bg-yellow-50 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
                                    <div className="w-14 h-14 bg-yellow-100 text-yellow-600 rounded-xl flex items-center justify-center mb-6 text-3xl shadow-sm relative z-10">
                                        ⚠️
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900 mb-3">Pontos de Atenção</h3>
                                    <p className="text-slate-600 leading-relaxed">
                                        Destacamos regras rígidas, multas excessivas ou taxas que você <strong className="text-yellow-600">pode negociar</strong>.
                                    </p>
                                </div>

                                <div className="feature-card bg-white p-8 rounded-2xl shadow-lg border border-slate-100 relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
                                    <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-6 text-3xl shadow-sm relative z-10">
                                        💬
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900 mb-3">Ajuda na Negociação</h3>
                                    <p className="text-slate-600 leading-relaxed">
                                        Geramos uma mensagem pronta e educada para você enviar ao proprietário pedindo correções.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {status === AnalysisStatus.ANALYZING && (
                        <div className="py-12 animate-fade-in-up">
                            <div className="text-center mb-8">
                                <h3 className="text-2xl font-bold text-slate-800 mb-2">Analisando seu contrato...</h3>
                                <p className="text-slate-500">Estamos lendo cada cláusula para garantir sua segurança.</p>
                            </div>
                            <div className="glass-panel p-2 rounded-2xl shadow-lg bg-white/50">
                                <ContractInput onAnalyze={handleAnalyze} isLoading={true} />
                            </div>
                        </div>
                    )}

                    {status === AnalysisStatus.ERROR && (
                        <div className="max-w-2xl mx-auto w-full bg-red-50 border border-red-200 rounded-2xl p-8 mb-8 text-center animate-shake shadow-sm">
                            <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                <AlertTriangle size={32} />
                            </div>
                            <h3 className="text-xl font-bold text-red-900 mb-2">Ops! Algo deu errado.</h3>
                            <p className="text-red-700 mb-6 max-w-md mx-auto">{error}</p>
                            <button
                                onClick={() => setStatus(AnalysisStatus.IDLE)}
                                className="bg-red-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-red-700 transition-all shadow-md hover:shadow-lg active:scale-95"
                            >
                                Tentar Novamente
                            </button>
                        </div>
                    )}

                    {status === AnalysisStatus.SUCCESS && (
                        <div className="animate-fade-in-up">
                            <AnalysisResult report={report} onReset={handleReset} />
                        </div>
                    )}

                </div>
            </main>

            <Footer />
        </div>
    );
};
