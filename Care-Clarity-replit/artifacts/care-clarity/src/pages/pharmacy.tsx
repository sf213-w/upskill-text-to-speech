import { useLocation } from "wouter";
import { Layout } from "@/components/layout";
import { Pill, Camera, Mic, Bell, AlertTriangle } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function Pharmacy() {
  const [, setLocation] = useLocation();
  const { t } = useTranslation();

  return (
    <Layout>
      <div className="p-6 pb-24 space-y-8">
        
        {/* Header */}
        <div className="pt-4 flex items-center gap-3">
          <div className="bg-blue-100 dark:bg-blue-900/40 p-3 rounded-2xl text-blue-600 dark:text-blue-400">
            <Pill className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">{t('pharmacy.title')}</h1>
        </div>

        {/* Prescription Label Translation */}
        <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-sm">
          <div className="p-4 border-b border-border bg-muted/30 flex justify-between items-center">
            <h2 className="font-bold text-sm uppercase tracking-wider text-muted-foreground">Label Translation</h2>
            <button className="bg-primary/10 text-primary px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-2 hover:bg-primary/20 transition-colors">
              <Camera className="w-4 h-4" /> {t('pharmacy.scan_label')}
            </button>
          </div>
          
          <div className="flex items-stretch divide-x divide-border">
            <div className="w-1/3 bg-zinc-100 flex flex-col justify-center items-center p-4">
              <div className="w-16 h-20 bg-white border border-border shadow-sm rounded flex items-center justify-center rotate-3 relative overflow-hidden">
                <div className="absolute top-2 w-10 h-1 bg-zinc-200 rounded"></div>
                <div className="absolute top-4 w-12 h-1 bg-zinc-200 rounded"></div>
                <div className="absolute top-8 w-8 h-1 bg-zinc-200 rounded"></div>
              </div>
              <p className="text-[10px] text-muted-foreground mt-3 font-medium uppercase">English</p>
            </div>
            
            <div className="w-2/3 p-5 bg-blue-50/30 dark:bg-blue-900/5">
              <h3 className="text-[10px] font-bold text-primary uppercase tracking-wider mb-3">Translated Label</h3>
              <div className="space-y-2">
                <p className="font-bold text-lg text-foreground">Sumatriptán 50mg</p>
                <p className="text-sm text-foreground/80 leading-snug bg-white dark:bg-black/20 p-2 rounded-lg border border-border">
                  Tomar 1 tableta al inicio de migraña.
                </p>
                <p className="text-xs text-red-600 dark:text-red-400 font-semibold flex items-center gap-1.5 mt-2 bg-red-50 dark:bg-red-900/20 p-2 rounded-lg border border-red-100 dark:border-red-900/30">
                  <AlertTriangle className="w-4 h-4" />
                  No exceder 200mg en 24 horas
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Pharmacist Dialog Support */}
        <div className="bg-card border border-border rounded-3xl p-5 shadow-sm">
          <h2 className="font-bold text-foreground mb-4 flex items-center gap-2">
            {t('pharmacy.dialog_title')}
          </h2>
          
          <div className="bg-secondary/5 border border-secondary/20 rounded-2xl p-4 mb-4">
            <div className="flex flex-col gap-2">
              <div className="text-xs font-bold text-muted-foreground uppercase">Pharmacist (EN)</div>
              <p className="text-sm font-medium">"Take this with food to avoid stomach upset."</p>
              <div className="h-px bg-secondary/20 my-1 w-full"></div>
              <div className="text-xs font-bold text-secondary uppercase">Traducción (ES)</div>
              <p className="text-sm font-medium text-secondary">"Tome esto con comida para evitar malestar estomacal."</p>
            </div>
          </div>

          <button 
            onClick={() => setLocation("/consultation")}
            className="w-full py-3.5 bg-secondary text-white rounded-xl font-bold shadow-md hover:bg-secondary/90 transition-colors flex items-center justify-center gap-2"
          >
            {t('pharmacy.dialog_btn')}
          </button>
        </div>

        {/* Medication Reminders */}
        <div className="bg-card border border-border rounded-3xl p-5 shadow-sm">
          <h2 className="font-bold text-foreground mb-4 flex items-center gap-2">
            <Bell className="w-5 h-5 text-orange-500" />
            {t('pharmacy.reminders_title')}
          </h2>
          
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-xl border border-border">
              <div className="bg-white dark:bg-black/50 p-2 rounded-lg shadow-sm border border-border mt-0.5">
                <Bell className="w-4 h-4 text-primary animate-pulse" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-foreground">Sumatriptán 50mg</h4>
                <p className="text-xs text-muted-foreground mt-0.5">Al inicio de dolor de cabeza</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-xl border border-border">
              <div className="bg-white dark:bg-black/50 p-2 rounded-lg shadow-sm border border-border mt-0.5">
                <Pill className="w-4 h-4 text-muted-foreground" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-foreground">Ibuprofeno 400mg</h4>
                <p className="text-xs text-muted-foreground mt-0.5">Cada 8 horas (8:00, 16:00, 00:00)</p>
              </div>
            </div>
          </div>
        </div>

        <button 
          onClick={() => setLocation("/referrals")}
          className="w-full py-4 bg-primary text-white rounded-xl font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 transition-colors"
        >
          {t('pharmacy.continue_btn')}
        </button>

      </div>
    </Layout>
  );
}