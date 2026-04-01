import { useState } from "react";
import { useLocation } from "wouter";
import { Layout } from "@/components/layout";
import { ArrowLeft, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function BookingForm() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [reason, setReason] = useState("");
  const [date, setDate] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "¡Formulario Enviado!",
      description: "Su solicitud ha sido enviada a la oficina.",
    });
    setTimeout(() => setLocation("/book"), 1500);
  };

  return (
    <Layout>
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="bg-card px-4 py-4 border-b border-border flex items-center gap-3 sticky top-0 z-10">
          <button onClick={() => setLocation("/book")} className="p-2 hover:bg-muted rounded-full">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="font-bold text-lg">Formulario de Reserva</h1>
        </div>

        <div className="p-6 space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-1">Nombre completo</label>
              <input type="text" value="Maria Gonzalez" readOnly className="w-full bg-muted border border-border rounded-xl p-3 text-foreground" />
            </div>
            
            <div>
              <label className="block text-sm font-semibold mb-1">Fecha de nacimiento</label>
              <input type="text" value="03/15/1981" readOnly className="w-full bg-muted border border-border rounded-xl p-3 text-foreground" />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1">Número de seguro</label>
              <input type="text" value="INS-4829-XXXX" readOnly className="w-full bg-muted border border-border rounded-xl p-3 text-foreground" />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1 text-primary">Motivo de la visita *</label>
              <textarea 
                value={reason}
                onChange={e => setReason(e.target.value)}
                placeholder="Ej: Dolor de cabeza frecuente..."
                className="w-full bg-card border-2 border-primary/20 rounded-xl p-3 text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary min-h-[100px]"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1 text-primary">Fecha preferida *</label>
              <input 
                type="date" 
                value={date}
                onChange={e => setDate(e.target.value)}
                className="w-full bg-card border-2 border-primary/20 rounded-xl p-3 text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                required
              />
            </div>

            {/* Preview Box */}
            <div className="mt-8 bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800 rounded-2xl p-4">
              <h3 className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase mb-3 flex items-center gap-2">
                Preview (English — sent to office)
              </h3>
              <div className="space-y-2 text-sm text-foreground/80 font-mono bg-white dark:bg-black/20 p-3 rounded-xl border border-blue-100 dark:border-blue-900/50">
                <p>Name: Maria Gonzalez</p>
                <p>DOB: 03/15/1981</p>
                <p>Ins: INS-4829-XXXX</p>
                <p>Reason: {reason ? "[Translated Reason]" : "..."}</p>
                <p>Pref. Date: {date || "..."}</p>
              </div>
            </div>

            <button type="submit" className="w-full py-4 bg-primary text-white rounded-xl font-bold shadow-md hover:bg-primary/90 transition-colors mt-6 flex items-center justify-center gap-2">
              <Send className="w-5 h-5" /> Enviar / Submit →
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
}