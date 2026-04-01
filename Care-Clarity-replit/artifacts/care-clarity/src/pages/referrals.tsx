import { useLocation } from "wouter";
import { Layout } from "@/components/layout";
import { Share2, Search, FileText, ChevronRight, UserCircle, CalendarCheck, Clock } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function Referrals() {
  const [, setLocation] = useLocation();
  const { t } = useTranslation();

  return (
    <Layout>
      <div className="p-6 pb-24 space-y-8">
        
        {/* Header */}
        <div className="pt-4 flex items-center gap-3">
          <div className="bg-green-100 dark:bg-green-900/40 p-3 rounded-2xl text-green-600 dark:text-green-400">
            <Share2 className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">{t('referrals.title')}</h1>
        </div>

        {/* Active Referrals */}
        <div>
          <h2 className="text-lg font-bold text-foreground mb-4">{t('referrals.active_title')}</h2>
          
          <div className="space-y-4">
            {/* Pending Referral */}
            <div className="bg-card border border-border rounded-3xl p-5 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 text-xs font-bold px-3 py-1.5 rounded-bl-xl flex items-center gap-1 border-b border-l border-amber-200 dark:border-amber-800">
                <Clock className="w-3 h-3" /> Pending booking
              </div>
              
              <div className="flex items-center gap-3 mb-4 mt-2">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                  <UserCircle className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-foreground">Dr. Fernández</h3>
                  <p className="text-sm font-medium text-secondary">Neurología</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Referido por Dra. López</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-2 mt-4">
                <button 
                  onClick={() => setLocation("/search")}
                  className="py-2.5 bg-primary text-white rounded-xl text-sm font-bold flex items-center justify-center gap-1.5 shadow-sm hover:bg-primary/90"
                >
                  <Search className="w-4 h-4" /> {t('referrals.search_book')}
                </button>
                <button className="py-2.5 bg-muted text-foreground rounded-xl text-sm font-bold flex items-center justify-center gap-1.5 border border-border hover:bg-muted/80">
                  {t('referrals.share_history')}
                </button>
                <button 
                  onClick={() => setLocation("/intake")}
                  className="col-span-2 py-2.5 bg-secondary/10 text-secondary rounded-xl text-sm font-bold flex items-center justify-center gap-1.5 border border-secondary/20 hover:bg-secondary/20 mt-1"
                >
                  <FileText className="w-4 h-4" /> {t('referrals.intake_forms')}
                </button>
              </div>
            </div>

            {/* Booked Referral */}
            <div className="bg-card border border-border rounded-3xl p-5 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 text-xs font-bold px-3 py-1.5 rounded-bl-xl flex items-center gap-1 border-b border-l border-green-200 dark:border-green-800">
                <CalendarCheck className="w-3 h-3" /> Booked — 29 Abril
              </div>
              
              <div className="flex items-center gap-3 mb-2 mt-2">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400">
                  <UserCircle className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-foreground">Óptica Centro</h3>
                  <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Examen de vista</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Referido por Dra. López</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Referral Flow Diagram */}
        <div className="mt-8">
          <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-4">{t('referrals.flow_title')}</h2>
          
          <div className="flex flex-wrap items-center gap-2">
            <div className="bg-muted border border-border px-3 py-1.5 rounded-full text-xs font-semibold text-muted-foreground">Post-Visit</div>
            <ChevronRight className="w-4 h-4 text-muted-foreground/50" />
            <div className="bg-primary/10 border border-primary/20 px-3 py-1.5 rounded-full text-xs font-semibold text-primary">Referral Saved</div>
            <ChevronRight className="w-4 h-4 text-muted-foreground/50" />
            <div className="bg-muted border border-border px-3 py-1.5 rounded-full text-xs font-semibold text-muted-foreground">Search</div>
            <ChevronRight className="w-4 h-4 text-muted-foreground/50" />
            <div className="bg-muted border border-border px-3 py-1.5 rounded-full text-xs font-semibold text-muted-foreground">Book</div>
            <ChevronRight className="w-4 h-4 text-muted-foreground/50" />
            <div className="bg-muted border border-border px-3 py-1.5 rounded-full text-xs font-semibold text-muted-foreground">Intake</div>
            <ChevronRight className="w-4 h-4 text-muted-foreground/50" />
            <div className="bg-muted border border-border px-3 py-1.5 rounded-full text-xs font-semibold text-muted-foreground">Consult</div>
          </div>
        </div>

      </div>
    </Layout>
  );
}