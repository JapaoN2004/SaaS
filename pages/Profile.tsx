import React from 'react';
import { User, LogOut, Shield } from 'lucide-react';
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
        <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
            <Header />

            <main className="flex-grow container mx-auto px-4 py-8 md:py-12">
                <div className="max-w-2xl mx-auto">
                    <h1 className="text-3xl font-bold text-gray-900 mb-8">Meu Perfil</h1>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-8 text-white">
                            <div className="flex items-center space-x-4">
                                <div className="bg-white/20 p-3 rounded-full backdrop-blur-sm">
                                    <User size={40} className="text-white" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold">Minha Conta</h2>
                                    <p className="text-blue-100 opacity-90">{user?.email}</p>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 space-y-6">
                            <div>
                                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">Informações</h3>
                                <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                                    <div className="flex items-center justify-between py-2 border-b border-gray-200 last:border-0">
                                        <span className="text-gray-600">Email</span>
                                        <span className="font-medium text-gray-900">{user?.email}</span>
                                    </div>
                                    <div className="flex items-center justify-between py-2 border-b border-gray-200 last:border-0">
                                        <span className="text-gray-600">ID do Usuário</span>
                                        <span className="font-mono text-xs text-gray-400">{user?.id}</span>
                                    </div>
                                    <div className="flex items-center justify-between py-2">
                                        <span className="text-gray-600">Status</span>
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                            Ativo
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">Segurança</h3>
                                <button className="flex items-center justify-between w-full p-4 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                                    <div className="flex items-center">
                                        <Shield className="text-gray-400 mr-3" size={20} />
                                        <span className="text-gray-700 font-medium">Alterar Senha</span>
                                    </div>
                                    <span className="text-blue-600 text-sm">Em breve</span>
                                </button>
                            </div>

                            <div className="pt-4 border-t border-gray-100">
                                <button
                                    onClick={handleSignOut}
                                    className="flex items-center justify-center w-full px-4 py-2 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-colors font-medium"
                                >
                                    <LogOut size={18} className="mr-2" />
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
