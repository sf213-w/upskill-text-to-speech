import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { ShieldCheck, Mic, ChevronRight, ChevronDown } from 'lucide-react';
import { setOnboardingCompleted, saveLegalConsent } from '@/lib/storage';

const LOGO_URL = `${import.meta.env.BASE_URL}logo.png`;

const LEGAL_ITEMS = [
  { key: 'privacy', icon: '📄' },
  { key: 'hipaa', icon: '🏥' },
  { key: 'terms', icon: '📋' },
  { key: 'data_rights', icon: '🗑️' },
];

function LegalScreen({ onAgree }: { onAgree: () => void }) {
  const { t, i18n } = useTranslation();
  const [expanded, setExpanded] = useState<string | null>(null);
  const [canAgree, setCanAgree] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    if (el.scrollTop + el.clientHeight >= el.scrollHeight - 20) {
      setCanAgree(true);
    }
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    if (el.scrollHeight <= el.clientHeight) setCanAgree(true);
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-background flex flex-col">
      {/* Title bar */}
      <div className="bg-gradient-to-br from-primary/10 to-secondary/10 px-6 py-6 flex items-center justify-center rounded-b-[32px] flex-shrink-0">
        <div className="text-center">
          <span className="text-3xl mb-2 block">⚖️</span>
          <h2 className="text-xl font-bold text-foreground">{t('legal.title')}</h2>
        </div>
      </div>

      {/* Scrollable legal content */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto p-6 space-y-3"
      >
        {LEGAL_ITEMS.map((item) => (
          <div key={item.key} className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
            <button
              onClick={() => setExpanded(expanded === item.key ? null : item.key)}
              className="w-full p-4 flex items-center justify-between text-left"
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">{item.icon}</span>
                <span className="font-semibold text-sm text-foreground">
                  {t(`legal.${item.key}_title`)}
                </span>
              </div>
              <ChevronDown
                className={`w-4 h-4 text-muted-foreground flex-shrink-0 transition-transform ${expanded === item.key ? 'rotate-180' : ''}`}
              />
            </button>
            {expanded === item.key && (
              <div className="px-4 pb-4 pt-0">
                <p className="text-sm text-muted-foreground leading-relaxed border-t border-border pt-3">
                  {t(`legal.${item.key}_body`)}
                </p>
              </div>
            )}
          </div>
        ))}

        {/* Scroll hint */}
        {!canAgree && (
          <p className="text-center text-xs text-muted-foreground py-2">
            {t('legal.scroll_to_accept')}
          </p>
        )}
        <div className="h-4" />
      </div>

      {/* Agree button */}
      <div className="p-6 flex-shrink-0 border-t border-border bg-background">
        <button
          onClick={onAgree}
          disabled={!canAgree}
          className={`w-full py-4 rounded-2xl font-semibold text-base transition-all flex items-center justify-center gap-2 ${
            canAgree
              ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/25 hover:opacity-90 active:scale-[0.98]'
              : 'bg-muted text-muted-foreground cursor-not-allowed'
          }`}
        >
          {t('legal.accept_btn')}
          {canAgree && <ChevronRight className="w-5 h-5" />}
        </button>
      </div>
    </div>
  );
}

export function Onboarding({ onComplete }: { onComplete: () => void }) {
  const { t, i18n } = useTranslation();
  const [step, setStep] = useState(0);

  const steps = [
    {
      visual: 'logo' as const,
      title: t('onboarding.step1_title'),
      desc: t('onboarding.step1_desc'),
      btn: t('onboarding.btn_start')
    },
    {
      visual: <Mic className="w-16 h-16 text-secondary" />,
      title: t('onboarding.step2_title'),
      desc: t('onboarding.step2_desc'),
      btn: t('common.confirm')
    },
  ];

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      setStep(2);
    }
  };

  const handleSkip = () => {
    const consent = {
      privacyAccepted: true,
      hipaaAccepted: true,
      termsAccepted: true,
      dataRightsAccepted: true,
      acceptedAt: new Date().toISOString(),
      acceptedLanguage: i18n.language,
    };
    saveLegalConsent(consent);
    setOnboardingCompleted();
    onComplete();
  };

  const handleLegalAgree = () => {
    const consent = {
      privacyAccepted: true,
      hipaaAccepted: true,
      termsAccepted: true,
      dataRightsAccepted: true,
      acceptedAt: new Date().toISOString(),
      acceptedLanguage: i18n.language,
    };
    saveLegalConsent(consent);
    setOnboardingCompleted();
    onComplete();
  };

  if (step === 2) {
    return <LegalScreen onAgree={handleLegalAgree} />;
  }

  const isLogoStep = steps[step].visual === 'logo';

  return (
    <div className="fixed inset-0 z-50 bg-background flex flex-col">
      {/* Visual Header */}
      <div className="relative h-[55%] bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center rounded-b-[40px] overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.1, opacity: 0 }}
            transition={{ type: "spring", bounce: 0.4 }}
            className="relative z-10 flex items-center justify-center w-full px-4"
          >
            {isLogoStep ? (
              <img
                src={LOGO_URL}
                alt="Care Clarity logo"
                className="w-full object-contain scale-[1.25]"
              />
            ) : (
              <div className="bg-white p-6 rounded-3xl shadow-xl shadow-primary/10">
                {steps[step].visual}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Content Area */}
      <div className="flex-1 flex flex-col p-8 justify-between">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -20, opacity: 0 }}
            className="text-center"
          >
            <h2 className="text-2xl font-bold text-foreground mb-4 font-display">
              {steps[step].title}
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
              {steps[step].desc}
            </p>
          </motion.div>
        </AnimatePresence>

        <div className="space-y-4">
          <div className="flex justify-center gap-2 mb-8">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className={`h-2 rounded-full transition-all duration-300 ${i === step ? 'w-8 bg-primary' : 'w-2 bg-muted'}`}
              />
            ))}
          </div>

          <button
            onClick={handleNext}
            className="w-full py-4 rounded-2xl font-semibold text-lg bg-primary text-primary-foreground shadow-lg shadow-primary/25 hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            {steps[step].btn}
            <ChevronRight className="w-5 h-5" />
          </button>

          <button
            onClick={handleSkip}
            className="w-full py-3 rounded-2xl font-medium text-muted-foreground hover:bg-muted/50 active:scale-[0.98] transition-all"
          >
            {t('onboarding.btn_skip')}
          </button>
        </div>
      </div>
    </div>
  );
}
