import React from 'react';
import { Check, Shield, Zap, Star, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../services/supabase';


export default function Pricing() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [loading, setLoading] = React.useState(false);

    const handleSubscribe = async () => {
        setLoading(true);
        try {
            if (!user) {
                navigate('/login');
                return;
            }

            const priceId = import.meta.env.VITE_STRIPE_PRICE_ID?.trim();
            if (!priceId) {
                alert("Erro de configuração: Price ID não encontrado.");
                return;
            }

            const { data, error } = await supabase.functions.invoke('create-checkout', {
                body: { priceId }
            });

            if (error) throw error;

            if (data?.error) {
                throw new Error("Backend Error: " + data.error);
            }

            if (data?.url) {
                window.location.href = data.url;
            } else {
                throw new Error("Não foi possível gerar o link de pagamento.");
            }

        } catch (err: any) {
            console.error(err);
            alert("Erro ao iniciar pagamento: " + (err.message || "Tente novamente."));
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white font-sans selection:bg-cyan-500/30">
            {/* Navbar Simples */}
            <nav className="border-b border-white/5 bg-white/5 backdrop-blur-md sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <button onClick={() => navigate('/')} className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500 hover:opacity-80 transition-opacity">
                        NãoAssine
                    </button>
                </div>
            </nav>

            <div className="max-w-7xl mx-auto px-6 py-20">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-sm font-medium mb-6">
                        <Star className="w-4 h-4" />
                        <span>Plano Premium</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight leading-tight">
                        Desbloqueie o poder da <br />
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-600">
                            Análise Jurídica Completa
                        </span>
                    </h1>
                    <p className="text-lg text-slate-300 mb-8 leading-relaxed">
                        Garanta sua segurança jurídica. Nossa IA analisa minuciosamente cada cláusula,
                        identificando riscos que podem custar milhares de reais no futuro.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto items-center">

                    {/* Free Plan (Visual Anchor) */}
                    <div className="p-8 rounded-3xl border border-white/5 bg-slate-800/50 backdrop-blur-sm hover:border-white/10 transition-colors">
                        <h3 className="text-xl font-semibold text-white mb-2">Básico</h3>
                        <div className="flex items-baseline gap-1 mb-6">
                            <span className="text-4xl font-bold">R$0</span>
                            <span className="text-slate-400">/mês</span>
                        </div>
                        <ul className="space-y-4 mb-8">
                            <li className="flex items-center gap-3 text-slate-300">
                                <Check className="w-5 h-5 text-slate-500" />
                                <span>Preview básico do contrato</span>
                            </li>
                            <li className="flex items-center gap-3 text-slate-300">
                                <Check className="w-5 h-5 text-slate-500" />
                                <span>Identificação de partes</span>
                            </li>
                            <li className="flex items-center gap-3 text-slate-500 line-through decoration-slate-600">
                                <Shield className="w-5 h-5 text-slate-700" />
                                <span>Análise de Risco Completa</span>
                            </li>
                            <li className="flex items-center gap-3 text-slate-500 line-through decoration-slate-600">
                                <Zap className="w-5 h-5 text-slate-700" />
                                <span>Recomendações de IA</span>
                            </li>
                        </ul>
                        <button onClick={() => navigate('/')} className="w-full py-4 rounded-xl border border-white/10 text-white font-semibold hover:bg-white/5 transition-all">
                            Voltar ao Início
                        </button>
                    </div>

                    {/* Pro Plan - Highlighted */}
                    <div className="relative p-1 rounded-3xl bg-gradient-to-b from-cyan-500 to-blue-600 shadow-2xl shadow-cyan-900/20">
                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-4 py-1 rounded-full text-sm font-bold tracking-wide shadow-lg">
                            MAIS POPULAR
                        </div>
                        <div className="bg-slate-900 rounded-[22px] p-8 h-full">
                            <h3 className="text-xl font-semibold text-white mb-2">Pro Protection</h3>
                            <div className="flex items-baseline gap-1 mb-6">
                                <span className="text-5xl font-bold text-white">R$29</span>
                                <span className="text-slate-400">/mês</span>
                            </div>
                            <p className="text-slate-400 text-sm mb-6">
                                Cancele quando quiser. Sem fidelidade.
                            </p>
                            <div className="h-px bg-white/10 mb-6" />
                            <ul className="space-y-4 mb-8">
                                <li className="flex items-center gap-3 text-white">
                                    <div className="p-1 rounded-full bg-cyan-500/20 text-cyan-400">
                                        <Check className="w-4 h-4" />
                                    </div>
                                    <span className="font-medium">Análise Ilimitada de Contratos</span>
                                </li>
                                <li className="flex items-center gap-3 text-white">
                                    <div className="p-1 rounded-full bg-cyan-500/20 text-cyan-400">
                                        <Shield className="w-4 h-4" />
                                    </div>
                                    <span className="font-medium">Relatórios Detalhados de Risco</span>
                                </li>
                                <li className="flex items-center gap-3 text-white">
                                    <div className="p-1 rounded-full bg-cyan-500/20 text-cyan-400">
                                        <Zap className="w-4 h-4" />
                                    </div>
                                    <span className="font-medium">Sugestões de Alteração</span>
                                </li>
                                <li className="flex items-center gap-3 text-white">
                                    <div className="p-1 rounded-full bg-cyan-500/20 text-cyan-400">
                                        <Star className="w-4 h-4" />
                                    </div>
                                    <span className="font-medium">Suporte Prioritário</span>
                                </li>
                            </ul>
                            <button
                                onClick={handleSubscribe}
                                disabled={loading}
                                className="w-full py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-lg hover:shadow-lg hover:shadow-cyan-500/25 transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
                            >
                                {loading ? <Loader2 className="animate-spin" /> : "Assinar Agora"}
                            </button>
                        </div>
                    </div>
                </div>

                <div className="mt-20 text-center">
                    <p className="text-slate-500 text-sm">
                        Pagamento processado com segurança via Stripe. Seus dados estão protegidos.
                    </p>
                </div>
            </div>
        </div>
    );
}
