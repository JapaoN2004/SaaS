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
        <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-100 rounded-full blur-3xl opacity-50"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-100 rounded-full blur-3xl opacity-50"></div>
            </div>

            <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
                <div className="flex justify-center mb-6">
                    <div className="bg-blue-600 p-3 rounded-2xl shadow-lg shadow-blue-600/20">
                        <ShieldCheck size={40} className="text-white" />
                    </div>
                </div>
                <h2 className="mt-2 text-center text-3xl font-extrabold text-brand-dark">
                    {isSignUp ? 'Crie sua conta' : 'Acesse sua conta'}
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600">
                    {isSignUp ? 'Comece a analisar contratos agora' : 'Continue analisando seus contratos'}
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
                <div className="bg-white/80 backdrop-blur-md py-8 px-4 shadow-xl border border-white/50 sm:rounded-2xl sm:px-10">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                                {error}
                            </div>
                        )}

                        {successMessage && (
                            <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg text-sm">
                                {successMessage}
                            </div>
                        )}

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                Email
                            </label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm placeholder-gray-400 transition-shadow"
                                    placeholder="seu@email.com"
                                />
                            </div>
                        </div>

                        <div>
                            <div className="flex justify-between items-center mb-1">
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                    Senha
                                </label>
                                {!isSignUp && (
                                    <div className="text-sm">
                                        <Link to="/forgot-password" className="font-medium text-blue-600 hover:text-blue-500">
                                            Esqueceu a senha?
                                        </Link>
                                    </div>
                                )}
                            </div>
                            <div className="relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-400" />
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
                                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm placeholder-gray-400 transition-shadow"
                                    placeholder="••••••••"
                                />
                            </div>
                            {isSignUp && (
                                <p className="mt-1 text-xs text-gray-500">Mínimo de 6 caracteres.</p>
                            )}
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoading ? (isSignUp ? 'Criando conta...' : 'Entrando...') : (isSignUp ? 'Criar Conta' : 'Entrar')}
                                {isSignUp ? <UserPlus className="ml-2 -mr-1 h-4 w-4" /> : <ArrowRight className="ml-2 -mr-1 h-4 w-4" />}
                            </button>
                        </div>
                    </form>

                    <div className="mt-6">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-200" />
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-white text-gray-500">
                                    {isSignUp ? 'Já tem uma conta?' : 'Ainda não tem conta?'}
                                </span>
                            </div>
                        </div>

                        <div className="mt-6 grid grid-cols-1 gap-3">
                            <button
                                type="button"
                                onClick={toggleMode}
                                className="w-full inline-flex justify-center py-2.5 px-4 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-500 border border-gray-200 hover:bg-gray-50 transition-colors"
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
