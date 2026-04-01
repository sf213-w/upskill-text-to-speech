import { useEffect, useState } from "react";
import { useLocation, useParams } from "wouter";
import { Layout } from "@/components/layout";
import { getSession, Session } from "@/lib/storage";
import { Share, Home, CheckCircle2, Pill, UserPlus, Bookmark, ChevronRight, ChevronDown } from "lucide-react";
import { useTranslation } from "react-i18next";
import { format } from "date-fns";
import { es, enUS } from "date-fns/locale";

const LIFESTYLE_CARDS = [
  {
    key: 'diet',
    icon: '🥗',
    es: "Evite alimentos con alto contenido de sodio. Consuma más frutas y verduras frescas. Limite el consumo de azúcar.",
    en: "Avoid high-sodium foods. Eat more fresh fruits and vegetables. Limit sugar intake.",
  },
  {
    key: 'exercise',
    icon: '🏃',
    es: "Realice 30 minutos de caminata moderada al día. Evite actividades de alto impacto por 2 semanas.",
    en: "Walk 30 minutes at a moderate pace daily. Avoid high-impact activities for 2 weeks.",
  },
  {
    key: 'pt',
    icon: '🧘',
    es: "Complete los ejercicios de estiramiento dos veces al día. Asista a su cita de fisioterapia el viernes.",
    en: "Complete stretching exercises twice daily. Attend your physical therapy appointment on Friday.",
  },
];

function LifestyleCard({ card, titleKey }: { card: typeof LIFESTYLE_CARDS[0]; titleKey: string }) {
  const { t } = useTranslation();
  const [lang, setLang] = useState<'es' | 'en'>('es');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    const saved = JSON.parse(localStorage.getItem('careclarity_lifestyle') || '[]');
    saved.push({ key: card.key, text: lang === 'es' ? card.es : card.en, savedAt: new Date().toISOString() });
    localStorage.setItem('careclarity_lifestyle', JSON.stringify(saved));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleShare = async () => {
    const text = `${card.icon} ${lang === 'es' ? card.es : card.en}`;
    if (navigator.share) {
      try { await navigator.share({ title: 'Care Clarity', text }); } catch {}
    } else {
      navigator.clipboard.writeText(text);
    }
  };

  return (
    <div className="bg-white dark:bg-orange-950/40 border border-orange-100 dark:border-orange-800 rounded-2xl p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xl">{card.icon}</span>
          <span className="font-semibold text-sm text-foreground">{t(titleKey)}</span>
        </div>
        <div className="flex bg-muted rounded-full p-0.5 gap-0.5 text-xs font-bold">
          <button
            onClick={() => setLang('es')}
            className={`px-2.5 py-1 rounded-full transition-all ${lang === 'es' ? 'bg-primary text-white shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
          >ES</button>
          <button
            onClick={() => setLang('en')}
            className={`px-2.5 py-1 rounded-full transition-all ${lang === 'en' ? 'bg-primary text-white shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
          >EN</button>
        </div>
      </div>
      <p className="text-sm text-foreground leading-relaxed mb-3">
        {lang === 'es' ? card.es : card.en}
      </p>
      <div className="flex gap-2">
        <button
          onClick={handleSave}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 ${saved ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700 hover:bg-orange-200'}`}
        >
          <Bookmark className="w-3.5 h-3.5" />
          {saved ? '✓ Guardado' : t('transcript.lifestyle_save')}
        </button>
        <button
          onClick={handleShare}
          className="flex-1 py-2 bg-orange-50 hover:bg-orange-100 text-orange-700 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
        >
          <Share className="w-3.5 h-3.5" />
          {t('transcript.lifestyle_share')}
        </button>
      </div>
    </div>
  );
}

export default function Transcript() {
  const { id } = useParams();
  const [, setLocation] = useLocation();
  const { t, i18n } = useTranslation();
  const [session, setSession] = useState<Session | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (id) {
      const data = getSession(id);
      if (data) setSession(data);
      else setLocation("/");
    }
  }, [id, setLocation]);

  if (!session) return null;

  const dateLocale = i18n.language === 'es' ? es : enUS;
  const sessionDate = new Date(session.date);
  const provider = session.provider || "Dra. Ana López";
  const specialty = session.specialty || "Medicina General";
  const durationMin = session.duration ? Math.round(session.duration / 60) : 12;
  const msgCount = session.messageCount || session.messages.length;
  const sessionId = session.id.slice(-4).toUpperCase();
  const filename = `${format(sessionDate, 'yyyy-MM-dd')} · ${provider} · ${specialty} · #${sessionId}`;

  const handleShare = async () => {
    const text = session.messages.map(m =>
      `[${m.speaker === 'patient' ? 'Paciente' : 'Doctor'}]: ${m.originalText}\n[Traducción]: ${m.translatedText}`
    ).join('\n\n');

    if (navigator.share) {
      try {
        await navigator.share({ title: filename, text });
      } catch (err) {
        console.log("Error sharing", err);
      }
    } else {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const prescriptions = session.messages.filter(m =>
    m.speaker === 'provider' &&
    (m.originalText.toLowerCase().includes('take') || m.originalText.toLowerCase().includes('mg'))
  );

  return (
    <Layout>
      <div className="flex flex-col h-full bg-background pb-24">

        {/* Header */}
        <div className="bg-card px-6 py-4 pt-safe border-b border-border sticky top-0 z-10 flex items-center justify-between shadow-sm">
          <div className="flex-1 min-w-0 pr-3">
            <h1 className="font-bold text-lg">{t('transcript.title')}</h1>
            <p className="text-xs text-muted-foreground truncate">{filename}</p>
          </div>
          <button
            onClick={handleShare}
            className="p-2 bg-primary/10 text-primary rounded-full hover:bg-primary/20 transition-colors flex-shrink-0"
          >
            {copied ? <CheckCircle2 className="w-5 h-5" /> : <Share className="w-5 h-5" />}
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">

          {/* Clinical Metadata Header */}
          <div className="bg-card border border-border rounded-3xl p-5 shadow-sm">
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-3">
                <span className="text-base w-6">📅</span>
                <span className="text-muted-foreground font-medium w-24 flex-shrink-0">{t('transcript.provider') === 'Provider' ? 'Date:' : 'Fecha:'}</span>
                <span className="font-semibold text-foreground">{format(sessionDate, "MMMM d, yyyy", { locale: dateLocale })}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-base w-6">👩‍⚕️</span>
                <span className="text-muted-foreground font-medium w-24 flex-shrink-0">{t('transcript.provider')}:</span>
                <span className="font-semibold text-foreground">{provider}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-base w-6">🏥</span>
                <span className="text-muted-foreground font-medium w-24 flex-shrink-0">{t('transcript.specialty')}:</span>
                <span className="font-semibold text-foreground">{specialty}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-base w-6">⏱️</span>
                <span className="text-muted-foreground font-medium w-24 flex-shrink-0">{t('transcript.duration')}:</span>
                <span className="font-semibold text-foreground">{durationMin} min</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-base w-6">💬</span>
                <span className="text-muted-foreground font-medium w-24 flex-shrink-0">{t('transcript.messages')}:</span>
                <span className="font-semibold text-foreground">{msgCount}</span>
              </div>
            </div>
          </div>

          {/* RECETAS (Prescriptions) */}
          <div className="bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 rounded-3xl p-5 shadow-sm">
            <h2 className="font-bold text-blue-800 dark:text-blue-300 flex items-center gap-2 mb-3">
              <Pill className="w-5 h-5" /> Prescriptions / Recetas
            </h2>
            <div className="space-y-3">
              {prescriptions.length > 0 ? prescriptions.map((p, i) => (
                <div key={i} className="bg-white dark:bg-blue-950/40 p-3 rounded-xl border border-blue-100 dark:border-blue-800">
                  <p className="text-sm font-medium text-foreground">{p.originalText}</p>
                  <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">{p.translatedText}</p>
                </div>
              )) : (
                <div className="bg-white dark:bg-blue-950/40 p-3 rounded-xl border border-blue-100 dark:border-blue-800">
                  <p className="text-sm text-muted-foreground italic">No specific prescriptions discussed.</p>
                </div>
              )}
            </div>
            <button
              onClick={() => setLocation("/pharmacy")}
              className="mt-4 w-full py-3 bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300 rounded-xl font-bold text-sm flex items-center justify-center gap-1 hover:bg-blue-200 dark:hover:bg-blue-900/70 transition-colors"
            >
              Go to Pharmacy <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* REFERIDOS (Referrals) */}
          <div className="bg-purple-50/50 dark:bg-purple-900/10 border border-purple-100 dark:border-purple-900/30 rounded-3xl p-5 shadow-sm">
            <h2 className="font-bold text-purple-800 dark:text-purple-300 flex items-center gap-2 mb-3">
              <UserPlus className="w-5 h-5" /> Referrals / Referidos
            </h2>
            <div className="bg-white dark:bg-purple-950/40 p-3 rounded-xl border border-purple-100 dark:border-purple-800 mb-4">
              <p className="text-sm font-medium text-foreground">See your provider for a full evaluation.</p>
              <p className="text-sm text-purple-600 dark:text-purple-400 mt-1">Consulte a su proveedor para una evaluación completa.</p>
            </div>
            <button
              onClick={() => setLocation("/referrals")}
              className="w-full py-3 bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300 rounded-xl font-bold text-sm flex items-center justify-center gap-1 hover:bg-purple-200 dark:hover:bg-purple-900/70 transition-colors"
            >
              View Referrals <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* LIFESTYLE INSTRUCTIONS */}
          <div className="bg-orange-50/50 dark:bg-orange-900/10 border border-orange-100 dark:border-orange-900/30 rounded-3xl p-5 shadow-sm">
            <h2 className="font-bold text-orange-800 dark:text-orange-300 flex items-center gap-2 mb-4">
              <span className="text-lg">🌿</span> {t('transcript.lifestyle_title')}
            </h2>
            <div className="space-y-3">
              <LifestyleCard card={LIFESTYLE_CARDS[0]} titleKey="transcript.lifestyle_diet" />
              <LifestyleCard card={LIFESTYLE_CARDS[1]} titleKey="transcript.lifestyle_exercise" />
              <LifestyleCard card={LIFESTYLE_CARDS[2]} titleKey="transcript.lifestyle_pt" />
            </div>
          </div>

          <button
            onClick={() => setLocation("/")}
            className="w-full py-4 rounded-xl font-semibold bg-muted text-foreground border border-border shadow-sm hover:bg-border transition-colors flex items-center justify-center gap-2 mt-4"
          >
            <Home className="w-5 h-5" />
            {t('transcript.back')}
          </button>
        </div>

      </div>
    </Layout>
  );
}
