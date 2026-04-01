import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Layout } from "@/components/layout";
import {
  Settings as SettingsIcon, Globe, Type, ShieldAlert, Info, User,
  Shield, WifiOff, CheckCircle2, XCircle, Bell, Trash2, ChevronDown, Eye
} from "lucide-react";
import { useTranslation } from "react-i18next";
import {
  getLegalConsent, getReminders, deleteReminder, deleteAllData,
  LegalConsent, Reminder
} from "@/lib/storage";
import { format } from "date-fns";
import { es, enUS } from "date-fns/locale";

const LEGAL_ITEMS = [
  { key: 'privacy', icon: '📄' },
  { key: 'hipaa', icon: '🏥' },
  { key: 'terms', icon: '📋' },
  { key: 'data_rights', icon: '🗑️' },
];

export default function Settings() {
  const { t, i18n } = useTranslation();
  const [, setLocation] = useLocation();
  const [largeText, setLargeText] = useState(false);
  const [biometric, setBiometric] = useState(true);
  const [offline, setOffline] = useState(false);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [legalConsent, setLegalConsent] = useState<LegalConsent | null>(null);
  const [expandedLegal, setExpandedLegal] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const dateLocale = i18n.language === 'es' ? es : enUS;

  useEffect(() => {
    setReminders(getReminders());
    setLegalConsent(getLegalConsent());
  }, []);

  const toggleLanguage = () => {
    const newLang = i18n.language === 'es' ? 'en' : 'es';
    i18n.changeLanguage(newLang);
  };

  const handleDeleteReminder = (id: string) => {
    deleteReminder(id);
    setReminders(getReminders());
  };

  const handleDeleteAll = () => {
    deleteAllData();
    setShowDeleteConfirm(false);
    setLocation("/");
  };

  const formatDate = (isoStr: string) => {
    try {
      return format(new Date(isoStr), "PP", { locale: dateLocale });
    } catch {
      return isoStr;
    }
  };

  return (
    <Layout>
      <div className={`p-6 pb-24 ${largeText ? 'scale-105 origin-top' : ''}`}>
        <div className="flex items-center gap-3 mb-6 pt-4">
          <div className="bg-muted p-3 rounded-2xl text-foreground">
            <SettingsIcon className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">{t('settings.title')}</h1>
        </div>

        <div className="space-y-6">

          {/* User Profile Section */}
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-3 px-2">{t('settings.profile_title')}</h2>
            <div className="bg-card border border-border rounded-3xl p-5 shadow-sm">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary border border-primary/20">
                  <User className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-foreground">Maria Gonzalez</h3>
                  <p className="text-sm text-secondary font-medium">Patient</p>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-muted-foreground block mb-1">Nombre</label>
                  <input type="text" value="Maria Gonzalez" readOnly className="w-full bg-muted border border-border rounded-xl p-3 text-sm text-foreground focus:outline-none" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground block mb-1">Fecha de nacimiento</label>
                  <input type="text" value="03/15/1981" readOnly className="w-full bg-muted border border-border rounded-xl p-3 text-sm text-foreground focus:outline-none" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground block mb-1">ID de seguro</label>
                  <input type="text" value="INS-4829-XXXX" readOnly className="w-full bg-muted border border-border rounded-xl p-3 text-sm text-foreground focus:outline-none" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground block mb-1">Teléfono</label>
                  <input type="text" value="(555) 987-6543" readOnly className="w-full bg-muted border border-border rounded-xl p-3 text-sm text-foreground focus:outline-none" />
                </div>
              </div>
            </div>
          </div>

          {/* Preferences */}
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-3 px-2">Preferences</h2>
            <div className="bg-card border border-border rounded-3xl p-2 shadow-sm space-y-1">
              <div className="p-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 p-2 rounded-xl text-primary">
                    <Globe className="w-5 h-5" />
                  </div>
                  <span className="font-semibold text-sm text-foreground">{t('settings.language')}</span>
                </div>
                <button
                  onClick={toggleLanguage}
                  className="bg-muted px-4 py-2 rounded-xl font-bold text-sm hover:bg-border transition-colors flex items-center gap-2"
                >
                  {i18n.language === 'es' ? 'Español' : 'English'}
                  <span className="text-muted-foreground font-normal ml-2 text-xs">Cambiar</span>
                </button>
              </div>
              <div className="p-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-secondary/10 p-2 rounded-xl text-secondary">
                    <Type className="w-5 h-5" />
                  </div>
                  <span className="font-semibold text-sm text-foreground">{t('settings.large_text')}</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" checked={largeText} onChange={() => setLargeText(!largeText)} />
                  <div className="w-12 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-secondary"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Security & Privacy */}
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-3 px-2">{t('settings.security_title')}</h2>
            <div className="bg-card border border-border rounded-3xl p-2 shadow-sm space-y-1">
              <div className="p-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 p-2 rounded-xl text-primary">
                    <Shield className="w-5 h-5" />
                  </div>
                  <span className="font-semibold text-sm text-foreground">{t('settings.biometric')}</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" checked={biometric} onChange={() => setBiometric(!biometric)} />
                  <div className="w-12 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>
              <div className="p-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-green-100 p-2 rounded-xl text-green-600">
                    <ShieldAlert className="w-5 h-5" />
                  </div>
                  <span className="font-semibold text-sm text-foreground">{t('settings.encryption')}</span>
                </div>
                <span className="text-xs font-bold text-green-600 bg-green-50 px-3 py-1.5 rounded-full">Active ✓</span>
              </div>
              <div className="p-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-orange-100 p-2 rounded-xl text-orange-600">
                    <WifiOff className="w-5 h-5" />
                  </div>
                  <span className="font-semibold text-sm text-foreground">{t('settings.offline_mode')}</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" checked={offline} onChange={() => setOffline(!offline)} />
                  <div className="w-12 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Offline Features */}
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-3 px-2">{t('settings.offline_features')}</h2>
            <div className="bg-card border border-border rounded-3xl p-5 shadow-sm space-y-3">
              <div className="flex items-center gap-3 text-sm"><CheckCircle2 className="w-4 h-4 text-green-500" /> Transcripts & documents</div>
              <div className="flex items-center gap-3 text-sm"><CheckCircle2 className="w-4 h-4 text-green-500" /> Medication reminders</div>
              <div className="flex items-center gap-3 text-sm"><CheckCircle2 className="w-4 h-4 text-green-500" /> Saved translations</div>
              <div className="flex items-center gap-3 text-sm text-muted-foreground opacity-70"><XCircle className="w-4 h-4" /> Live translation (requires connection)</div>
              <div className="flex items-center gap-3 text-sm text-muted-foreground opacity-70"><XCircle className="w-4 h-4" /> Provider search (requires connection)</div>
            </div>
          </div>

          {/* My Reminders */}
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-3 px-2">{t('settings.reminders_title')}</h2>
            <div className="bg-card border border-border rounded-3xl p-4 shadow-sm">
              {reminders.length === 0 ? (
                <div className="flex items-center gap-3 py-2">
                  <Bell className="w-5 h-5 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">{t('settings.no_reminders')}</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {reminders.map((r) => (
                    <div key={r.id} className="flex items-center justify-between gap-3 py-1">
                      <div className="flex items-center gap-3 min-w-0">
                        <Bell className="w-4 h-4 text-primary flex-shrink-0" />
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-foreground truncate">
                            Cita con {r.provider}
                          </p>
                          <p className="text-xs text-muted-foreground">{formatDate(r.datetime)}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteReminder(r.id)}
                        className="text-xs text-red-500 hover:text-red-700 font-medium flex-shrink-0 px-2 py-1 rounded-lg hover:bg-red-50 transition-colors"
                      >
                        {t('history.delete')}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Legal & Consent */}
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-3 px-2">{t('settings.legal_title')}</h2>
            <div className="bg-card border border-border rounded-3xl shadow-sm overflow-hidden">
              {LEGAL_ITEMS.map((item, idx) => (
                <div key={item.key} className={idx > 0 ? 'border-t border-border' : ''}>
                  <div className="p-4 flex items-center gap-3">
                    <span className="text-xl flex-shrink-0">{item.icon}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground">{t(`legal.${item.key}_title`)}</p>
                      {legalConsent ? (
                        <p className="text-xs text-green-600 font-medium mt-0.5">
                          ✓ {t('legal.accepted_on')} {formatDate(legalConsent.acceptedAt)}
                        </p>
                      ) : (
                        <p className="text-xs text-muted-foreground mt-0.5">Not yet accepted</p>
                      )}
                    </div>
                    <button
                      onClick={() => setExpandedLegal(expandedLegal === item.key ? null : item.key)}
                      className="flex items-center gap-1 text-xs font-semibold text-primary hover:text-primary/80 transition-colors flex-shrink-0"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      {t('legal.view')}
                      <ChevronDown className={`w-3.5 h-3.5 transition-transform ${expandedLegal === item.key ? 'rotate-180' : ''}`} />
                    </button>
                  </div>
                  {expandedLegal === item.key && (
                    <div className="px-4 pb-4 bg-muted/30">
                      <p className="text-sm text-muted-foreground leading-relaxed pt-2 border-t border-border">
                        {t(`legal.${item.key}_body`)}
                      </p>
                    </div>
                  )}
                </div>
              ))}

              {/* Delete All Data */}
              <div className="border-t border-border p-4">
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="w-full py-3 rounded-xl font-semibold text-sm text-red-600 bg-red-50 hover:bg-red-100 transition-colors flex items-center justify-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  {t('legal.delete_all')}
                </button>
              </div>
            </div>
          </div>

          {/* App Info */}
          <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
            <Info className="w-6 h-6 mb-2 opacity-50" />
            <p className="text-sm font-medium">Care Clarity MVP</p>
            <p className="text-xs mt-1">{t('settings.version')} 1.0.0</p>
          </div>

        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-end justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-card border border-border rounded-3xl p-6 w-full max-w-md shadow-xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-red-100 p-2 rounded-xl">
                <Trash2 className="w-5 h-5 text-red-600" />
              </div>
              <h3 className="font-bold text-foreground text-lg">Delete All Data?</h3>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed mb-6">
              {t('legal.delete_confirm')}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 py-3 rounded-2xl font-semibold text-sm bg-muted text-foreground hover:bg-border transition-colors"
              >
                {t('legal.delete_cancel')}
              </button>
              <button
                onClick={handleDeleteAll}
                className="flex-1 py-3 rounded-2xl font-semibold text-sm bg-red-600 text-white hover:bg-red-700 transition-colors"
              >
                {t('legal.delete_all')}
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
