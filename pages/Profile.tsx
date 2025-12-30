import React from 'react';
import { User, LogOut, Shield, Mail, Hash, Activity } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';

export const Profile: React.FC = () => {
    const { user, signOut } = useAuth();
    const navigate = useNavigate();

    const handleSignOut = async () => {
        try {
            await signOut();
            navigate('/login');
        } catch (error) {
            console.error('Failed to sign out', error);
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-[#0f172a] font-sans text-slate-100">
            <Header />

            <main className="flex-grow container mx-auto px-4 py-8 md:py-16">
                <div className="max-w-2xl mx-auto animate-fade-in-up">
                    <h1 className="text-3xl font-bold mb-8 text-gradient">Meu Perfil</h1>

                    <div className="glass-card rounded-2xl overflow-hidden border border-slate-700/50">
                        {/* Header Section */}
                        <div className="relative bg-gradient-to-r from-blue-600/20 to-indigo-600/20 px-8 py-10 border-b border-indigo-500/10">
                            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent"></div>
                            <div className="flex items-center space-x-6">
                                <div className="p-1 rounded-full bg-gradient-to-br from-blue-400 to-indigo-600">
                                    <div className="bg-[#0f172a] p-4 rounded-full">
                                        <User size={48} className="text-indigo-400" />
                                    </div>
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-white mb-1">Minha Conta</h2>
                                    <p className="text-indigo-200 opacity-80 font-light">{user?.email}</p>
                                </div>
                            </div>
                        </div>

                        <div className="p-8 space-y-8">
                            {/* Personal Info Group */}
                            <div>
                                <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-4 flex items-center">
                                    <Activity size={14} className="mr-2" />
                                    Informações
                                </h3>

                                <div className="glass-panel rounded-xl p-1 border border-slate-700/50">
                                    <div className="space-y-1">
                                        <div className="flex items-center justify-between p-4 hover:bg-white/5 rounded-lg transition-colors">
                                            <div className="flex items-center text-slate-400">
                                                <Mail size={18} className="mr-3 text-slate-500" />
                                                <span>Email</span>
                                            </div>
                                            <span className="font-medium text-slate-200">{user?.email}</span>
                                        </div>

                                        <div className="w-full h-px bg-slate-800/50"></div>

                                        <div className="flex items-center justify-between p-4 hover:bg-white/5 rounded-lg transition-colors">
                                            <div className="flex items-center text-slate-400">
                                                <Hash size={18} className="mr-3 text-slate-500" />
                                                <span>ID do Usuário</span>
                                            </div>
                                            <span className="font-mono text-xs text-slate-500 bg-slate-900/50 px-2 py-1 rounded border border-slate-800">
                                                {user?.id}
                                            </span>
                                        </div>

                                        <div className="w-full h-px bg-slate-800/50"></div>

                                        <div className="flex items-center justify-between p-4 hover:bg-white/5 rounded-lg transition-colors">
                                            <div className="flex items-center text-slate-400">
                                                <div className="w-4 h-4 mr-3.5 rounded-full border-2 border-emerald-500/30 flex items-center justify-center">
                                                    <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                                                </div>
                                                <span>Status</span>
                                            </div>
                                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                                Ativo
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Security Group */}
                            <div>
                                <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-4 flex items-center">
                                    <Shield size={14} className="mr-2" />
                                    Segurança
                                </h3>
                                <button className="group flex items-center justify-between w-full p-4 glass-panel border border-slate-700/50 rounded-xl hover:bg-blue-600/10 hover:border-blue-500/30 transition-all duration-300">
                                    <div className="flex items-center">
                                        <div className="bg-slate-800/80 p-2 rounded-lg mr-4 group-hover:bg-blue-600/20 transition-colors">
                                            <Shield className="text-slate-400 group-hover:text-blue-400" size={20} />
                                        </div>
                                        <span className="text-slate-200 font-medium">Alterar Senha</span>
                                    </div>
                                    <span className="text-xs bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full opacity-80 group-hover:opacity-100 transition-opacity">
                                        Em breve
                                    </span>
                                </button>
                            </div>

                            <div className="pt-6 border-t border-slate-800">
                                <button
                                    onClick={handleSignOut}
                                    className="flex items-center justify-center w-full px-6 py-3 border border-red-500/30 text-red-400 rounded-xl hover:bg-red-500/10 hover:border-red-500/50 transition-all duration-300 font-medium group"
                                >
                                    <LogOut size={18} className="mr-2 group-hover:-translate-x-1 transition-transform" />
                                    Sair da Conta
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};
