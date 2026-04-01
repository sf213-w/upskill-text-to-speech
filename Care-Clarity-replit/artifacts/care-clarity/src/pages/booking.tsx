import { useState } from "react";
import { useLocation } from "wouter";
import { Layout } from "@/components/layout";
import { CalendarDays, PhoneCall, FileText, Mail, CheckCircle2, User } from "lucide-react";
import { useTranslation } from "react-i18next";
import { saveReminder } from "@/lib/storage";

function generateICS(title: string, location: string, dateStr: string): string {
  const start = dateStr.replace(/[-:]/g, '').replace('.000', '');
  const startDate = new Date(dateStr);
  const endDate = new Date(startDate.getTime() + 60 * 60 * 1000);
  const end = endDate.toISOString().replace(/[-:]/g, '').replace('.000', '');
  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Care Clarity//EN',
    'BEGIN:VEVENT',
    `DTSTART:${start}`,
    `DTEND:${end}`,
    `SUMMARY:${title}`,
    `LOCATION:${location}`,
    'DESCRIPTION:Recordatorio: Cita con Dra. Ana López en 1 hora',
    `UID:${Date.now()}@careclarity`,
    'BEGIN:VALARM',
    'TRIGGER:-PT1H',
    'ACTION:DISPLAY',
    'DESCRIPTION:Recordatorio: Cita con Dra. Ana López en 1 hora',
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');
}

function downloadICS(content: string, filename: string) {
  const blob = new Blob([content], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export default function Booking() {
  const [, setLocation] = useLocation();
  const { t } = useTranslation();
  const [wantsReminder, setWantsReminder] = useState(false);
  const [reminderStatus, setReminderStatus] = useState<'idle' | 'set' | 'failed'>('idle');

  const appointmentISO = (() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    d.setHours(10, 0, 0, 0);
    return d.toISOString();
  })();

  const handleBookingMethod = (path: string) => {
    if (wantsReminder) {
      const title = "Cita con Dra. Ana López / Appointment with Dra. Ana López";
      const location = "Centro Médico Salud";

      const ics = generateICS(title, location, appointmentISO);
      try {
        downloadICS(ics, "cita-dra-ana-lopez.ics");
        setReminderStatus('set');
      } catch {
        setReminderStatus('failed');
      }

      const reminder = {
        id: Date.now().toString(),
        provider: "Dra. Ana López",
        specialty: "Medicina General",
        datetime: appointmentISO,
        reminderSet: true,
      };
      saveReminder(reminder);
    }
    setLocation(path);
  };

  return (
    <Layout>
      <div className="p-6 pb-24 space-y-8">
        
        {/* Header */}
        <div className="pt-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-purple-100 dark:bg-purple-900/40 p-3 rounded-2xl text-purple-600 dark:text-purple-400">
              <CalendarDays className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">{t('booking.title')}</h1>
          </div>
        </div>

        {/* Selected Provider Card */}
        <div className="bg-card border border-border p-4 rounded-3xl shadow-sm">
          <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider mb-3">{t('booking.provider_label')}</p>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary flex-shrink-0">
              <User className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-foreground">Dra. Ana López</h3>
              <p className="text-sm text-secondary font-medium">Medicina General</p>
              <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                <span>2.3 mi</span>
                <span>•</span>
                <span className="text-green-600 dark:text-green-400 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> En red
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Calendar Reminder Checkbox */}
        <div className="bg-card border border-border p-4 rounded-2xl flex items-start gap-3 shadow-sm">
          <input
            type="checkbox"
            id="calendar-reminder"
            className="w-5 h-5 mt-0.5 rounded border-border text-primary focus:ring-primary flex-shrink-0"
            checked={wantsReminder}
            onChange={(e) => {
              setWantsReminder(e.target.checked);
              setReminderStatus('idle');
            }}
          />
          <div className="flex-1">
            <label htmlFor="calendar-reminder" className="text-sm font-medium text-foreground cursor-pointer">
              {t('booking.calendar_reminder')}
            </label>
            {reminderStatus === 'set' && (
              <p className="text-xs text-green-600 mt-1 font-medium">{t('booking.reminder_set')}</p>
            )}
            {reminderStatus === 'failed' && (
              <p className="text-xs text-orange-500 mt-1 font-medium">{t('booking.reminder_failed')}</p>
            )}
          </div>
        </div>

        {/* Booking Methods */}
        <div>
          <h2 className="text-lg font-bold text-foreground mb-4">{t('booking.select_method')}</h2>
          <div className="grid gap-4">
            <button
              onClick={() => handleBookingMethod("/book/call")}
              className="p-5 rounded-3xl bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 shadow-sm hover:shadow-md transition-all text-left flex items-center gap-4"
            >
              <div className="bg-blue-100 dark:bg-blue-900/40 w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0">
                <PhoneCall className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">{t('booking.method_call')}</h3>
                <p className="text-xs text-muted-foreground mt-1">{t('booking.call_desc')}</p>
              </div>
            </button>

            <button
              onClick={() => handleBookingMethod("/book/form")}
              className="p-5 rounded-3xl bg-green-50/50 dark:bg-green-900/10 border border-green-100 dark:border-green-900/30 shadow-sm hover:shadow-md transition-all text-left flex items-center gap-4"
            >
              <div className="bg-green-100 dark:bg-green-900/40 w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0">
                <FileText className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">{t('booking.method_form')}</h3>
                <p className="text-xs text-muted-foreground mt-1">{t('booking.form_desc')}</p>
              </div>
            </button>

            <button
              onClick={() => handleBookingMethod("/book/email")}
              className="p-5 rounded-3xl bg-orange-50/50 dark:bg-orange-900/10 border border-orange-100 dark:border-orange-900/30 shadow-sm hover:shadow-md transition-all text-left flex items-center gap-4"
            >
              <div className="bg-orange-100 dark:bg-orange-900/40 w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0">
                <Mail className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">{t('booking.method_email')}</h3>
                <p className="text-xs text-muted-foreground mt-1">{t('booking.email_desc')}</p>
              </div>
            </button>
          </div>
        </div>

      </div>
    </Layout>
  );
}
