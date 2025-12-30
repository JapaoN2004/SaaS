import React, { useState } from 'react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { ContractInput } from '../components/ContractInput';
import { AnalysisResult } from '../components/AnalysisResult';
import { analyzeContractText } from '../services/geminiService';
import { AnalysisStatus, ContractAttachment } from '../types';
import { AlertTriangle, Shield, AlertOctagon, MessageSquareText } from 'lucide-react';

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
                    navigate('/pricing');
                    return;
                }

                const title = typeof content === 'string'
                    ? "Contrato de Texto"
                    : "Análise de Arquivo";

                const textContent = typeof content === 'string'
                    ? content
                    : "Conteúdo de arquivo (não salvo em texto plano no momento)";

                await saveAnalysis(user.id, title, textContent, result);
            } else {
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
        <div className="min-h-screen flex flex-col font-sans relative overflow-hidden">
            {/* Background Effects */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[128px] animate-float" style={{ animationDelay: '0s' }}></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[128px] animate-float" style={{ animationDelay: '3s' }}></div>
            </div>

            <Header />

            <main className="flex-grow container mx-auto px-4 py-12 md:py-24 relative z-10">
                <div className="max-w-5xl mx-auto">

                    {status === AnalysisStatus.IDLE && (
                        <div className="animate-fade-in-up">
                            {/* Hero Section */}
                            <div className="text-center mb-20 relative">
                                <div className="inline-flex items-center space-x-2 mb-8 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs font-bold tracking-widest uppercase shadow-[0_0_10px_rgba(59,130,246,0.2)] animate-glow">
                                    <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span>
                                    <span>Inteligência Artificial Jurídica</span>
                                </div>

                                <h2 className="text-5xl md:text-7xl font-bold text-white mb-8 tracking-tight leading-tight">
                                    Não Assine Sem Saber <br className="hidden md:block" />
                                    <span className="text-gradient">Onde Está Pisando.</span>
                                </h2>

                                <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
                                    A IA que lê as "letras miúdas" do seu contrato de aluguel e alerta sobre multas abusivas e armadilhas legais em segundos.
                                </p>
                            </div>

                            {/* Main Input Area */}
                            <div className="glass-panel p-2 rounded-2xl md:p-3 mb-24 transform hover:scale-[1.01] transition-transform duration-500">
                                <ContractInput onAnalyze={handleAnalyze} isLoading={false} />
                            </div>

                            {/* Features Grid */}
                            <div className="grid md:grid-cols-3 gap-8">
                                <div className="feature-card glass-card p-8 rounded-2xl relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 rounded-bl-full -mr-6 -mt-6 transition-transform group-hover:scale-110"></div>
                                    <div className="w-14 h-14 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl flex items-center justify-center mb-6 shadow-lg shadow-red-500/10 relative z-10 group-hover:scale-110 transition-transform duration-300">
                                        <Shield size={28} />
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-100 mb-3">Alertas de Perigo</h3>
                                    <p className="text-slate-400 leading-relaxed text-sm">
                                        Identificamos cláusulas <strong className="text-red-400 font-medium">ilegais</strong> ou abusivas que podem te custar caro no futuro.
                                    </p>
                                </div>

                                <div className="feature-card glass-card p-8 rounded-2xl relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-bl-full -mr-6 -mt-6 transition-transform group-hover:scale-110"></div>
                                    <div className="w-14 h-14 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-xl flex items-center justify-center mb-6 shadow-lg shadow-amber-500/10 relative z-10 group-hover:scale-110 transition-transform duration-300">
                                        <AlertOctagon size={28} />
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-100 mb-3">Pontos de Atenção</h3>
                                    <p className="text-slate-400 leading-relaxed text-sm">
                                        Destacamos regras rígidas, multas excessivas ou taxas que você <strong className="text-amber-400 font-medium">pode negociar</strong>.
                                    </p>
                                </div>

                                <div className="feature-card glass-card p-8 rounded-2xl relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-bl-full -mr-6 -mt-6 transition-transform group-hover:scale-110"></div>
                                    <div className="w-14 h-14 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-xl flex items-center justify-center mb-6 shadow-lg shadow-blue-500/10 relative z-10 group-hover:scale-110 transition-transform duration-300">
                                        <MessageSquareText size={28} />
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-100 mb-3">Ajuda na Negociação</h3>
                                    <p className="text-slate-400 leading-relaxed text-sm">
                                        Geramos uma mensagem pronta e educada para você enviar ao proprietário pedindo correções.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {status === AnalysisStatus.ANALYZING && (
                        <div className="py-20 animate-fade-in-up">
                            <div className="text-center mb-12">
                                <div className="inline-block p-4 rounded-full bg-blue-500/10 mb-6 relative">
                                    <div className="absolute inset-0 bg-blue-500/20 rounded-full animate-ping"></div>
                                    <Shield size={48} className="text-blue-400 animate-pulse" />
                                </div>
                                <h3 className="text-3xl font-bold text-white mb-3">Analisando seu contrato...</h3>
                                <p className="text-slate-400 text-lg">Nossa IA está lendo cada cláusula para garantir sua segurança.</p>
                            </div>
                            <div className="glass-panel p-4 rounded-2xl shadow-2xl shadow-blue-900/20">
                                <ContractInput onAnalyze={handleAnalyze} isLoading={true} />
                            </div>
                        </div>
                    )}

                    {status === AnalysisStatus.ERROR && (
                        <div className="max-w-2xl mx-auto w-full glass-card border-red-500/30 p-8 mb-8 text-center animate-shake">
                            <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6 border border-red-500/20">
                                <AlertTriangle size={32} />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">Ops! Algo deu errado.</h3>
                            <p className="text-red-400 mb-8 max-w-md mx-auto">{error}</p>
                            <button
                                onClick={() => setStatus(AnalysisStatus.IDLE)}
                                className="bg-red-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-red-500 transition-all shadow-lg hover:shadow-red-500/20 active:scale-95"
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
