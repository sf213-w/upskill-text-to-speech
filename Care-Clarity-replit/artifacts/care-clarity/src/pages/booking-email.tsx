import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Layout } from "@/components/layout";
import { ArrowLeft, Send, Languages } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { translate } from "@/lib/translate";

export default function BookingEmail() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [message, setMessage] = useState("");
  const [translatedMessage, setTranslatedMessage] = useState("");
  const [isTranslating, setIsTranslating] = useState(false);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (message.trim()) {
        setIsTranslating(true);
        const trans = await translate(message, 'es', 'en');
        setTranslatedMessage(trans);
        setIsTranslating(false);
      } else {
        setTranslatedMessage("");
      }
    }, 800);

    return () => clearTimeout(timer);
  }, [message]);

  const handleSend = () => {
    toast({
      title: "Correo Enviado",
      description: "Su mensaje ha sido enviado a la oficina de la Dra. Ana López.",
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
          <h1 className="font-bold text-lg">Correo Electrónico</h1>
        </div>

        <div className="p-6 space-y-6 flex-1 flex flex-col">
          <div className="flex-1 flex flex-col gap-6">
            
            {/* Input Section */}
            <div className="flex-1 flex flex-col">
              <label className="text-sm font-bold uppercase tracking-wider text-primary mb-2 flex items-center gap-2">
                YOUR MESSAGE (Spanish)
              </label>
              <textarea 
                value={message}
                onChange={e => setMessage(e.target.value)}
                placeholder="Escribe tu mensaje aquí..."
                className="flex-1 bg-card border-2 border-primary/20 rounded-2xl p-4 text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary resize-none min-h-[150px]"
              />
            </div>

            {/* Translated Output Section */}
            <div className="flex-1 flex flex-col bg-muted/50 rounded-2xl p-4 border border-border">
              <label className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-2 flex items-center justify-between">
                <span className="flex items-center gap-2">TRANSLATED (English — sent)</span>
                {isTranslating && <Languages className="w-4 h-4 animate-pulse text-primary" />}
              </label>
              <div className="flex-1 bg-white dark:bg-black/20 rounded-xl p-4 border border-border text-muted-foreground italic overflow-y-auto">
                {translatedMessage || "Translation will appear here..."}
              </div>
            </div>

          </div>

          <button 
            onClick={handleSend}
            disabled={!message.trim()}
            className="w-full py-4 bg-primary text-white rounded-xl font-bold shadow-md hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-5 h-5" /> Send Email →
          </button>
        </div>
      </div>
    </Layout>
  );
}