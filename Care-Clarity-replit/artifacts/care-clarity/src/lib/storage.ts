export interface Message {
  id: string;
  originalText: string;
  translatedText: string;
  speaker: 'patient' | 'provider';
  timestamp: number;
}

export interface Session {
  id: string;
  date: number;
  messages: Message[];
  title?: string;
  provider?: string;
  specialty?: string;
  duration?: number;
  messageCount?: number;
}

export interface LegalConsent {
  privacyAccepted: boolean;
  hipaaAccepted: boolean;
  termsAccepted: boolean;
  dataRightsAccepted: boolean;
  acceptedAt: string;
  acceptedLanguage: string;
}

export interface Reminder {
  id: string;
  provider: string;
  specialty: string;
  datetime: string;
  reminderSet: boolean;
}

const STORAGE_KEY = 'careclarity_sessions';
const ONBOARDING_KEY = 'careclarity_onboarded';
const LEGAL_KEY = 'careclarity_legal';
const REMINDERS_KEY = 'careclarity_reminders';

export function getSessions(): Session[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error("Failed to parse sessions from local storage", e);
    return [];
  }
}

export function saveSession(session: Session): void {
  const sessions = getSessions();
  sessions.push(session);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
}

export function deleteSession(id: string): void {
  const sessions = getSessions();
  const filtered = sessions.filter(s => s.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
}

export function getSession(id: string): Session | undefined {
  const sessions = getSessions();
  return sessions.find(s => s.id === id);
}

export function hasCompletedOnboarding(): boolean {
  return localStorage.getItem(ONBOARDING_KEY) === 'true';
}

export function setOnboardingCompleted(): void {
  localStorage.setItem(ONBOARDING_KEY, 'true');
}

export function saveLegalConsent(consent: LegalConsent): void {
  localStorage.setItem(LEGAL_KEY, JSON.stringify(consent));
}

export function getLegalConsent(): LegalConsent | null {
  try {
    const data = localStorage.getItem(LEGAL_KEY);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

export function deleteAllData(): void {
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(LEGAL_KEY);
  localStorage.removeItem(REMINDERS_KEY);
  localStorage.removeItem(ONBOARDING_KEY);
}

export function saveReminder(reminder: Reminder): void {
  const reminders = getReminders();
  const existing = reminders.findIndex(r => r.id === reminder.id);
  if (existing >= 0) {
    reminders[existing] = reminder;
  } else {
    reminders.push(reminder);
  }
  localStorage.setItem(REMINDERS_KEY, JSON.stringify(reminders));
}

export function getReminders(): Reminder[] {
  try {
    const data = localStorage.getItem(REMINDERS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function deleteReminder(id: string): void {
  const reminders = getReminders().filter(r => r.id !== id);
  localStorage.setItem(REMINDERS_KEY, JSON.stringify(reminders));
}
