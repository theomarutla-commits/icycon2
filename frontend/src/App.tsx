import React, { useState } from 'react';
import { useAuth } from './context/AuthContext';
import LandingPage from './pages/landing/LandingPage';
import AuthPage from './pages/signup/SignupPage';
import DashboardPage from './pages/dashboard/DashboardPage';
import { Page } from './types';

const App: React.FC = () => {
  const { user } = useAuth();
  const [currentPage, setCurrentPage] = useState<Page>('landing');

  if (user) {
    return <DashboardPage />;
  }

  switch (currentPage) {
    case 'login':
    case 'signup':
      return <AuthPage currentPage={currentPage} setCurrentPage={setCurrentPage} />;
    case 'landing':
    default:
      return <LandingPage onNavigateToLogin={() => setCurrentPage('login')} onNavigateToSignup={() => setCurrentPage('signup')} />;
  }
};

export default App;