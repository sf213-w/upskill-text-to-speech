import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Layout } from "@/components/layout";
import { getSessions, deleteSession, Session } from "@/lib/storage";
import { Clock, Trash2, ChevronRight, FileText } from "lucide-react";
import { useTranslation } from "react-i18next";
import { format } from "date-fns";
import { es, enUS } from "date-fns/locale";

export default function History() {
  const { t, i18n } = useTranslation();
  const [sessions, setSessions] = useState<Session[]>([]);

  useEffect(() => {
    setSessions(getSessions().sort((a, b) => b.date - a.date));
  }, []);

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation
    if (confirm("¿Eliminar esta sesión? / Delete this session?")) {
      deleteSession(id);
      setSessions(getSessions().sort((a, b) => b.date - a.date));
    }
  };

  const dateLocale = i18n.language === 'es' ? es : enUS;

  return (
    <Layout>
      <div className="p-6">
        <div className="flex items-center gap-3 mb-8 pt-4">
          <div className="bg-primary/10 p-3 rounded-2xl text-primary">
            <Clock className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">{t('history.title')}</h1>
        </div>

        <div className="space-y-4">
          {sessions.length === 0 ? (
            <div className="text-center py-16 bg-muted/30 rounded-3xl border border-dashed border-border">
              <FileText className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
              <p className="text-muted-foreground font-medium">{t('history.empty')}</p>
            </div>
          ) : (
            sessions.map((session) => (
              <Link key={session.id} href={`/transcript/${session.id}`}>
                <div className="group bg-card border border-border p-5 rounded-2xl shadow-sm hover:shadow-md hover:border-primary/30 transition-all block cursor-pointer">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-bold text-foreground">
                        {format(session.date, "PPP", { locale: dateLocale })}
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        {format(session.date, "p", { locale: dateLocale })} • {session.messages.length} mensajes
                      </p>
                    </div>
                    <button 
                      onClick={(e) => handleDelete(session.id, e)}
                      className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-full transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  
                  {session.messages.length > 0 && (
                    <div className="bg-muted/50 p-3 rounded-xl">
                      <p className="text-sm text-foreground line-clamp-2 italic">
                        "{session.messages[0].originalText}"
                      </p>
                    </div>
                  )}

                  <div className="mt-4 flex items-center justify-between text-sm font-semibold text-primary">
                    {t('history.view')}
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </Layout>
  );
}
