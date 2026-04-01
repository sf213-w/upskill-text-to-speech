import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, MapPin, Phone, Mail, Globe, UserRound, Clock, CheckCircle, Loader2 } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

const LANG_NAMES: Record<string, string> = {
  en: 'English', es: 'Spanish', es_MX: 'Spanish', zh: 'Mandarin',
  pt: 'Portuguese', fr: 'French', ar: 'Arabic', hi: 'Hindi',
  ko: 'Korean', vi: 'Vietnamese', tl: 'Tagalog', ru: 'Russian',
};

const langLabel = (code: string) => LANG_NAMES[code] ?? code.toUpperCase();

interface CareProvider {
  id: string;
  name: string;
  provider_type: string;
  specialty: string;
  languages_spoken: string[];
  phone: string | null;
  email: string | null;
  website_url: string | null;
  booking_url: string | null;
  address_line1: string | null;
  address_line2: string | null;
  city: string | null;
  state: string | null;
  zip_code: string | null;
  accepts_new_patients: boolean;
  average_wait_time_days: number | null;
  notes: string | null;
}

export default function Providers() {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [providers, setProviders] = useState<CareProvider[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProviders = async () => {
      setLoading(true);
      setError(null);

      if (!isSupabaseConfigured || !supabase) {
        setError('Database not configured.');
        setLoading(false);
        return;
      }

      const { data, error: fetchError } = await supabase
        .from('care_providers')
        .select('*')
        .order('name', { ascending: true });

      if (fetchError) {
        setError('Could not load providers. Please try again.');
        console.warn('care_providers fetch error:', fetchError.message);
      } else {
        setProviders(data ?? []);
      }
      setLoading(false);
    };

    fetchProviders();
  }, []);

  const filtered = providers.filter(p => {
    const q = searchTerm.toLowerCase();
    return (
      p.name.toLowerCase().includes(q) ||
      p.specialty.toLowerCase().includes(q) ||
      (p.city ?? '').toLowerCase().includes(q) ||
      p.languages_spoken.some(l => langLabel(l).toLowerCase().includes(q))
    );
  });

  const formatAddress = (p: CareProvider) => {
    const parts = [p.address_line1, p.city, p.state].filter(Boolean);
    return parts.length > 0 ? parts.join(', ') : null;
  };

  return (
    <AppLayout>
      <div className="p-4 sm:p-6 flex flex-col h-full">

        {/* Sticky header + search */}
        <div className="sticky top-16 z-30 bg-background/95 backdrop-blur-md pb-4 pt-2 -mx-4 px-4 sm:-mx-6 sm:px-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-foreground">{t('providers.title')}</h1>
            {!loading && (
              <span className="text-sm text-muted-foreground">{filtered.length} found</span>
            )}
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-muted-foreground" />
            </div>
            <input
              type="text"
              className="block w-full pl-11 pr-4 py-4 bg-card border border-border rounded-2xl text-foreground placeholder-muted-foreground focus:ring-2 focus:ring-primary focus:border-primary transition-all shadow-sm"
              placeholder={t('providers.searchPlaceholder')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Body */}
        <div className="mt-4 space-y-4 pb-4">

          {loading && (
            <div className="flex flex-col items-center justify-center py-16 text-muted-foreground gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <p>Loading providers...</p>
            </div>
          )}

          {!loading && error && (
            <div className="text-center py-12 bg-destructive/5 rounded-2xl border border-destructive/20 p-6">
              <p className="text-destructive font-medium">{error}</p>
            </div>
          )}

          {!loading && !error && filtered.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">{t('providers.noResults')}</p>
            </div>
          )}

          {!loading && !error && filtered.map(provider => {
            const address = formatAddress(provider);
            const langs = provider.languages_spoken.map(langLabel);

            return (
              <div key={provider.id} className="bg-card rounded-2xl border border-border p-5 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                    <UserRound className="w-7 h-7" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 flex-wrap">
                      <div>
                        <h3 className="font-bold text-lg text-foreground">{provider.name}</h3>
                        <p className="text-primary font-medium text-sm">{provider.specialty}</p>
                      </div>
                      {provider.accepts_new_patients && (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-50 text-green-700 text-xs font-semibold rounded-full shrink-0 border border-green-200">
                          <CheckCircle className="w-3 h-3" />
                          Accepting Patients
                        </span>
                      )}
                    </div>

                    <div className="mt-3 space-y-1.5">
                      {address && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <MapPin className="w-4 h-4 shrink-0 text-primary/60" />
                          <span>{address}</span>
                        </div>
                      )}
                      {provider.average_wait_time_days != null && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="w-4 h-4 shrink-0 text-primary/60" />
                          <span>~{provider.average_wait_time_days} day wait</span>
                        </div>
                      )}
                      {provider.email && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Mail className="w-4 h-4 shrink-0 text-primary/60" />
                          <a href={`mailto:${provider.email}`} className="truncate hover:text-primary transition-colors">
                            {provider.email}
                          </a>
                        </div>
                      )}
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {langs.map(lang => (
                          <span key={lang} className="px-2.5 py-0.5 bg-secondary/10 text-secondary text-xs font-semibold rounded-full">
                            {lang}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 mt-4 border-t border-border pt-4">
                  {provider.phone ? (
                    <a
                      href={`tel:${provider.phone}`}
                      className="flex-1 flex items-center justify-center gap-2 py-3 bg-secondary/10 text-secondary hover:bg-secondary hover:text-white rounded-xl font-bold transition-colors"
                    >
                      <Phone className="w-4 h-4" />
                      {t('providers.call')}
                    </a>
                  ) : (
                    <div className="flex-1" />
                  )}

                  {provider.booking_url ? (
                    <a
                      href={provider.booking_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-2 py-3 bg-primary text-white hover:bg-primary/90 rounded-xl font-bold transition-colors"
                    >
                      <Globe className="w-4 h-4" />
                      {t('providers.book')}
                    </a>
                  ) : (
                    <button
                      disabled
                      className="flex-1 flex items-center justify-center py-3 bg-muted text-muted-foreground rounded-xl font-bold opacity-60 cursor-not-allowed text-sm"
                    >
                      {t('providers.comingSoon')}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AppLayout>
  );
}
