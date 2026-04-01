import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Mic, PhoneOff, MicOff, CheckCircle2 } from "lucide-react";
import { Layout } from "@/components/layout";

export default function BookingCall() {
  const [, setLocation] = useLocation();
  const [seconds, setSeconds] = useState(0);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds(s => s + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `00:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Layout hideNav>
      <div className="flex flex-col h-[100dvh] bg-background relative">
        
        {/* Header */}
        <div className="bg-card px-6 py-4 pt-safe border-b border-border flex flex-col items-center justify-center shadow-sm z-10">
          <h1 className="font-bold text-lg">Call to: Dra. Ana López</h1>
          <p className="text-primary font-mono text-xl mt-1 tracking-wider">{formatTime(seconds)}</p>
        </div>

        {/* Call Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6 flex flex-col">
          
          {/* Patient Pair */}
          <div className="flex flex-col gap-2">
            <div className="flex gap-4">
              <div className="flex-1 bg-white border border-primary/20 p-4 rounded-2xl rounded-tl-sm shadow-sm relative">
                <div className="text-[10px] uppercase font-bold text-primary mb-2">ESPAÑOL (You)</div>
                <p className="font-medium text-foreground">Hola, me gustaría programar una cita para la próxima semana.</p>
              </div>
              <div className="flex-1 bg-muted p-4 rounded-2xl rounded-tr-sm shadow-sm relative">
                <div className="text-[10px] uppercase font-bold text-muted-foreground mb-2">ENGLISH (Office)</div>
                <p className="font-medium text-muted-foreground">Hello, I would like to schedule an appointment for next week.</p>
              </div>
            </div>
            <div className="text-center text-xs text-muted-foreground font-medium flex items-center justify-center gap-1">
              <span>Latency: &lt;2s</span> • <span>Bidirectional ES↔EN</span>
            </div>
          </div>

          {/* Office Pair */}
          <div className="flex flex-col gap-2 mt-4">
            <div className="flex gap-4">
              <div className="flex-1 bg-secondary text-white p-4 rounded-2xl rounded-tl-sm shadow-sm relative">
                <div className="text-[10px] uppercase font-bold text-white/70 mb-2">ENGLISH (Office)</div>
                <p className="font-medium">We have availability on Tuesday at 10 AM. Does that work for you?</p>
              </div>
              <div className="flex-1 bg-secondary/10 border border-secondary/20 p-4 rounded-2xl rounded-tr-sm shadow-sm relative">
                <div className="text-[10px] uppercase font-bold text-secondary mb-2">ESPAÑOL (Translated)</div>
                <p className="font-medium text-secondary">Tenemos disponibilidad el martes a las 10 AM. ¿Le funciona eso?</p>
              </div>
            </div>
          </div>
          
          {/* Save indicator */}
          <div className="mt-auto mb-4 flex justify-center">
            <div className="bg-green-50 text-green-700 border border-green-200 px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2 shadow-sm">
              <CheckCircle2 className="w-4 h-4" />
              Transcript saved on device
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-card border-t border-border p-6 pb-safe flex flex-col gap-4">
          <div className="flex justify-center gap-6">
            <button 
              onClick={() => setIsMuted(!isMuted)}
              className={`w-16 h-16 rounded-full flex items-center justify-center transition-all ${isMuted ? 'bg-muted text-muted-foreground' : 'bg-primary/10 text-primary border border-primary/20'}`}
            >
              {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
            </button>
            <button 
              onClick={() => setLocation("/book")}
              className="w-16 h-16 rounded-full bg-destructive text-white flex items-center justify-center shadow-lg hover:bg-destructive/90 transition-all"
            >
              <PhoneOff className="w-6 h-6" />
            </button>
          </div>
          <button
            onClick={() => setLocation("/intake")}
            className="w-full py-4 bg-primary text-white rounded-xl font-bold shadow-md hover:bg-primary/90 transition-colors mt-2"
          >
            Continue to Intake Forms →
          </button>
        </div>

      </div>
    </Layout>
  );
}