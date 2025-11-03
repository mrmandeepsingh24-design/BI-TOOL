import React, { useState } from 'react';
import { User, AlertInfo } from '../types';
import { PharmaIQLogo } from '../components/Icons';
import Alert from '../components/Alert';

interface LoginProps {
    onLoginSuccess: (user: User) => void;
}

const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoginView, setIsLoginView] = useState(true);
    const [alert, setAlert] = useState<AlertInfo | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setAlert(null);
        if (!email || !password) {
            setAlert({type: 'error', title: 'Missing Information', message: 'Please enter both email and password.'});
            return;
        }
        setLoading(true);

        setTimeout(() => {
            if (email.includes('@') && password) {
                const nameFromEmail = email.split('@')[0];
                const capitalizedName = nameFromEmail.charAt(0).toUpperCase() + nameFromEmail.slice(1);
                
                const mockUser: User = {
                    id: '1',
                    name: capitalizedName,
                    email: email,
                };
                onLoginSuccess(mockUser);
            } else {
                setAlert({type: 'error', title: 'Login Failed', message: 'Please enter a valid email and password.'});
                setLoading(false);
            }
        }, 1000);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-primary-100 flex items-center justify-center p-4">
            <div className="relative max-w-md w-full bg-white p-6 sm:p-8 rounded-2xl shadow-subtle border border-neutral-200/50">
                <div className="text-center mb-6 sm:mb-8">
                    <div className="inline-flex items-center justify-center">
                        <PharmaIQLogo className="h-10 w-10 sm:h-12 sm:w-12 text-primary-600"/>
                        <h1 className="text-3xl sm:text-4xl font-bold text-neutral-800 ml-3">PharmaIQ</h1>
                    </div>
                    <p className="text-neutral-500 mt-2">{isLoginView ? 'Welcome back! Please sign in.' : 'Create your account.'}</p>
                </div>

                {alert && <div className="mb-4"><Alert {...alert} onClose={() => setAlert(null)} /></div>}

                <form onSubmit={handleSubmit}>
                    <div className="space-y-5">
                        <input
                            type="email"
                            placeholder="Email Address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                            required
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                            required
                        />
                    </div>
                    
                    <div className="flex items-center justify-between mt-6">
                        <a href="#" className="text-sm text-primary-600 hover:underline">Forgot Password?</a>
                    </div>
                    
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full mt-6 bg-primary-600 text-white py-3 rounded-lg font-semibold hover:bg-primary-700 transition duration-300 disabled:bg-primary-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    >
                        {loading ? 'Signing In...' : (isLoginView ? 'Sign In' : 'Sign Up')}
                    </button>
                </form>

                <p className="text-center text-sm text-neutral-600 mt-8">
                    {isLoginView ? "Don't have an account?" : "Already have an account?"}
                    <a href="#" onClick={(e) => {
                        e.preventDefault();
                        setIsLoginView(!isLoginView);
                        setAlert(null);
                    }} className="font-semibold text-primary-600 hover:underline ml-2">
                        {isLoginView ? 'Sign Up' : 'Sign In'}
                    </a>
                </p>
            </div>
        </div>
    );
};

export default Login;