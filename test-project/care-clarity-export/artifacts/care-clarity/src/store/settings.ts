import { create } from 'zustand';

interface SettingsState {
  language: 'en' | 'es';
  largeText: boolean;
  onboardingDone: boolean;
  setLanguage: (lang: 'en' | 'es') => void;
  setLargeText: (val: boolean) => void;
  setOnboardingDone: (val: boolean) => void;
}

const getStoredBool = (key: string, def: boolean) => {
  const item = localStorage.getItem(key);
  return item !== null ? item === 'true' : def;
};

export const useSettings = create<SettingsState>((set) => ({
  language: (localStorage.getItem('careClarity_lang') as 'en' | 'es') || 'en',
  largeText: getStoredBool('careClarity_largeText', false),
  onboardingDone: getStoredBool('careClarity_onboardingDone', false),
  
  setLanguage: (lang) => {
    localStorage.setItem('careClarity_lang', lang);
    set({ language: lang });
  },
  setLargeText: (val) => {
    localStorage.setItem('careClarity_largeText', String(val));
    set({ largeText: val });
  },
  setOnboardingDone: (val) => {
    localStorage.setItem('careClarity_onboardingDone', String(val));
    set({ onboardingDone: val });
  }
}));
