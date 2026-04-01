import { useState } from "react";
import { Layout } from "@/components/layout";
import { Search, MapPin, Phone, Calendar, HeartPulse, Mic, Check } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useSpeechRecognition } from "@/hooks/use-speech";

const PROVIDERS = [
  {
    id: 1,
    name: "Dra. Ana López",
    specialty: "Medicina General",
    location: "Centro Médico Salud",
    distance: "2.3 mi",
    languages: "Español, English",
    phone: "555-0101",
    inNetwork: true
  },
  {
    id: 2,
    name: "Dr. Carlos Mendoza",
    specialty: "Cardiología",
    location: "Hospital Corazón",
    distance: "3.1 mi",
    languages: "Español",
    phone: "555-0102",
    inNetwork: true
  },
  {
    id: 3,
    name: "Dra. Elena Rodríguez",
    specialty: "Neurología",
    location: "Instituto Neurológico",
    distance: "5.0 mi",
    languages: "Español, English",
    phone: "555-0103",
    inNetwork: false
  },
  {
    id: 4,
    name: "Dr. Luis García",
    specialty: "Medicina Interna",
    location: "Clínica Vida",
    distance: "1.2 mi",
    languages: "Español",
    phone: "555-0104",
    inNetwork: true
  },
  {
    id: 5,
    name: "Dra. Sofía Martínez",
    specialty: "Medicina Familiar",
    location: "Salud Familiar",
    distance: "4.5 mi",
    languages: "Español, English",
    phone: "555-0105",
    inNetwork: true
  },
  {
    id: 6,
    name: "Dr. Javier Ruiz",
    specialty: "Dermatología",
    location: "Centro Dermo",
    distance: "6.2 mi",
    languages: "Español",
    phone: "555-0106",
    inNetwork: false
  },
  {
    id: 7,
    name: "Dra. Carmen Silva",
    specialty: "Pediatría",
    location: "Clínica Infantil",
    distance: "2.8 mi",
    languages: "Español, English",
    phone: "555-0107",
    inNetwork: true
  },
  {
    id: 8,
    name: "Dr. Roberto Torres",
    specialty: "Ginecología",
    location: "Salud Mujer",
    distance: "3.5 mi",
    languages: "Español",
    phone: "555-0108",
    inNetwork: true
  }
];

export default function Providers() {
  const { t } = useTranslation();
  const [search, setSearch] = useState("");
  const { isListening, startListening, stopListening, transcript } = useSpeechRecognition('es-MX');

  const filtered = PROVIDERS.filter(p => 
    p.specialty.toLowerCase().includes(search.toLowerCase()) || 
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    (transcript && (p.specialty.toLowerCase().includes(transcript.toLowerCase()) || p.name.toLowerCase().includes(transcript.toLowerCase())))
  );

  const displaySearch = isListening ? transcript : search;

  return (
    <Layout>
      <div className="p-6">
        <div className="flex items-center gap-3 mb-6 pt-4">
          <div className="bg-secondary/10 p-3 rounded-2xl text-secondary">
            <HeartPulse className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">{t('providers.title')}</h1>
        </div>

        {/* Search Bar with Voice Input */}
        <div className="relative mb-4 shadow-sm flex items-center">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <Search className="w-5 h-5 text-muted-foreground" />
          </div>
          <input
            type="text"
            value={displaySearch}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t('providers.search_placeholder')}
            className="w-full bg-card border-2 border-border rounded-2xl py-4 pl-12 pr-14 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-secondary focus:ring-4 focus:ring-secondary/10 transition-all"
          />
          <button 
            onClick={isListening ? stopListening : startListening}
            className={`absolute right-3 p-2 rounded-xl transition-colors ${
              isListening ? 'bg-destructive text-white animate-pulse' : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            <Mic className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-4 scrollbar-none">
          <div className="flex-shrink-0 bg-primary/10 text-primary border border-primary/20 px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-1">
            Idioma: Español <Check className="w-3 h-3" />
          </div>
          <div className="flex-shrink-0 bg-card border border-border px-3 py-1.5 rounded-full text-sm font-medium text-foreground">
            10 mi
          </div>
          <div className="flex-shrink-0 bg-primary/10 text-primary border border-primary/20 px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-1">
            En red <Check className="w-3 h-3" />
          </div>
          <div className="flex-shrink-0 bg-card border border-border px-3 py-1.5 rounded-full text-sm font-medium text-foreground">
            Todas
          </div>
        </div>

        {/* Results */}
        <div className="space-y-4">
          {filtered.map(provider => (
            <div key={provider.id} className="bg-card border border-border rounded-3xl p-5 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="font-bold text-lg text-foreground">{provider.name}</h3>
                  <p className="text-secondary font-medium text-sm">{provider.specialty}</p>
                </div>
                {provider.inNetwork && (
                  <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1">
                    <Check className="w-3 h-3" /> En red
                  </span>
                )}
              </div>
              
              <div className="space-y-2 mt-4">
                <div className="flex items-start justify-between text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-primary" />
                    <span>{provider.location}</span>
                  </div>
                  <span className="font-semibold text-foreground bg-muted px-2 py-0.5 rounded-lg">{provider.distance}</span>
                </div>
                <div className="flex items-start gap-2 text-sm text-muted-foreground">
                  <span className="font-semibold text-xs bg-muted px-2 py-0.5 rounded-md text-foreground">
                    {provider.languages}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mt-6">
                <a 
                  href={`tel:${provider.phone}`}
                  className="flex items-center justify-center gap-2 py-3 bg-primary/10 text-primary font-semibold rounded-xl hover:bg-primary/20 transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  {t('providers.call')}
                </a>
                <button 
                  disabled
                  className="flex items-center justify-center gap-2 py-3 bg-muted text-muted-foreground font-semibold rounded-xl cursor-not-allowed group relative"
                >
                  <Calendar className="w-4 h-4" />
                  {t('providers.book')}
                  {/* Tooltip */}
                  <div className="absolute -top-10 scale-0 group-hover:scale-100 transition-transform bg-foreground text-background text-xs py-1 px-3 rounded-lg whitespace-nowrap">
                    {t('providers.coming_soon')}
                  </div>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}