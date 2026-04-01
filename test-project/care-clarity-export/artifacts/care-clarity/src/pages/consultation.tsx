import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'wouter';
import { Mic, MicOff, Volume2, X, AlertCircle } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { useSpeech, speakText } from '@/hooks/use-speech';
import { useTranslate } from '@workspace/api-client-react';
import { useHistory, Exchange } from '@/store/history';

export default function Consultation() {
  const { t } = useTranslation();
  const [, setLocation] = useLocation();
  const { addSession } = useHistory();
  const translateMutation = useTranslate();
  
  const [exchanges, setExchanges] = useState<Omit<Exchange, 'id'>[]>([]);
  const [activeRole, setActiveRole] = useState<'patient' | 'provider' | null>(null);
  
  const [patientInterim, setPatientInterim] = useState('');
  const [providerInterim, setProviderInterim] = useState('');
  
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [exchanges, patientInterim, providerInterim]);

  const handleTranslate = async (text: string, from: 'es'|'en', to: 'es'|'en', role: 'patient'|'provider') => {
    if (!text.trim()) return;
    
    try {
      const result = await translateMutation.mutateAsync({ data: { text, from, to } });
      
      const newExchange = {
        role,
        original: text,
        translated: result.translatedText,
        originalLang: from
      };
      
      setExchanges(prev => [...prev, newExchange]);
      
      // Auto-speak the translation for the other person
      if (role === 'provider') {
        speakText(result.translatedText, 'es-MX');
      }
      
    } catch (e) {
      console.error("Translation failed", e);
      // Add it anyway with error note to not lose the text
      setExchanges(prev => [...prev, {
        role,
        original: text,
        translated: t('consultation.translationError'),
        originalLang: from
      }]);
    }
  };

  const patientSpeech = useSpeech({
    lang: 'es-MX',
    onResult: (transcript, isFinal) => {
      if (isFinal) {
        setPatientInterim('');
        handleTranslate(transcript, 'es', 'en', 'patient');
        setActiveRole(null);
      } else {
        setPatientInterim(transcript);
      }
    },
    onError: () => setActiveRole(null)
  });

  const providerSpeech = useSpeech({
    lang: 'en-US',
    onResult: (transcript, isFinal) => {
      if (isFinal) {
        setProviderInterim('');
        handleTranslate(transcript, 'en', 'es', 'provider');
        setActiveRole(null);
      } else {
        setProviderInterim(transcript);
      }
    },
    onError: () => setActiveRole(null)
  });

  const togglePatientMic = () => {
    if (activeRole === 'patient') {
      patientSpeech.stopListening();
      setActiveRole(null);
    } else {
      if (activeRole === 'provider') providerSpeech.stopListening();
      setPatientInterim('');
      patientSpeech.startListening();
      setActiveRole('patient');
    }
  };

  const toggleProviderMic = () => {
    if (activeRole === 'provider') {
      providerSpeech.stopListening();
      setActiveRole(null);
    } else {
      if (activeRole === 'patient') patientSpeech.stopListening();
      setProviderInterim('');
      providerSpeech.startListening();
      setActiveRole('provider');
    }
  };

  const endSession = () => {
    if (exchanges.length > 0) {
      addSession(exchanges);
    }
    setLocation('/history');
  };

  // Unsupported browser fallback
  if (!patientSpeech.supported) {
    return (
      <AppLayout hideNav>
        <div className="flex-1 flex items-center justify-center p-6 text-center">
          <div className="bg-destructive/10 text-destructive p-6 rounded-2xl max-w-sm">
            <AlertCircle className="w-12 h-12 mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">Browser Not Supported</h2>
            <p>{t('consultation.micError')}</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <div className="flex flex-col h-[100dvh] w-full max-w-3xl mx-auto bg-background">
      {/* Header */}
      <header className="flex justify-between items-center px-4 py-3 bg-card border-b border-border z-10 shrink-0">
        <h1 className="font-bold text-lg text-foreground">Consulta</h1>
        <button 
          onClick={endSession}
          className="px-4 py-2 bg-destructive/10 text-destructive hover:bg-destructive hover:text-white rounded-full text-sm font-bold transition-colors"
        >
          {t('consultation.endSession')}
        </button>
      </header>

      {/* Transcript Area */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-6 scroll-smooth bg-slate-50 dark:bg-slate-900/50"
      >
        {exchanges.length === 0 && !patientInterim && !providerInterim && (
          <div className="h-full flex flex-col items-center justify-center text-muted-foreground opacity-50">
            <Mic className="w-16 h-16 mb-4" />
            <p>{t('consultation.saySomething')}</p>
          </div>
        )}

        {exchanges.map((ex, i) => (
          <div 
            key={i} 
            className={`flex flex-col max-w-[85%] ${ex.role === 'patient' ? 'self-start items-start' : 'self-end items-end ml-auto'}`}
          >
            <span className="text-xs font-semibold text-muted-foreground mb-1 px-1 uppercase tracking-wider">
              {ex.role === 'patient' ? t('consultation.patient') : t('consultation.provider')}
            </span>
            <div 
              className={`p-4 rounded-2xl shadow-sm ${
                ex.role === 'patient' 
                  ? 'bg-white border border-border rounded-tl-none' 
                  : 'bg-primary text-primary-foreground rounded-tr-none'
              }`}
            >
              <p className="text-lg font-medium leading-snug mb-2">{ex.original}</p>
              <div className="h-px w-full bg-current opacity-10 my-2" />
              <div className="flex items-start justify-between gap-4">
                <p className="text-base opacity-90 italic">{ex.translated}</p>
                {ex.role === 'provider' && (
                  <button 
                    onClick={() => speakText(ex.translated, 'es-MX')}
                    className="shrink-0 p-2 -mr-2 -mt-1 rounded-full hover:bg-white/20 transition-colors"
                    aria-label={t('consultation.repeat')}
                  >
                    <Volume2 className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}

        {/* Interim Results */}
        {patientInterim && (
          <div className="flex flex-col max-w-[85%] self-start items-start">
             <span className="text-xs font-semibold text-primary mb-1 px-1 animate-pulse">
              {t('consultation.listening')}
            </span>
            <div className="p-4 rounded-2xl bg-white border border-primary/30 rounded-tl-none shadow-sm">
              <p className="text-lg text-foreground/70 italic">{patientInterim}</p>
            </div>
          </div>
        )}

        {providerInterim && (
          <div className="flex flex-col max-w-[85%] self-end items-end ml-auto">
             <span className="text-xs font-semibold text-primary mb-1 px-1 animate-pulse">
              {t('consultation.listening')}
            </span>
            <div className="p-4 rounded-2xl bg-primary/90 text-white rounded-tr-none shadow-sm">
              <p className="text-lg italic opacity-80">{providerInterim}</p>
            </div>
          </div>
        )}
        
        {translateMutation.isPending && !patientInterim && !providerInterim && (
           <div className="flex justify-center my-4">
             <span className="px-4 py-2 bg-muted rounded-full text-sm animate-pulse text-muted-foreground">
               {t('consultation.translating')}
             </span>
           </div>
        )}
      </div>

      {/* Control Panels */}
      <div className="shrink-0 bg-card border-t border-border grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-border shadow-[0_-10px_20px_rgba(0,0,0,0.03)] z-20 pb-safe">
        
        {/* Patient Panel (Spanish) */}
        <div className={`p-6 flex flex-col items-center justify-center gap-3 transition-colors ${activeRole === 'patient' ? 'bg-primary/5' : ''}`}>
          <div className="text-center">
            <h3 className="font-bold text-foreground">{t('consultation.patient')}</h3>
            <p className="text-sm text-muted-foreground">{t('consultation.tapToSpeakES')}</p>
          </div>
          <button
            onClick={togglePatientMic}
            disabled={activeRole === 'provider'}
            className={`w-20 h-20 rounded-full flex items-center justify-center transition-all shadow-lg active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed ${
              activeRole === 'patient' 
                ? 'bg-destructive text-white mic-pulsing' 
                : 'bg-primary text-white hover:bg-primary/90 hover:shadow-xl hover:-translate-y-1'
            }`}
          >
            {activeRole === 'patient' ? <MicOff className="w-8 h-8" /> : <Mic className="w-8 h-8" />}
          </button>
        </div>

        {/* Provider Panel (English) */}
        <div className={`p-6 flex flex-col items-center justify-center gap-3 transition-colors ${activeRole === 'provider' ? 'bg-secondary/5' : ''}`}>
          <div className="text-center">
            <h3 className="font-bold text-foreground">{t('consultation.provider')}</h3>
            <p className="text-sm text-muted-foreground">{t('consultation.tapToSpeakEN')}</p>
          </div>
          <button
            onClick={toggleProviderMic}
            disabled={activeRole === 'patient'}
            className={`w-20 h-20 rounded-full flex items-center justify-center transition-all shadow-lg active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed ${
              activeRole === 'provider' 
                ? 'bg-destructive text-white mic-pulsing' 
                : 'bg-secondary text-white hover:bg-secondary/90 hover:shadow-xl hover:-translate-y-1'
            }`}
          >
            {activeRole === 'provider' ? <MicOff className="w-8 h-8" /> : <Mic className="w-8 h-8" />}
          </button>
        </div>

      </div>
    </div>
  );
}
