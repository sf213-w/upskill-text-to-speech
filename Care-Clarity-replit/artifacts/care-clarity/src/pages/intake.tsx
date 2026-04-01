import { useLocation } from "wouter";
import { Layout } from "@/components/layout";
import { Camera, FileCheck2, ShieldCheck, CheckCircle2 } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function Intake() {
  const [, setLocation] = useLocation();
  const { t } = useTranslation();

  return (
    <Layout>
      <div className="p-6 pb-24 space-y-8">
        
        {/* Header */}
        <div className="pt-4">
          <h1 className="text-2xl font-bold text-foreground">{t('intake.title')}</h1>
        </div>

        {/* Digital Form Section */}
        <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-sm">
          <div className="bg-primary/5 px-5 py-4 border-b border-primary/10 flex items-center gap-3">
            <FileCheck2 className="w-5 h-5 text-primary" />
            <h2 className="font-bold text-primary">{t('intake.digital_form')}</h2>
          </div>
          <div className="p-5 space-y-4">
            <div>
              <label className="block text-xs font-semibold mb-1 text-muted-foreground uppercase">Nombre completo</label>
              <div className="relative">
                <input type="text" value="Maria Gonzalez" readOnly className="w-full bg-muted border border-border rounded-xl py-3 pl-3 pr-20 text-foreground" />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] bg-white border border-border px-2 py-1 rounded-md font-bold text-primary flex items-center gap-1 shadow-sm"><CheckCircle2 className="w-3 h-3"/> Auto</span>
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1 text-muted-foreground uppercase">Fecha de nacimiento</label>
              <div className="relative">
                <input type="text" value="03/15/1981" readOnly className="w-full bg-muted border border-border rounded-xl py-3 pl-3 pr-20 text-foreground" />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] bg-white border border-border px-2 py-1 rounded-md font-bold text-primary flex items-center gap-1 shadow-sm"><CheckCircle2 className="w-3 h-3"/> Auto</span>
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1 text-foreground uppercase">Alergias</label>
              <input type="text" placeholder="Enter / Ingresar..." className="w-full bg-card border-2 border-border focus:border-primary rounded-xl p-3 text-foreground outline-none transition-colors" />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1 text-foreground uppercase">Medicamentos actuales</label>
              <input type="text" placeholder="Enter / Ingresar..." className="w-full bg-card border-2 border-border focus:border-primary rounded-xl p-3 text-foreground outline-none transition-colors" />
            </div>
          </div>
        </div>

        {/* Paper Form Translation Section */}
        <div className="bg-card border border-border rounded-3xl p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <Camera className="w-5 h-5 text-secondary" />
            <h2 className="font-bold text-foreground">{t('intake.paper_form')}</h2>
          </div>
          <p className="text-xs text-muted-foreground mb-4">US 3.2: Photo → OCR → Spanish overlay</p>
          <button 
            onClick={() => setLocation("/intake/camera")}
            className="w-full py-4 border-2 border-dashed border-secondary/50 text-secondary bg-secondary/5 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-secondary/10 transition-colors"
          >
            <Camera className="w-5 h-5" /> {t('intake.capture_btn')}
          </button>
        </div>

        {/* HIPAA Notice */}
        <div className="bg-card border border-border rounded-3xl p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <ShieldCheck className="w-5 h-5 text-foreground" />
            <h2 className="font-bold text-foreground">{t('intake.hipaa_title')}</h2>
          </div>
          <div className="bg-muted p-4 rounded-xl h-32 overflow-y-auto text-xs text-muted-foreground leading-relaxed mb-4 border border-border">
            Su privacidad es importante para nosotros. Bajo la Ley de Portabilidad y Responsabilidad de Seguros de Salud (HIPAA), su información médica está protegida... (Texto legal simulado para el MVP). Al utilizar esta aplicación, usted acepta que su información sea procesada para fines de traducción médica en tiempo real. Ningún audio se almacena permanentemente.
          </div>
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" className="w-5 h-5 rounded border-border text-primary focus:ring-primary" />
            <span className="font-semibold text-sm">{t('intake.hipaa_accept')}</span>
          </label>
        </div>

        <button 
          onClick={() => setLocation("/consultation")}
          className="w-full py-4 bg-primary text-white rounded-xl font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 transition-colors flex items-center justify-center"
        >
          {t('intake.continue_btn')}
        </button>

      </div>
    </Layout>
  );
}