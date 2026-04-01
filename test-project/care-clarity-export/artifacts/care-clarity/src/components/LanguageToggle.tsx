import { useTranslation } from 'react-i18next';
import { useSettings } from '@/store/settings';

export function LanguageToggle() {
  const { i18n } = useTranslation();
  const { language, setLanguage } = useSettings();

  const toggleLang = () => {
    const newLang = language === 'en' ? 'es' : 'en';
    setLanguage(newLang);
    i18n.changeLanguage(newLang);
  };

  return (
    <button
      onClick={toggleLang}
      className="flex items-center bg-card rounded-full p-1 border border-border shadow-sm hover:shadow-md transition-all active:scale-95"
      aria-label="Toggle Language"
    >
      <div
        className={`px-3 py-1 rounded-full text-sm font-bold transition-colors ${
          language === 'en' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'
        }`}
      >
        EN
      </div>
      <div
        className={`px-3 py-1 rounded-full text-sm font-bold transition-colors ${
          language === 'es' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'
        }`}
      >
        ES
      </div>
    </button>
  );
}
