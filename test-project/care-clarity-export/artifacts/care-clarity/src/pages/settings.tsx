import { useTranslation } from 'react-i18next';
import { useLocation } from 'wouter';
import { Settings as SettingsIcon, Globe, Type, RotateCcw, Trash2, ShieldCheck, Cloud } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { useSettings } from '@/store/settings';
import { useHistory } from '@/store/history';
import { isSupabaseConfigured } from '@/lib/supabase';

export default function Settings() {
  const { t, i18n } = useTranslation();
  const [, setLocation] = useLocation();
  const { language, setLanguage, largeText, setLargeText, setOnboardingDone } = useSettings();
  const { clearHistory } = useHistory();

  const handleRepeatOnboarding = () => {
    setOnboardingDone(false);
    setLocation('/onboarding');
  };

  const handleClearData = () => {
    if (window.confirm(t('settings.clearDataConfirm'))) {
      clearHistory();
    }
  };

  return (
    <AppLayout>
      <div className="p-4 sm:p-6 max-w-2xl mx-auto w-full">
        <h1 className="text-2xl font-bold text-foreground mb-8 flex items-center gap-2">
          <SettingsIcon className="w-6 h-6 text-primary" />
          {t('settings.title')}
        </h1>

        <div className="space-y-8">
          
          {/* Language Section */}
          <section>
            <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-4 px-2">
              {t('settings.language')}
            </h2>
            <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <Globe className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">English / Español</p>
                    <p className="text-sm text-muted-foreground">{t('settings.languageDesc')}</p>
                  </div>
                </div>
                
                <div className="flex bg-muted p-1 rounded-xl">
                  <button
                    onClick={() => { setLanguage('en'); i18n.changeLanguage('en'); }}
                    className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${language === 'en' ? 'bg-white shadow text-primary' : 'text-muted-foreground hover:text-foreground'}`}
                  >
                    EN
                  </button>
                  <button
                    onClick={() => { setLanguage('es'); i18n.changeLanguage('es'); }}
                    className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${language === 'es' ? 'bg-white shadow text-primary' : 'text-muted-foreground hover:text-foreground'}`}
                  >
                    ES
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Accessibility Section */}
          <section>
            <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-4 px-2">
              {t('settings.accessibility')}
            </h2>
            <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center text-secondary">
                    <Type className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{t('settings.largeText')}</p>
                    <p className="text-sm text-muted-foreground">{t('settings.largeTextDesc')}</p>
                  </div>
                </div>
                
                <button 
                  role="switch" 
                  aria-checked={largeText}
                  onClick={() => setLargeText(!largeText)}
                  className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${largeText ? 'bg-primary' : 'bg-muted-foreground/30'}`}
                >
                  <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${largeText ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
              </div>
            </div>
          </section>

          {/* Data & Privacy Section */}
          <section>
            <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-4 px-2">
              {t('settings.data')}
            </h2>
            <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden divide-y divide-border">
              
              <div className="p-4 space-y-3">
                <div className="flex items-start gap-3 bg-accent/10 p-4 rounded-xl text-accent-foreground dark:text-accent">
                  <ShieldCheck className="w-6 h-6 shrink-0 mt-0.5" />
                  <p className="text-sm">{t('settings.privacyNotice')}</p>
                </div>
                <div className={`flex items-center gap-3 p-4 rounded-xl ${isSupabaseConfigured ? 'bg-green-50 text-green-700' : 'bg-muted text-muted-foreground'}`}>
                  <Cloud className="w-5 h-5 shrink-0" />
                  <p className="text-sm font-medium">
                    {isSupabaseConfigured
                      ? 'Cloud sync enabled — sessions saved to Supabase'
                      : 'Cloud sync not configured — sessions saved locally only'}
                  </p>
                </div>
              </div>

              <button 
                onClick={handleRepeatOnboarding}
                className="w-full p-4 flex items-center gap-3 hover:bg-muted/50 transition-colors text-left"
              >
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
                  <RotateCcw className="w-5 h-5" />
                </div>
                <span className="font-medium text-foreground">{t('settings.repeatOnboarding')}</span>
              </button>

              <button 
                onClick={handleClearData}
                className="w-full p-4 flex items-center gap-3 hover:bg-destructive/5 transition-colors text-left"
              >
                <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center text-destructive">
                  <Trash2 className="w-5 h-5" />
                </div>
                <span className="font-medium text-destructive">{t('settings.clearData')}</span>
              </button>

            </div>
          </section>

        </div>
      </div>
    </AppLayout>
  );
}
