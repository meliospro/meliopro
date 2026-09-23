import React, { useState } from 'react';
import { TaxiProvider, useTaxi } from './context/TaxiContext';
import { DeviceFrame } from './components/common/DeviceFrame';
import { ClientSplash } from './components/client/ClientSplash';
import { ClientWelcome } from './components/client/ClientWelcome';
import { ClientAuthModal } from './components/client/ClientAuthModal';
import { ClientHome } from './components/client/ClientHome';
import { DriverHome } from './components/driver/DriverHome';
import { AdminDashboard } from './components/admin/AdminDashboard';

const AppContent: React.FC = () => {
  const { role } = useTaxi();
  const [showSplash, setShowSplash] = useState(true);
  const [showWelcome, setShowWelcome] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register' | 'location'>('login');

  const handleSplashComplete = () => {
    setShowSplash(false);
  };

  const handleStartFromWelcome = () => {
    setAuthMode('register');
    setShowAuthModal(true);
  };

  const handleLoginFromWelcome = () => {
    setAuthMode('login');
    setShowAuthModal(true);
  };

  const handleAuthSuccess = () => {
    setShowAuthModal(false);
    setShowWelcome(false);
  };

  return (
    <DeviceFrame>
      {/* 1. Client Splash Screen on first launch (Prompt #4) */}
      {showSplash && role === 'client' && (
        <ClientSplash onComplete={handleSplashComplete} />
      )}

      {/* 2. Client Welcome Screen (Prompt #5) */}
      {showWelcome && role === 'client' && (
        <ClientWelcome
          onStart={handleStartFromWelcome}
          onLogin={handleLoginFromWelcome}
        />
      )}

      {/* 3. Auth & SMS OTP & Location Permission Modal (Prompts #6, #7, #8, #9) */}
      {showAuthModal && role === 'client' && (
        <ClientAuthModal
          initialMode={authMode}
          onSuccess={handleAuthSuccess}
          onCancel={() => setShowAuthModal(false)}
        />
      )}

      {/* 4. Active Role View */}
      {role === 'client' && <ClientHome />}
      {role === 'driver' && <DriverHome />}
      {role === 'admin' && <AdminDashboard />}
    </DeviceFrame>
  );
};

export default function App() {
  return (
    <TaxiProvider>
      <AppContent />
    </TaxiProvider>
  );
}
