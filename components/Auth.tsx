import React, { useState } from 'react';
import { NeonButton, NeonInput } from './UI';
import { useAuth } from '../services/authContext';
import { Loader } from 'lucide-react';

interface AuthModalContentProps {
    onSuccess: () => void;
}

export const AuthModalContent: React.FC<AuthModalContentProps> = ({ onSuccess }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { signInWithEmail, signUpWithEmail } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            if (isLogin) {
                const { error } = await signInWithEmail(email, password);
                if (error) throw error;
            } else {
                const { error } = await signUpWithEmail(email, password, name);
                if (error) throw error;
            }
            onSuccess();
        } catch (err: any) {
            setError(err.message || "Authentication failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
                <NeonInput 
                    label="Full Name" 
                    placeholder="John Doe" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                    required 
                />
            )}
            <NeonInput 
                label="Email" 
                type="email" 
                placeholder="you@example.com" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
            />
            <NeonInput 
                label="Password" 
                type="password" 
                placeholder="••••••••" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
            />
            
            {error && <div className="text-red-400 text-sm text-center">{error}</div>}

            <NeonButton className="w-full mt-4" disabled={loading}>
                {loading ? <Loader className="animate-spin mx-auto"/> : (isLogin ? 'Sign In' : 'Create Account')}
            </NeonButton>

            <div className="text-center text-sm text-slate-400 mt-4">
                {isLogin ? "Don't have an account? " : "Already have an account? "}
                <button 
                    type="button" 
                    onClick={() => { setIsLogin(!isLogin); setError(''); }} 
                    className="text-cyan-400 hover:underline"
                >
                    {isLogin ? 'Sign Up' : 'Log In'}
                </button>
            </div>
        </form>
    );
};
