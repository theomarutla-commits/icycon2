import React, { FC, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
    const { login, user } = useAuth();
    const navigate = useNavigate();

    // If already logged in, redirect to dashboard
    useEffect(() => {
        if (user) {
            navigate('/app', { replace: true });
        }
    }, [user, navigate]);

    const handleAuth = async (email: string, pass: string, confirmPass?: string) => {
        setLoading(true);
        setError(null);
        try {
            if (currentPage === 'login') {
                const response = await api.login(email, pass);
                login(response.user, response.token);
            } else {
                // For signup, derive username from email and use confirmPass
                const username = email.split('@')[0];
                const response = await api.signup(email, username, pass, confirmPass || pass);
                login(response.user, response.token);
            }
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