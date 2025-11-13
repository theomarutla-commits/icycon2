import React, { FC, useState } from 'react';
import AuthForm from '../../components/AuthForm';
import { api } from '../../api/auth';
import { useAuth } from '../../context/AuthContext';
import { Page } from '../../types';

interface AuthPageProps {
    currentPage: 'login' | 'signup';
    setCurrentPage: (page: Page) => void;
}

const AuthPage: FC<AuthPageProps> = ({ currentPage, setCurrentPage }) => {
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();

    const handleAuth = async (email: string, pass: string) => {
        setLoading(true);
        setError(null);
        try {
            const authFn = currentPage === 'login' ? api.login : api.signup;
            const { user } = await authFn(email, pass);
            login(user);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred');
        } finally {
            setLoading(false);
        }
    };

    const isLogin = currentPage === 'login';

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-slate-900">
            <AuthForm
                title={isLogin ? 'Login' : 'Create Account'}
                isLogin={isLogin}
                onSubmit={handleAuth}
                onSwitch={() => setCurrentPage(isLogin ? 'signup' : 'login')}
                error={error}
                loading={loading}
            />
        </div>
    );
};

export default AuthPage;