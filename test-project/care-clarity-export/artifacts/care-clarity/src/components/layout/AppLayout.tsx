import { ReactNode } from 'react';
import { Link, useLocation } from 'wouter';
import { useTranslation } from 'react-i18next';
import { LayoutDashboard, Mic, Clock, Settings, Search } from 'lucide-react';
import { LanguageToggle } from '../LanguageToggle';
import { useSettings } from '@/store/settings';

interface AppLayoutProps {
  children: ReactNode;
  hideNav?: boolean;
  hideHeader?: boolean;
}

export function AppLayout({ children, hideNav = false, hideHeader = false }: AppLayoutProps) {
  const [location] = useLocation();
  const { t } = useTranslation();
  const { largeText } = useSettings();

  const navItems = [
    { href: '/', icon: LayoutDashboard, label: t('nav.dashboard') },
    { href: '/consultation', icon: Mic, label: t('nav.consultation') },
    { href: '/providers', icon: Search, label: t('nav.providers') },
    { href: '/history', icon: Clock, label: t('nav.history') },
    { href: '/settings', icon: Settings, label: t('nav.settings') }
  ];

  return (
    <div className={`min-h-[100dvh] flex flex-col bg-background ${largeText ? 'large-text-mode' : ''}`}>
      {!hideHeader && (
        <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-border px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white font-bold">
              C
            </div>
            <span className="font-bold text-lg text-foreground tracking-tight">Care Clarity</span>
          </div>
          <LanguageToggle />
        </header>
      )}

      <main className="flex-1 flex flex-col w-full max-w-3xl mx-auto pb-20">
        {children}
      </main>

      {!hideNav && (
        <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border shadow-[0_-4px_10px_rgba(0,0,0,0.05)] pb-safe">
          <div className="flex justify-around items-center h-16 max-w-3xl mx-auto px-2">
            {navItems.map((item) => {
              const isActive = location === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex flex-col items-center justify-center w-full h-full min-w-[64px] min-h-[48px] space-y-1 rounded-xl transition-colors ${
                    isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'fill-primary/20' : ''}`} strokeWidth={isActive ? 2.5 : 2} />
                  <span className={`text-[10px] font-medium ${isActive ? 'font-bold' : ''}`}>
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </div>
        </nav>
      )}
    </div>
  );
}
