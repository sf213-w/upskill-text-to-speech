import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { Mic, MicOff, Square, Send, Volume2, Shield } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Layout } from "@/components/layout";
import { useSpeechRecognition, useTTS } from "@/hooks/use-speech";
import { translate } from "@/lib/translate";
import { saveSession, Message } from "@/lib/storage";
import { motion, AnimatePresence } from "framer-motion";

const generateId = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).substring(2, 15);
};

export default function Consultation() {
  const [, setLocation] = useLocation();
  const { t } = useTranslation();
  const [messages, setMessages] = useState<Message[]>([]);
  const [consentGiven, setConsentGiven] = useState<boolean | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  
  // Patient Speech (ES)
  const patientSpeech = useSpeechRecognition('es-MX');
  // Provider Speech (EN)
  const providerSpeech = useSpeechRecognition('en-US');
  
  const tts = useTTS();

  const [activeSpeaker, setActiveSpeaker] = useState<'patient'|'provider'|null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, patientSpeech.interimTranscript, providerSpeech.interimTranscript]);

  // Handle Patient Final Speech
  useEffect(() => {
    if (patientSpeech.transcript && !isProcessing) {
      const text = patientSpeech.transcript.trim();
      if (text) {
        handleTranslation(text, 'es', 'en', 'patient');
        patientSpeech.resetTranscript();
      }
    }
  }, [patientSpeech.transcript]);

  // Handle Provider Final Speech
  useEffect(() => {
    if (providerSpeech.transcript && !isProcessing) {
      const text = providerSpeech.transcript.trim();
      if (text) {
        handleTranslation(text, 'en', 'es', 'provider');
        providerSpeech.resetTranscript();
      }
    }
  }, [providerSpeech.transcript]);

  const handleTranslation = async (text: string, from: 'es'|'en', to: 'es'|'en', speaker: 'patient'|'provider') => {
    setIsProcessing(true);
    
    // Optimistic UI update
    const msgId = generateId();
    setMessages(prev => [...prev, {
      id: msgId,
      originalText: text,
      translatedText: '...',
      speaker,
      timestamp: Date.now()
    }]);

    const translated = await translate(text, from, to);
    
    setMessages(prev => prev.map(m => 
      m.id === msgId ? { ...m, translatedText: translated } : m
    ));
    
    setIsProcessing(false);
  };

  const toggleMic = (speaker: 'patient'|'provider') => {
    if (activeSpeaker === speaker) {
      // Turn off
      if (speaker === 'patient') patientSpeech.stopListening();
      if (speaker === 'provider') providerSpeech.stopListening();
      setActiveSpeaker(null);
    } else {
      // Turn on (and turn off other)
      if (speaker === 'patient') {
        providerSpeech.stopListening();
        patientSpeech.startListening();
      } else {
        patientSpeech.stopListening();
        providerSpeech.startListening();
      }
      setActiveSpeaker(speaker);
    }
  };

  const handleEndSession = () => {
    if (messages.length === 0) {
      setLocation("/");
      return;
    }
    
    patientSpeech.stopListening();
    providerSpeech.stopListening();

    const sessionData = {
      id: generateId(),
      date: Date.now(),
      messages
    };
    saveSession(sessionData);
    setLocation(`/transcript/${sessionData.id}`);
  };

  // Text fallback states
  const [textInput, setTextInput] = useState("");
  const handleTextSubmit = (speaker: 'patient'|'provider') => {
    if (!textInput.trim()) return;
    const from = speaker === 'patient' ? 'es' : 'en';
    const to = speaker === 'patient' ? 'en' : 'es';
    handleTranslation(textInput, from, to, speaker);
    setTextInput("");
  };

  if (consentGiven === null) {
    return (
      <Layout hideNav>
        <div className="flex flex-col h-[100dvh] bg-background items-center justify-center p-6">
          <div className="max-w-sm w-full bg-card border border-border rounded-3xl p-8 shadow-xl text-center">
            <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-6">
              <Shield className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-foreground mb-3">{t('consultation.consent_title')}</h2>
            <p className="text-muted-foreground mb-8 text-sm leading-relaxed">
              {t('consultation.consent_desc')}
            </p>
            <div className="space-y-3">
              <button 
                onClick={() => setConsentGiven(true)}
                className="w-full py-4 bg-primary text-white rounded-xl font-bold shadow-md hover:bg-primary/90 transition-colors"
              >
                {t('consultation.consent_yes')}
              </button>
              <button 
                onClick={() => setLocation("/")}
                className="w-full py-4 bg-transparent text-foreground border-2 border-border rounded-xl font-bold hover:bg-muted transition-colors"
              >
                {t('consultation.consent_no')}
              </button>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout hideNav>
      <div className="flex flex-col h-[100dvh] bg-background relative">
        
        {/* Top Header */}
        <div className="absolute top-0 inset-x-0 z-10 flex justify-between items-center p-4 pt-safe pointer-events-none">
          <div className="bg-background/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-border shadow-sm flex items-center gap-2 pointer-events-auto">
             <Shield className="w-3.5 h-3.5 text-secondary" />
             <span className="text-[10px] font-semibold text-foreground/80">{t('consultation.privacy_badge')}</span>
          </div>
          <button 
            onClick={handleEndSession}
            className="bg-destructive/10 text-destructive px-4 py-2 rounded-full font-semibold text-sm hover:bg-destructive hover:text-white transition-colors pointer-events-auto"
          >
            {t('consultation.end_session')}
          </button>
        </div>

        {/* --- PATIENT PANEL (TOP) --- */}
        <div className={`flex-1 flex flex-col transition-all duration-500 border-b-2 border-border ${activeSpeaker === 'provider' ? 'opacity-40 grayscale-[30%]' : 'bg-primary/5'}`}>
          <div className="flex-1 overflow-y-auto p-6 pt-20 flex flex-col justify-end" ref={activeSpeaker === 'patient' ? scrollRef : null}>
             <AnimatePresence>
                {messages.filter(m => m.speaker === 'patient').slice(-3).map(m => (
                  <motion.div 
                    initial={{opacity: 0, y: 10}} animate={{opacity: 1, y: 0}} 
                    key={m.id} className="mb-4 bg-white p-4 rounded-2xl shadow-sm border border-primary/10"
                  >
                    <p className="text-lg font-medium text-foreground">{m.originalText}</p>
                    <p className="text-sm text-primary font-medium mt-1 border-t border-border/50 pt-2">{m.translatedText}</p>
                  </motion.div>
                ))}
             </AnimatePresence>
             {activeSpeaker === 'patient' && patientSpeech.interimTranscript && (
                <motion.div initial={{opacity: 0}} animate={{opacity: 1}} className="text-lg font-medium text-muted-foreground italic mb-4">
                  "{patientSpeech.interimTranscript}"
                </motion.div>
             )}
          </div>
          
          <div className="p-4 bg-white/50 backdrop-blur-md flex flex-col items-center gap-3">
             <div className="text-xs font-bold uppercase tracking-wider text-primary">{t('consultation.patient_title')}</div>
             <button
                onClick={() => toggleMic('patient')}
                className={`w-16 h-16 rounded-full flex items-center justify-center text-white transition-all shadow-lg relative ${
                  activeSpeaker === 'patient' 
                    ? 'bg-destructive animate-pulse-ring' 
                    : 'bg-primary hover:bg-primary/90'
                }`}
             >
                {activeSpeaker === 'patient' ? <Square className="w-6 h-6 fill-current" /> : <Mic className="w-8 h-8" />}
             </button>
             {!patientSpeech.isSupported && (
               <div className="flex w-full gap-2 mt-2">
                 <input 
                   type="text" value={activeSpeaker === 'patient' ? textInput : ""}
                   onChange={e => {setActiveSpeaker('patient'); setTextInput(e.target.value);}}
                   className="flex-1 bg-white border border-border rounded-xl px-4 text-sm"
                   placeholder={t('consultation.input_placeholder')}
                 />
                 <button onClick={() => handleTextSubmit('patient')} className="bg-primary text-white p-2 rounded-xl">
                   <Send className="w-5 h-5" />
                 </button>
               </div>
             )}
          </div>
        </div>

        {/* --- PROVIDER PANEL (BOTTOM) --- */}
        <div className={`flex-1 flex flex-col transition-all duration-500 ${activeSpeaker === 'patient' ? 'opacity-40 grayscale-[30%]' : 'bg-secondary/5'}`}>
          <div className="p-4 bg-white/50 backdrop-blur-md flex flex-col items-center gap-3 border-b border-border/50">
             <button
                onClick={() => toggleMic('provider')}
                className={`w-16 h-16 rounded-full flex items-center justify-center text-white transition-all shadow-lg relative ${
                  activeSpeaker === 'provider' 
                    ? 'bg-destructive animate-pulse-ring' 
                    : 'bg-secondary hover:bg-secondary/90'
                }`}
             >
                {activeSpeaker === 'provider' ? <Square className="w-6 h-6 fill-current" /> : <Mic className="w-8 h-8" />}
             </button>
             <div className="text-xs font-bold uppercase tracking-wider text-secondary">{t('consultation.provider_title')}</div>
             {!providerSpeech.isSupported && (
               <div className="flex w-full gap-2 mt-2">
                 <input 
                   type="text" value={activeSpeaker === 'provider' ? textInput : ""}
                   onChange={e => {setActiveSpeaker('provider'); setTextInput(e.target.value);}}
                   className="flex-1 bg-white border border-border rounded-xl px-4 text-sm"
                   placeholder={t('consultation.input_placeholder')}
                 />
                 <button onClick={() => handleTextSubmit('provider')} className="bg-secondary text-white p-2 rounded-xl">
                   <Send className="w-5 h-5" />
                 </button>
               </div>
             )}
          </div>

          <div className="flex-1 overflow-y-auto p-6 flex flex-col" ref={activeSpeaker === 'provider' ? scrollRef : null}>
             <AnimatePresence>
                {messages.filter(m => m.speaker === 'provider').slice(-3).map(m => (
                  <motion.div 
                    initial={{opacity: 0, y: -10}} animate={{opacity: 1, y: 0}} 
                    key={m.id} className="mb-4 bg-white p-4 rounded-2xl shadow-sm border border-secondary/10"
                  >
                    <p className="text-lg font-medium text-foreground">{m.originalText}</p>
                    <div className="mt-2 pt-2 border-t border-border/50 flex justify-between items-center">
                      <p className="text-sm text-secondary font-medium">{m.translatedText}</p>
                      <button 
                        onClick={() => tts.speak(m.translatedText, 'es-MX')}
                        className="p-2 text-secondary hover:bg-secondary/10 rounded-full transition-colors"
                        title={t('consultation.read_aloud')}
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                ))}
             </AnimatePresence>
             {activeSpeaker === 'provider' && providerSpeech.interimTranscript && (
                <motion.div initial={{opacity: 0}} animate={{opacity: 1}} className="text-lg font-medium text-muted-foreground italic mt-4">
                  "{providerSpeech.interimTranscript}"
                </motion.div>
             )}
          </div>
        </div>

      </div>
    </Layout>
  );
}
