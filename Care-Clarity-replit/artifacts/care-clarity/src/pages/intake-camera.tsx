import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Layout } from "@/components/layout";
import { ArrowLeft, Loader2, RefreshCcw } from "lucide-react";

export default function IntakeCamera() {
  const [, setLocation] = useLocation();
  const [processing, setProcessing] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setProcessing(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Layout hideNav>
      <div className="flex flex-col h-[100dvh] bg-black">
        {/* Header */}
        <div className="px-4 py-4 pt-safe flex items-center gap-3 bg-black text-white z-10 relative">
          <button onClick={() => setLocation("/intake")} className="p-2 hover:bg-white/10 rounded-full text-white">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="font-bold text-lg">Camera — Paper Form</h1>
            <p className="text-xs text-white/60">OCR + Spanish overlay</p>
          </div>
        </div>

        {/* Camera Viewport */}
        <div className="flex-1 relative flex flex-col">
          {/* Image Placeholder */}
          <div className="absolute inset-0 bg-zinc-900 flex items-center justify-center overflow-hidden">
            <img 
              src="https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&q=80&w=400" 
              alt="Paper Form" 
              className="w-full h-full object-cover opacity-40 grayscale"
            />
            {processing ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm z-20">
                <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
                <p className="text-white font-semibold">Processing OCR...</p>
                <p className="text-white/60 text-xs mt-2">&lt;5 seconds</p>
              </div>
            ) : (
              /* Spanish Overlay UI */
              <div className="absolute inset-4 mt-8 bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl border border-white p-6 z-20">
                <div className="flex justify-between items-center mb-6 pb-4 border-b border-border/50">
                  <h3 className="font-bold text-primary">Campos Traducidos</h3>
                  <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-bold">Completado ✓</span>
                </div>
                
                <div className="space-y-5">
                  <div>
                    <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Nombre del paciente</label>
                    <div className="border-b-2 border-primary/30 pb-1 text-sm font-medium">Maria Gonzalez</div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Fecha de nacimiento</label>
                    <div className="border-b-2 border-primary/30 pb-1 text-sm font-medium">03/15/1981</div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Alergias conocidas</label>
                    <div className="border-b-2 border-dashed border-primary/30 pb-1 text-sm text-muted-foreground italic h-6">Ninguna</div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Medicamentos</label>
                    <div className="border-b-2 border-dashed border-primary/30 pb-1 text-sm text-muted-foreground italic h-6">Ibuprofeno</div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Cirugías previas</label>
                    <div className="border-b-2 border-dashed border-primary/30 pb-1 text-sm text-muted-foreground italic h-6">Apendicectomía (2010)</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Controls */}
        <div className="bg-black p-6 pb-safe border-t border-white/10 z-10 relative">
          <div className="flex gap-4">
            <button 
              onClick={() => setProcessing(true)} 
              className="flex-1 py-4 bg-white/10 text-white rounded-xl font-bold hover:bg-white/20 transition-colors flex justify-center items-center gap-2"
            >
              <RefreshCcw className="w-5 h-5" /> Retake
            </button>
            <button 
              onClick={() => setLocation("/intake")}
              disabled={processing}
              className="flex-[2] py-4 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              Save & Continue →
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}