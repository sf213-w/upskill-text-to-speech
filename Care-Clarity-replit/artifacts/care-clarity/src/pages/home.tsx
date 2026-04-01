import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Shield, Search, CalendarDays, FileText, Mic, Clock, Pill, Share2, User } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Layout } from "@/components/layout";
import { Onboarding } from "@/components/onboarding";
import { hasCompletedOnboarding } from "@/lib/storage";

export default function Home() {
  const [, setLocation] = useLocation();
  const { t } = useTranslation();
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    if (!hasCompletedOnboarding()) {
      setShowOnboarding(true);
    }
  }, []);

  if (showOnboarding) {
    return <Onboarding onComplete={() => setShowOnboarding(false)} />;
  }

  return (
    <Layout>
      <div className="pb-24">

        {/* Logo Banner */}
        <div className="px-6 pt-5 pb-2 flex items-center">
          <img
            src={`${import.meta.env.BASE_URL}logo.png`}
            alt="Care Clarity"
            className="h-16 object-contain"
          />
        </div>

      <div className="p-6 space-y-8">
        {/* Header Greeting */}
        <div className="pt-2">
          <h1 className="text-3xl font-bold text-foreground tracking-tight">{t('home.greeting')}</h1>
          <p className="text-muted-foreground mt-1 text-lg">{t('home.greeting_sub')}</p>
        </div>

        {/* Privacy Badge */}
        <div className="flex items-center gap-3 bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-400 p-4 rounded-2xl border border-green-100 dark:border-green-900/50">
          <Shield className="w-5 h-5 flex-shrink-0" />
          <p className="text-sm font-medium">{t('consultation.privacy_badge')}</p>
        </div>

        {/* 2x2 Primary Actions Grid */}
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => setLocation("/search")}
            className="p-5 rounded-3xl bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 shadow-sm hover:shadow-md transition-all text-left group"
          >
            <div className="bg-blue-100 dark:bg-blue-900/40 w-12 h-12 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Search className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="font-semibold text-foreground">{t('home.action_find_provider')}</h3>
            <p className="text-xs text-muted-foreground mt-1">{t('home.action_find_desc')}</p>
          </button>
          
          <button
            onClick={() => setLocation("/book")}
            className="p-5 rounded-3xl bg-purple-50/50 dark:bg-purple-900/10 border border-purple-100 dark:border-purple-900/30 shadow-sm hover:shadow-md transition-all text-left group"
          >
            <div className="bg-purple-100 dark:bg-purple-900/40 w-12 h-12 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <CalendarDays className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="font-semibold text-foreground">{t('home.action_book')}</h3>
            <p className="text-xs text-muted-foreground mt-1">{t('home.action_book_desc')}</p>
          </button>

          <button
            onClick={() => setLocation("/intake")}
            className="p-5 rounded-3xl bg-orange-50/50 dark:bg-orange-900/10 border border-orange-100 dark:border-orange-900/30 shadow-sm hover:shadow-md transition-all text-left group"
          >
            <div className="bg-orange-100 dark:bg-orange-900/40 w-12 h-12 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <FileText className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
            <h3 className="font-semibold text-foreground">{t('home.action_intake')}</h3>
            <p className="text-xs text-muted-foreground mt-1">{t('home.action_intake_desc')}</p>
          </button>

          <button
            onClick={() => setLocation("/consultation")}
            className="p-5 rounded-3xl bg-primary/10 border border-primary/20 shadow-sm hover:shadow-md transition-all text-left group"
          >
            <div className="bg-primary/20 w-12 h-12 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Mic className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-semibold text-foreground">{t('home.action_translate')}</h3>
            <p className="text-xs text-muted-foreground mt-1">{t('home.action_translate_desc')}</p>
          </button>
        </div>

        {/* More Services Section */}
        <div>
          <h2 className="text-xl font-bold text-foreground mb-4">{t('home.more_services')}</h2>
          <div className="space-y-3">
            <button
              onClick={() => setLocation("/history")}
              className="w-full bg-card border border-border p-4 rounded-2xl flex items-center justify-between shadow-sm hover:shadow-md transition-all"
            >
              <div className="flex items-center gap-4">
                <div className="bg-muted p-2.5 rounded-xl">
                  <Clock className="w-5 h-5 text-foreground" />
                </div>
                <span className="font-semibold">{t('home.action_post_visit')}</span>
              </div>
            </button>
            
            <button
              onClick={() => setLocation("/pharmacy")}
              className="w-full bg-card border border-border p-4 rounded-2xl flex items-center justify-between shadow-sm hover:shadow-md transition-all"
            >
              <div className="flex items-center gap-4">
                <div className="bg-muted p-2.5 rounded-xl">
                  <Pill className="w-5 h-5 text-foreground" />
                </div>
                <span className="font-semibold">{t('home.action_pharmacy')}</span>
              </div>
            </button>

            <button
              onClick={() => setLocation("/referrals")}
              className="w-full bg-card border border-border p-4 rounded-2xl flex items-center justify-between shadow-sm hover:shadow-md transition-all"
            >
              <div className="flex items-center gap-4">
                <div className="bg-muted p-2.5 rounded-xl">
                  <Share2 className="w-5 h-5 text-foreground" />
                </div>
                <span className="font-semibold">{t('home.action_referrals')}</span>
              </div>
            </button>
          </div>
        </div>

        {/* User Profile Card */}
        <div className="bg-card border border-border p-5 rounded-3xl flex items-center gap-4 shadow-sm mt-6">
          <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center text-primary">
            <User className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-foreground">Maria Gonzalez</h3>
            <p className="text-sm text-muted-foreground">Patient • Español</p>
          </div>
        </div>

      </div>
      </div>
    </Layout>
  );
}