import React from 'react';
import { useAuth } from './lib/AuthContext';
import { AuthScreen } from './views/AuthScreen';
import App from './App';

export function AuthGate() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-brand-bg text-brand-cyan">
        <div className="animate-pulse font-heading tracking-widest text-sm uppercase">Loading TechQuest...</div>
      </div>
    );
  }

  if (!user) {
    return <AuthScreen />;
  }

  return <App user={user} />;
}
