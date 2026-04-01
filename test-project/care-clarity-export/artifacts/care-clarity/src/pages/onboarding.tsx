import { useState } from 'react';
import { useLocation } from 'wouter';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Mic, HeartHandshake } from 'lucide-react';
import { useSettings } from '@/store/settings';
import { AppLayout } from '@/components/layout/AppLayout';

export default function Onboarding() {
  const [step, setStep] = useState(0);
  const [, setLocation] = useLocation();
  const { t } = useTranslation();
  const { setOnboardingDone } = useSettings();

  const handleComplete = () => {
    setOnboardingDone(true);
    setLocation('/');
  };

  const nextStep = () => {
    if (step < 2) setStep(step + 1);
    else handleComplete();
  };

  const requestMicPermission = async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      nextStep();
    } catch (err) {
      console.error("Mic permission denied", err);
      // Even if denied, let them proceed, but they won't be able to use the core feature well
      nextStep(); 
    }
  };

  const steps = [
    {
      icon: <HeartHandshake className="w-24 h-24 text-primary" />,
      title: t('onboarding.welcome'),
      desc: t('onboarding.desc1'),
      action: <button onClick={nextStep} className="w-full py-4 rounded-2xl bg-primary text-white font-bold text-lg shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all active:scale-95">{t('onboarding.getStarted')}</button>
    },
    {
      icon: <Mic className="w-24 h-24 text-secondary" />,
      title: t('onboarding.micTitle'),
      desc: t('onboarding.micDesc'),
      action: <button onClick={requestMicPermission} className="w-full py-4 rounded-2xl bg-secondary text-white font-bold text-lg shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all active:scale-95">{t('onboarding.allowMic')}</button>
    },
    {
      icon: <Shield className="w-24 h-24 text-accent" />,
      title: t('onboarding.privacyTitle'),
      desc: t('onboarding.privacyDesc'),
      action: <button onClick={handleComplete} className="w-full py-4 rounded-2xl bg-primary text-white font-bold text-lg shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all active:scale-95">{t('onboarding.finish')}</button>
    }
  ];

  return (
    <AppLayout hideNav hideHeader>
      <div className="flex-1 flex flex-col items-center justify-center p-6 relative overflow-hidden">
        
        {/* Background decorative blobs */}
        <div className="absolute top-[-10%] left-[-10%] w-64 h-64 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute bottom-[-10%] right-[-10%] w-64 h-64 rounded-full bg-secondary/10 blur-3xl" />

        <div className="w-full flex justify-end absolute top-6 right-6 z-10">
          <button onClick={handleComplete} className="text-muted-foreground font-medium px-4 py-2 hover:bg-muted rounded-full transition-colors">
            {t('onboarding.skip')}
          </button>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center w-full max-w-sm mt-12">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col items-center text-center w-full"
            >
              <div className="mb-8 p-6 bg-card rounded-full shadow-xl shadow-black/5">
                {steps[step].icon}
              </div>
              <h1 className="text-3xl font-bold text-foreground mb-4">{steps[step].title}</h1>
              <p className="text-lg text-muted-foreground mb-12 leading-relaxed">
                {steps[step].desc}
              </p>
              
              <div className="w-full mt-auto">
                {steps[step].action}
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="flex gap-2 mt-8">
            {[0, 1, 2].map((i) => (
              <div 
                key={i} 
                className={`w-2 h-2 rounded-full transition-all duration-300 ${i === step ? 'w-6 bg-primary' : 'bg-primary/20'}`} 
              />
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
