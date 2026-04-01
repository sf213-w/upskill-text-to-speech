import { useTranslation } from 'react-i18next';
import { Link } from 'wouter';
import {
  CalendarDays,
  Pill,
  ArrowRightLeft,
  Mic,
  ChevronRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  Stethoscope,
  Activity,
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { AppLayout } from '@/components/layout/AppLayout';
import { useHistory } from '@/store/history';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

interface Appointment {
  id: string;
  scheduled_datetime: string;
  status: string;
  appointment_type: string | null;
  appointment_notes: string | null;
  duration_minutes: number | null;
  care_provider_id: string;
}

interface Prescription {
  id: string;
  medication_name: string;
  dosage: string;
  frequency: string;
  status: string;
  refills_remaining: number | null;
}

interface Referral {
  id: string;
  reason: string;
  status: string;
  urgency: string | null;
  referring_provider_id: string;
  referred_to_provider_id: string;
}

interface Provider {
  id: string;
  name: string;
  specialty: string | null;
}

function useAppointments() {
  return useQuery({
    queryKey: ['appointments'],
    queryFn: async () => {
      if (!isSupabaseConfigured || !supabase) return [];
      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .order('scheduled_datetime', { ascending: true });
      if (error) throw error;
      return (data ?? []) as Appointment[];
    },
  });
}

function usePrescriptions() {
  return useQuery({
    queryKey: ['prescriptions'],
    queryFn: async () => {
      if (!isSupabaseConfigured || !supabase) return [];
      const { data, error } = await supabase
        .from('prescriptions')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return (data ?? []) as Prescription[];
    },
  });
}

function useReferrals() {
  return useQuery({
    queryKey: ['referrals'],
    queryFn: async () => {
      if (!isSupabaseConfigured || !supabase) return [];
      const { data, error } = await supabase
        .from('referrals')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return (data ?? []) as Referral[];
    },
  });
}

function useProviders(ids: string[]) {
  return useQuery({
    queryKey: ['providers-by-ids', ids],
    enabled: ids.length > 0 && isSupabaseConfigured,
    queryFn: async () => {
      if (!supabase) return [];
      const { data, error } = await supabase
        .from('care_providers')
        .select('id, name, specialty')
        .in('id', ids);
      if (error) throw error;
      return (data ?? []) as Provider[];
    },
  });
}

function StatCard({
  icon: Icon,
  label,
  value,
  color,
  href,
}: {
  icon: React.ElementType;
  label: string;
  value: number | string;
  color: string;
  href?: string;
}) {
  const inner = (
    <div className={`bg-card rounded-2xl border border-border p-4 flex flex-col gap-2 hover:shadow-md transition-shadow ${href ? 'cursor-pointer' : ''}`}>
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
        <Icon className="w-5 h-5" />
      </div>
      <span className="text-2xl font-bold text-foreground">{value}</span>
      <span className="text-xs text-muted-foreground font-medium leading-tight">{label}</span>
    </div>
  );
  return href ? <Link href={href}>{inner}</Link> : inner;
}

function SkeletonCard() {
  return (
    <div className="bg-card rounded-2xl border border-border p-4 animate-pulse">
      <div className="w-10 h-10 rounded-xl bg-muted mb-3" />
      <div className="h-7 w-12 bg-muted rounded mb-2" />
      <div className="h-3 w-20 bg-muted rounded" />
    </div>
  );
}

function EmptyState({ icon: Icon, text }: { icon: React.ElementType; text: string }) {
  return (
    <div className="bg-card border border-dashed border-border rounded-2xl p-6 flex flex-col items-center gap-3 text-center">
      <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
        <Icon className="w-6 h-6 text-muted-foreground/40" />
      </div>
      <p className="text-sm text-muted-foreground">{text}</p>
    </div>
  );
}

const STATUS_COLORS: Record<string, string> = {
  scheduled: 'bg-blue-100 text-blue-700',
  completed: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
  active: 'bg-green-100 text-green-700',
  expired: 'bg-muted text-muted-foreground',
  pending: 'bg-yellow-100 text-yellow-700',
};

const URGENCY_COLORS: Record<string, string> = {
  urgent: 'bg-red-100 text-red-700',
  routine: 'bg-blue-100 text-blue-700',
};

export default function Dashboard() {
  const { t } = useTranslation();
  const { sessions } = useHistory();

  const { data: appointments = [], isLoading: aptsLoading } = useAppointments();
  const { data: prescriptions = [], isLoading: rxLoading } = usePrescriptions();
  const { data: referrals = [], isLoading: refLoading } = useReferrals();

  const upcomingApts = appointments.filter(
    (a) => a.status === 'scheduled' && new Date(a.scheduled_datetime) >= new Date()
  );
  const activeRx = prescriptions.filter((p) => p.status === 'active');
  const pendingRefs = referrals.filter((r) => r.status === 'pending');
  const nextApt = upcomingApts[0];

  const providerIds = [
    ...new Set([
      nextApt?.care_provider_id,
      ...referrals.slice(0, 3).flatMap((r) => [r.referring_provider_id, r.referred_to_provider_id]),
    ].filter(Boolean) as string[]),
  ];
  const { data: providers = [] } = useProviders(providerIds);
  const providerMap = Object.fromEntries(providers.map((p) => [p.id, p]));

  const today = new Date().toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  return (
    <AppLayout>
      <div className="p-4 sm:p-6 space-y-6">

        {/* Header */}
        <div className="bg-gradient-to-br from-primary to-primary/80 rounded-3xl p-6 text-white shadow-lg shadow-primary/20 relative overflow-hidden">
          <div className="absolute right-0 top-0 w-40 h-40 bg-white/10 rounded-full blur-3xl -mr-10 -mt-10" />
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-1">
              <Activity className="w-5 h-5 text-white/70" />
              <span className="text-sm text-white/70 font-medium">{today}</span>
            </div>
            <h1 className="text-3xl font-bold mb-1">{t('dashboard.title')}</h1>
            <p className="text-primary-foreground/80">{t('dashboard.subtitle')}</p>
          </div>
        </div>

        {/* Stat Cards */}
        <section>
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            {t('dashboard.overview')}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {aptsLoading ? (
              <SkeletonCard />
            ) : (
              <StatCard
                icon={CalendarDays}
                label={t('dashboard.upcomingApts')}
                value={upcomingApts.length}
                color="bg-blue-100 text-blue-600"
              />
            )}
            {rxLoading ? (
              <SkeletonCard />
            ) : (
              <StatCard
                icon={Pill}
                label={t('dashboard.activeMeds')}
                value={activeRx.length}
                color="bg-green-100 text-green-600"
              />
            )}
            {refLoading ? (
              <SkeletonCard />
            ) : (
              <StatCard
                icon={ArrowRightLeft}
                label={t('dashboard.pendingRefs')}
                value={pendingRefs.length}
                color="bg-orange-100 text-orange-600"
              />
            )}
            <StatCard
              icon={Mic}
              label={t('dashboard.translationSessions')}
              value={sessions.length}
              color="bg-violet-100 text-violet-600"
              href="/history"
            />
          </div>
        </section>

        {/* Next Appointment */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-bold text-foreground flex items-center gap-2">
              <CalendarDays className="w-4 h-4 text-primary" />
              {t('dashboard.nextAppointment')}
            </h2>
          </div>

          {aptsLoading ? (
            <div className="bg-card border border-border rounded-2xl p-4 animate-pulse h-24" />
          ) : nextApt ? (
            <div className="bg-card border border-border rounded-2xl p-5 space-y-3 shadow-sm">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-semibold text-foreground text-base">
                    {nextApt.appointment_type || t('dashboard.generalVisit')}
                  </p>
                  {providerMap[nextApt.care_provider_id] && (
                    <p className="text-sm text-muted-foreground">
                      {providerMap[nextApt.care_provider_id].name}
                      {providerMap[nextApt.care_provider_id].specialty
                        ? ` · ${providerMap[nextApt.care_provider_id].specialty}`
                        : ''}
                    </p>
                  )}
                </div>
                <span className={`text-xs font-semibold px-2 py-1 rounded-full whitespace-nowrap ${STATUS_COLORS[nextApt.status] ?? 'bg-muted text-muted-foreground'}`}>
                  {nextApt.status}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="w-4 h-4" />
                {new Date(nextApt.scheduled_datetime).toLocaleString(undefined, {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
                {nextApt.duration_minutes && (
                  <span className="text-muted-foreground/60">· {nextApt.duration_minutes} min</span>
                )}
              </div>
              {nextApt.appointment_notes && (
                <p className="text-sm text-muted-foreground italic border-t border-border pt-2">
                  {nextApt.appointment_notes}
                </p>
              )}
            </div>
          ) : (
            <EmptyState icon={CalendarDays} text={t('dashboard.noAppointments')} />
          )}
        </section>

        {/* Active Prescriptions */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-bold text-foreground flex items-center gap-2">
              <Pill className="w-4 h-4 text-green-600" />
              {t('dashboard.medications')}
            </h2>
          </div>

          {rxLoading ? (
            <div className="bg-card border border-border rounded-2xl p-4 animate-pulse h-20" />
          ) : activeRx.length > 0 ? (
            <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
              <div className="divide-y divide-border">
                {activeRx.slice(0, 4).map((rx) => (
                  <div key={rx.id} className="p-4 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-green-100 flex items-center justify-center flex-shrink-0">
                        <Pill className="w-4 h-4 text-green-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-foreground text-sm">{rx.medication_name}</p>
                        <p className="text-xs text-muted-foreground">
                          {rx.dosage} · {rx.frequency}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${STATUS_COLORS[rx.status] ?? 'bg-muted text-muted-foreground'}`}>
                        {rx.status}
                      </span>
                      {rx.refills_remaining !== null && (
                        <span className="text-xs text-muted-foreground">{rx.refills_remaining} refills</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              {activeRx.length > 4 && (
                <div className="px-4 py-3 border-t border-border bg-muted/20 text-center">
                  <span className="text-sm text-muted-foreground">
                    +{activeRx.length - 4} {t('dashboard.more')}
                  </span>
                </div>
              )}
            </div>
          ) : (
            <EmptyState icon={Pill} text={t('dashboard.noMedications')} />
          )}
        </section>

        {/* Referrals */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-bold text-foreground flex items-center gap-2">
              <ArrowRightLeft className="w-4 h-4 text-orange-500" />
              {t('dashboard.referrals')}
            </h2>
          </div>

          {refLoading ? (
            <div className="bg-card border border-border rounded-2xl p-4 animate-pulse h-20" />
          ) : referrals.length > 0 ? (
            <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
              <div className="divide-y divide-border">
                {referrals.slice(0, 3).map((ref) => (
                  <div key={ref.id} className="p-4 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-orange-100 flex items-center justify-center flex-shrink-0">
                        <Stethoscope className="w-4 h-4 text-orange-500" />
                      </div>
                      <div>
                        <p className="font-semibold text-foreground text-sm">
                          {providerMap[ref.referred_to_provider_id]?.name ?? t('dashboard.specialist')}
                        </p>
                        <p className="text-xs text-muted-foreground line-clamp-1">{ref.reason}</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1 flex-shrink-0">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${STATUS_COLORS[ref.status] ?? 'bg-muted text-muted-foreground'}`}>
                        {ref.status}
                      </span>
                      {ref.urgency && (
                        <span className={`text-xs px-2 py-0.5 rounded-full ${URGENCY_COLORS[ref.urgency] ?? 'bg-muted text-muted-foreground'}`}>
                          {ref.urgency}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <EmptyState icon={ArrowRightLeft} text={t('dashboard.noReferrals')} />
          )}
        </section>

        {/* Quick Actions */}
        <section>
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            {t('dashboard.quickActions')}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Link
              href="/consultation"
              className="group flex items-center justify-between bg-card p-4 rounded-2xl border border-border shadow-sm hover:shadow-md hover:border-primary/30 transition-all active:scale-[0.98]"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                  <Mic className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">{t('home.startConsultation')}</p>
                  <p className="text-xs text-muted-foreground">EN ↔ ES</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
            </Link>

            <Link
              href="/providers"
              className="group flex items-center justify-between bg-card p-4 rounded-2xl border border-border shadow-sm hover:shadow-md hover:border-secondary/30 transition-all active:scale-[0.98]"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center group-hover:bg-secondary group-hover:text-white transition-colors">
                  <Stethoscope className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">{t('home.findProvider')}</p>
                  <p className="text-xs text-muted-foreground">Directorio médico</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-secondary transition-colors" />
            </Link>
          </div>
        </section>

        {/* Recent Translation Sessions */}
        {sessions.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-bold text-foreground flex items-center gap-2">
                <Clock className="w-4 h-4 text-violet-500" />
                {t('home.recentSessions')}
              </h2>
              <Link href="/history" className="text-primary font-medium text-sm hover:underline flex items-center gap-1">
                {t('dashboard.seeAll')} <ChevronRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
              <div className="divide-y divide-border">
                {sessions.slice(0, 3).map((session) => (
                  <div key={session.id} className="p-4 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-violet-100 flex items-center justify-center flex-shrink-0">
                      <Mic className="w-4 h-4 text-violet-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      {session.exchanges[0] && (
                        <p className="text-sm text-foreground line-clamp-1 italic">
                          "{session.exchanges[0].original}"
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-green-500" />
                        {session.exchanges.length} {t('dashboard.exchanges')} ·{' '}
                        {new Date(session.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

      </div>
    </AppLayout>
  );
}
