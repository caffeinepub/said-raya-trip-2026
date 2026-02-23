import { useState, useEffect } from 'react';
import { useInternetIdentity } from './hooks/useInternetIdentity';
import { useGetCallerUserProfile } from './hooks/useUserProfile';
import { useAdminCheck } from './hooks/useAdminCheck';
import Navigation from './components/Navigation';
import DaftarKeluarga from './components/DaftarKeluarga';
import SummaryRaya from './components/SummaryRaya';
import AdminDashboard from './components/AdminDashboard';
import LoginButton from './components/LoginButton';
import ProfileSetup from './components/ProfileSetup';
import { Toaster } from '@/components/ui/sonner';
import { Heart } from 'lucide-react';

type TabType = 'daftar' | 'summary' | 'admin';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('daftar');
  const { identity, isInitializing } = useInternetIdentity();
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();
  const { data: isAdmin } = useAdminCheck();

  const isAuthenticated = !!identity;
  const showProfileSetup = isAuthenticated && !profileLoading && isFetched && userProfile === null;

  // Redirect from admin tab if not admin
  useEffect(() => {
    if (activeTab === 'admin' && !isAdmin) {
      setActiveTab('daftar');
    }
  }, [activeTab, isAdmin]);

  if (isInitializing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Memuatkan...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b-2 border-accent shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-primary mb-1">
                SAID Raya Trip 2026
              </h1>
              <p className="text-sm md:text-base text-muted-foreground italic">
                Merancang bersama, meraikan bersama.
              </p>
            </div>
            <LoginButton />
          </div>
          <Navigation activeTab={activeTab} onTabChange={setActiveTab} isAdmin={isAdmin || false} />
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="animate-fade-in">
          {activeTab === 'daftar' && <DaftarKeluarga />}
          {activeTab === 'summary' && <SummaryRaya />}
          {activeTab === 'admin' && isAdmin && <AdminDashboard />}
        </div>
      </main>

      <footer className="bg-card border-t border-border mt-16 py-6">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p className="flex items-center justify-center gap-1">
            © {new Date().getFullYear()} SAID Raya Trip 2026. Built with{' '}
            <Heart className="w-4 h-4 text-accent fill-accent" /> using{' '}
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline font-medium"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </footer>

      {showProfileSetup && <ProfileSetup />}
      <Toaster />
    </div>
  );
}
