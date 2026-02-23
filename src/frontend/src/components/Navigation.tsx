import { cn } from '@/lib/utils';

interface NavigationProps {
  activeTab: 'daftar' | 'summary' | 'admin';
  onTabChange: (tab: 'daftar' | 'summary' | 'admin') => void;
  isAdmin: boolean;
}

export default function Navigation({ activeTab, onTabChange, isAdmin }: NavigationProps) {
  const tabs = [
    { id: 'daftar' as const, label: 'Daftar Keluarga' },
    { id: 'summary' as const, label: 'Summary Raya' },
    ...(isAdmin ? [{ id: 'admin' as const, label: 'Admin Dashboard' }] : []),
  ];

  return (
    <nav className="flex gap-2 border-b border-accent/30">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={cn(
            'px-6 py-3 font-medium transition-all duration-200 border-b-2 -mb-px',
            activeTab === tab.id
              ? 'text-primary border-accent bg-accent/10'
              : 'text-muted-foreground border-transparent hover:text-foreground hover:border-accent/50'
          )}
        >
          {tab.label}
        </button>
      ))}
    </nav>
  );
}
