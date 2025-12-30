import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldCheck, Mail, Lock, ArrowRight, UserPlus } from 'lucide-react';

import { useAuth } from '../contexts/AuthContext';

export const Login: React.FC = () => {
    const [isSignUp, setIsSignUp] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const { signInWithEmail, signUpWithEmail } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');
        setIsLoading(true);

        try {
            if (isSignUp) {
                const { error, data } = await signUpWithEmail(email, password);
                if (error) throw error;

                // Check if session exists immediately (auto-confirm disabled) or requires email confirmation
                if (data.user && !data.session) {
                    setSuccessMessage("Conta criada com sucesso! Verifique seu email para confirmar o cadastro.");
                    setIsSignUp(false); // Switch back to login
                } else {
                    // Auto login if session is active
                    navigate('/');
                }
            } else {
                const { error } = await signInWithEmail(email, password);
                if (error) throw error;
                navigate('/');
            }
        } catch (err: any) {
            setError(err.message || `Falha ao ${isSignUp ? 'criar conta' : 'fazer login'}.`);
        } finally {
            setIsLoading(false);
        }
    };

    const toggleMode = () => {
        setIsSignUp(!isSignUp);
        setError('');
        setSuccessMessage('');
    };

    return (
        <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[128px] animate-float"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[128px] animate-float" style={{ animationDelay: '2s' }}></div>
            </div>

            <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
                <div className="flex justify-center mb-6">
                    <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-3 rounded-2xl shadow-lg shadow-blue-600/20">
                        <ShieldCheck size={40} className="text-white" />
                    </div>
                </div>
                <h2 className="mt-2 text-center text-3xl font-extrabold text-white">
                    {isSignUp ? 'Crie sua conta' : 'Acesse sua conta'}
                </h2>
                <p className="mt-2 text-center text-sm text-slate-400">
                    {isSignUp ? 'Comece a analisar contratos agora' : 'Continue analisando seus contratos'}
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
                <div className="glass-panel py-8 px-4 shadow-2xl border border-white/5 sm:rounded-2xl sm:px-10">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        {error && (
                            <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg text-sm flex items-center">
                                <span className="block sm:inline">{error}</span>
                            </div>
                        )}

                        {successMessage && (
                            <div className="bg-green-500/10 border border-green-500/20 text-green-400 px-4 py-3 rounded-lg text-sm">
                                {successMessage}
                            </div>
                        )}

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-slate-300">
                                Email
                            </label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-slate-500" />
                                </div>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="block w-full pl-10 pr-3 py-2 bg-slate-800/50 border border-slate-700 text-white rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm placeholder-slate-500 transition-all focus:bg-slate-800"
                                    placeholder="seu@email.com"
                                />
                            </div>
                        </div>

                        <div>
                            <div className="flex justify-between items-center mb-1">
                                <label htmlFor="password" className="block text-sm font-medium text-slate-300">
                                    Senha
                                </label>
                                {!isSignUp && (
                                    <div className="text-sm">
                                        <Link to="/forgot-password" className="font-medium text-blue-400 hover:text-blue-300 transition-colors">
                                            Esqueceu a senha?
                                        </Link>
                                    </div>
                                )}
                            </div>
                            <div className="relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-slate-500" />
                                </div>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete={isSignUp ? "new-password" : "current-password"}
                                    required
                                    minLength={isSignUp ? 6 : undefined}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="block w-full pl-10 pr-3 py-2 bg-slate-800/50 border border-slate-700 text-white rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm placeholder-slate-500 transition-all focus:bg-slate-800"
                                    placeholder="••••••••"
                                />
                            </div>
                            {isSignUp && (
                                <p className="mt-1 text-xs text-slate-500">Mínimo de 6 caracteres.</p>
                            )}
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-lg shadow-lg shadow-blue-600/20 text-sm font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoading ? (isSignUp ? 'Criando conta...' : 'Entrando...') : (isSignUp ? 'Criar Conta' : 'Entrar')}
                                {isSignUp ? <UserPlus className="ml-2 -mr-1 h-4 w-4" /> : <ArrowRight className="ml-2 -mr-1 h-4 w-4" />}
                            </button>
                        </div>
                    </form>

                    <div className="mt-6">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-slate-700" />
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-transparent text-slate-500 glass-panel-bg">
                                    {isSignUp ? 'Já tem uma conta?' : 'Ainda não tem conta?'}
                                </span>
                            </div>
                        </div>

                        <div className="mt-6 grid grid-cols-1 gap-3">
                            <button
                                type="button"
                                onClick={toggleMode}
                                className="w-full inline-flex justify-center py-2.5 px-4 rounded-lg shadow-sm bg-slate-800 text-sm font-medium text-slate-300 border border-slate-700 hover:bg-slate-700 transition-colors hover:text-white"
                            >
                                {isSignUp ? 'Fazer Login' : 'Criar conta gratuitamente'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
