import React, { FC, useState, FormEvent } from 'react';

const AuthForm: FC<{
    title: string;
    isLogin: boolean;
    onSubmit: (email: string, pass: string, confirmPass?: string) => void;
    onSwitch: () => void;
    error: string | null;
    loading: boolean;
}> = ({ title, isLogin, onSubmit, onSwitch, error, loading }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (!isLogin && password !== confirmPassword) {
            alert("Passwords don't match!");
            return;
        }
        onSubmit(email, password, confirmPassword);
    };

    return (
        <div className="w-full max-w-md bg-slate-800 rounded-xl shadow-2xl p-8">
            <h2 className="text-3xl font-bold text-center text-white mb-8">{title}</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-slate-400 mb-2" htmlFor="email">Email Address</label>
                    <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full bg-slate-900 border border-slate-700 rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-[#0079d2] focus:border-[#0079d2] outline-none transition" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-400 mb-2" htmlFor="password">Password</label>
                    <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full bg-slate-900 border border-slate-700 rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-[#0079d2] focus:border-[#0079d2] outline-none transition" />
                </div>
                {!isLogin && (
                     <div>
                        <label className="block text-sm font-medium text-slate-400 mb-2" htmlFor="confirm-password">Confirm Password</label>
                        <input type="password" id="confirm-password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required className="w-full bg-slate-900 border border-slate-700 rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-[#0079d2] focus:border-[#0079d2] outline-none transition" />
                    </div>
                )}
                {error && <p className="text-red-400 text-sm text-center">{error}</p>}
                <button type="submit" disabled={loading} className="w-full bg-[#0052bd] text-white py-3 rounded-md hover:bg-[#0079d2] transition-colors font-semibold disabled:bg-[#002292] disabled:cursor-not-allowed flex items-center justify-center">
                   {loading ? (<svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>) : title}
                </button>
            </form>
            <p className="text-center text-slate-400 mt-6">
                {isLogin ? "Don't have an account?" : "Already have an account?"}
                <button onClick={onSwitch} className="text-[#009dd3] hover:text-[#00bfc7] font-semibold ml-2">{isLogin ? 'Sign Up' : 'Login'}</button>
            </p>
        </div>
    );
};

export default AuthForm;