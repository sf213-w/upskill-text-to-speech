import { useTranslation } from 'react-i18next';
import { Link } from 'wouter';
import { Shield, Mic, Users, ChevronRight, Clock } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { useHistory } from '@/store/history';

export default function Home() {
  const { t } = useTranslation();
  const { sessions } = useHistory();

  return (
    <AppLayout>
      <div className="p-4 sm:p-6 space-y-6">
        
        {/* Welcome Banner */}
        <div className="bg-gradient-to-br from-primary to-primary/80 rounded-3xl p-6 sm:p-8 text-white shadow-lg shadow-primary/20 relative overflow-hidden">
          <div className="absolute right-0 top-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10" />
          <h1 className="text-3xl font-bold mb-2 relative z-10">{t('home.title')}</h1>
          <p className="text-primary-foreground/90 text-lg mb-6 relative z-10">{t('home.subtitle')}</p>
          
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-2 rounded-full text-sm font-medium border border-white/20 relative z-10">
            <Shield className="w-4 h-4" />
            {t('home.privacyBadge')}
          </div>
        </div>

        {/* Main Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link 
            href="/consultation"
            className="group flex items-center justify-between bg-card p-5 rounded-2xl border border-border shadow-sm hover:shadow-md hover:border-primary/30 transition-all active:scale-[0.98]"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                <Mic className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-foreground text-lg">{t('home.startConsultation')}</h3>
                <p className="text-muted-foreground text-sm">EN ↔ ES</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
          </Link>

          <Link 
            href="/providers"
            className="group flex items-center justify-between bg-card p-5 rounded-2xl border border-border shadow-sm hover:shadow-md hover:border-secondary/30 transition-all active:scale-[0.98]"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-secondary/10 text-secondary flex items-center justify-center group-hover:bg-secondary group-hover:text-white transition-colors">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-foreground text-lg">{t('home.findProvider')}</h3>
                <p className="text-muted-foreground text-sm">Directorio médico</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-secondary transition-colors" />
          </Link>
        </div>

        {/* Stats / Mini History */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" />
              {t('home.recentSessions')}
            </h2>
            <Link href="/history" className="text-primary font-medium text-sm hover:underline">
              Ver todo
            </Link>
          </div>

          {sessions.length === 0 ? (
            <div className="bg-card border border-dashed border-border rounded-2xl p-8 text-center">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-muted-foreground/50" />
              </div>
              <p className="text-muted-foreground">{t('home.noSessions')}</p>
            </div>
          ) : (
            <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
              <div className="p-4 border-b border-border bg-muted/30">
                <p className="font-medium text-foreground">
                  {t('home.sessionsCount').replace('{{count}}', String(sessions.length))}
                </p>
              </div>
              <div className="divide-y divide-border">
                {sessions.slice(0, 3).map((session) => (
                  <div key={session.id} className="p-4 flex flex-col gap-2">
                    <span className="text-xs text-muted-foreground font-medium">
                      {new Date(session.createdAt).toLocaleDateString()}
                    </span>
                    {session.exchanges[0] && (
                      <p className="text-sm text-foreground line-clamp-2 italic">
                        "{session.exchanges[0].original}"
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
