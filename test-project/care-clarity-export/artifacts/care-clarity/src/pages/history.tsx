import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Trash2, MessageSquare, Calendar, ChevronDown, ChevronUp } from 'lucide-react';
import { format } from 'date-fns';
import { AppLayout } from '@/components/layout/AppLayout';
import { useHistory, Session } from '@/store/history';

export default function History() {
  const { t } = useTranslation();
  const { sessions, deleteSession } = useHistory();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <AppLayout>
      <div className="p-4 sm:p-6">
        <h1 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
          <Calendar className="w-6 h-6 text-primary" />
          {t('history.title')}
        </h1>

        {sessions.length === 0 ? (
          <div className="bg-card border border-dashed border-border rounded-3xl p-12 text-center flex flex-col items-center justify-center shadow-sm">
            <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-6">
              <MessageSquare className="w-10 h-10 text-muted-foreground/50" />
            </div>
            <p className="text-lg text-muted-foreground">{t('history.empty')}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {sessions.map((session) => {
              const isExpanded = expandedId === session.id;
              const dateStr = format(new Date(session.createdAt), 'MMM d, yyyy • h:mm a');
              
              return (
                <div 
                  key={session.id}
                  className="bg-card rounded-2xl border border-border overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                >
                  {/* Header row */}
                  <div 
                    onClick={() => toggleExpand(session.id)}
                    className="p-4 sm:p-5 flex items-center justify-between cursor-pointer bg-muted/20 hover:bg-muted/40 transition-colors"
                  >
                    <div className="flex-1">
                      <h3 className="font-bold text-foreground flex items-center gap-2">
                        {t('history.sessionAt').replace('{{date}}', dateStr)}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {session.exchanges.length} exchanges
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          if (window.confirm(t('history.confirmDelete'))) {
                            deleteSession(session.id);
                          }
                        }}
                        className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-full transition-colors"
                        aria-label={t('history.delete')}
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                      {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </div>
                  </div>

                  {/* Expanded Content */}
                  {isExpanded && (
                    <div className="p-4 sm:p-5 border-t border-border space-y-4 bg-slate-50/50 dark:bg-slate-900/20">
                      {session.exchanges.map((ex) => (
                        <div key={ex.id} className="flex flex-col gap-1 border-l-2 pl-4 py-1" style={{ borderColor: ex.role === 'patient' ? 'hsl(var(--primary))' : 'hsl(var(--secondary))' }}>
                          <span className="text-xs font-bold uppercase tracking-wider" style={{ color: ex.role === 'patient' ? 'hsl(var(--primary))' : 'hsl(var(--secondary))' }}>
                            {ex.role === 'patient' ? t('consultation.patient') : t('consultation.provider')}
                          </span>
                          <p className="text-base text-foreground">{ex.original}</p>
                          <p className="text-sm text-muted-foreground italic">{ex.translated}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
