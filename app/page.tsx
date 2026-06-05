'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import LandingPage from '@/components/marketing/LandingPage';
import AuthModal from '@/components/auth/AuthModal';

export default function Home() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const router = useRouter();

  const handleStartTrial = () => {
    setIsAuthModalOpen(true);
  };

  const handleAuthSuccess = () => {
    setIsAuthModalOpen(false);
    router.push('/onboarding');
  };

  return (
    <main>
      <LandingPage onStartTrial={handleStartTrial} />
      {isAuthModalOpen && (
        <AuthModal 
          isOpen={isAuthModalOpen} 
          onClose={() => setIsAuthModalOpen(false)} 
          onSuccess={handleAuthSuccess}
        />
      )}
    </main>
  );
}