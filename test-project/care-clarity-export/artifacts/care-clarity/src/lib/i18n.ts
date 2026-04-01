import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      nav: {
        home: "Home",
        dashboard: "Dashboard",
        consultation: "Consultation",
        history: "History",
        settings: "Settings",
        providers: "Providers"
      },
      dashboard: {
        title: "My Health",
        subtitle: "Your health overview at a glance.",
        overview: "Overview",
        upcomingApts: "Upcoming Appointments",
        activeMeds: "Active Medications",
        pendingRefs: "Pending Referrals",
        translationSessions: "Translation Sessions",
        nextAppointment: "Next Appointment",
        generalVisit: "General Visit",
        noAppointments: "No upcoming appointments scheduled.",
        medications: "Medications",
        noMedications: "No active prescriptions on file.",
        referrals: "Referrals",
        noReferrals: "No referrals on file.",
        specialist: "Specialist",
        quickActions: "Quick Actions",
        seeAll: "See all",
        more: "more",
        exchanges: "exchanges"
      },
      onboarding: {
        welcome: "Welcome to Care Clarity",
        desc1: "Real-time bilingual medical translation to help you communicate clearly.",
        getStarted: "Get Started",
        micTitle: "Microphone Access",
        micDesc: "We need access to your microphone to translate your speech in real time.",
        allowMic: "Allow Microphone",
        privacyTitle: "Your Privacy Matters",
        privacyDesc: "🔒 This app does not save or transmit audio recordings. All translations are processed securely.",
        finish: "Start Using App",
        skip: "Skip"
      },
      home: {
        title: "Care Clarity",
        subtitle: "Clear communication, better care.",
        privacyBadge: "🔒 No audio stored",
        startConsultation: "Start Consultation",
        findProvider: "Find a Provider",
        recentSessions: "Recent Sessions",
        noSessions: "No sessions yet. Start a consultation to see history here.",
        sessionsCount: "{{count}} Sessions Completed"
      },
      consultation: {
        patient: "Patient (Spanish)",
        provider: "Provider (English)",
        tapToSpeakES: "Tap to speak Spanish",
        tapToSpeakEN: "Tap to speak English",
        listening: "Listening...",
        translating: "Translating...",
        endSession: "End Session",
        repeat: "Repeat",
        micError: "Microphone not supported or denied.",
        saySomething: "Say something...",
        translationError: "Translation unavailable"
      },
      history: {
        title: "Session History",
        empty: "No sessions recorded yet.",
        delete: "Delete",
        confirmDelete: "Are you sure you want to delete this session?",
        cancel: "Cancel",
        viewDetails: "View Details",
        sessionAt: "Session on {{date}}"
      },
      settings: {
        title: "Settings",
        language: "App Language",
        languageDesc: "Change the interface language.",
        accessibility: "Accessibility",
        largeText: "Large Text",
        largeTextDesc: "Increase the size of all text.",
        data: "Data & Privacy",
        repeatOnboarding: "Repeat Onboarding",
        privacyNotice: "We do not store audio. Session history is saved only on this device.",
        clearData: "Clear All Data",
        clearDataConfirm: "This will delete all history and settings."
      },
      providers: {
        title: "Find a Provider",
        searchPlaceholder: "Search by name or specialty...",
        call: "Call",
        book: "Book Appointment",
        comingSoon: "Coming Soon",
        languages: "Languages: ",
        noResults: "No providers found."
      }
    }
  },
  es: {
    translation: {
      nav: {
        home: "Inicio",
        dashboard: "Panel",
        consultation: "Consulta",
        history: "Historial",
        settings: "Ajustes",
        providers: "Proveedores"
      },
      dashboard: {
        title: "Mi Salud",
        subtitle: "Un resumen de su salud de un vistazo.",
        overview: "Resumen",
        upcomingApts: "Citas Próximas",
        activeMeds: "Medicamentos Activos",
        pendingRefs: "Derivaciones Pendientes",
        translationSessions: "Sesiones de Traducción",
        nextAppointment: "Próxima Cita",
        generalVisit: "Visita General",
        noAppointments: "No hay citas programadas próximamente.",
        medications: "Medicamentos",
        noMedications: "No hay recetas activas registradas.",
        referrals: "Derivaciones",
        noReferrals: "No hay derivaciones registradas.",
        specialist: "Especialista",
        quickActions: "Acciones Rápidas",
        seeAll: "Ver todo",
        more: "más",
        exchanges: "intercambios"
      },
      onboarding: {
        welcome: "Bienvenido a Care Clarity",
        desc1: "Traducción médica bilingüe en tiempo real para ayudarle a comunicarse claramente.",
        getStarted: "Comenzar",
        micTitle: "Acceso al Micrófono",
        micDesc: "Necesitamos acceso a su micrófono para traducir su voz en tiempo real.",
        allowMic: "Permitir Micrófono",
        privacyTitle: "Su Privacidad es Importante",
        privacyDesc: "🔒 Esta aplicación no guarda ni transmite grabaciones de audio. Todo se procesa de forma segura.",
        finish: "Empezar a Usar",
        skip: "Saltar"
      },
      home: {
        title: "Care Clarity",
        subtitle: "Comunicación clara, mejor atención.",
        privacyBadge: "🔒 Sin almacenamiento de audio",
        startConsultation: "Iniciar Consulta",
        findProvider: "Buscar Proveedor",
        recentSessions: "Sesiones Recientes",
        noSessions: "Aún no hay sesiones. Inicie una consulta para ver el historial aquí.",
        sessionsCount: "{{count}} Sesiones Completadas"
      },
      consultation: {
        patient: "Paciente (Español)",
        provider: "Proveedor (Inglés)",
        tapToSpeakES: "Toque para hablar en español",
        tapToSpeakEN: "Toque para hablar en inglés",
        listening: "Escuchando...",
        translating: "Traduciendo...",
        endSession: "Terminar Sesión",
        repeat: "Repetir",
        micError: "Micrófono no soportado o denegado.",
        saySomething: "Diga algo...",
        translationError: "Traducción no disponible"
      },
      history: {
        title: "Historial de Sesiones",
        empty: "Aún no hay sesiones grabadas.",
        delete: "Eliminar",
        confirmDelete: "¿Está seguro de que desea eliminar esta sesión?",
        cancel: "Cancelar",
        viewDetails: "Ver Detalles",
        sessionAt: "Sesión del {{date}}"
      },
      settings: {
        title: "Ajustes",
        language: "Idioma de la App",
        languageDesc: "Cambie el idioma de la interfaz.",
        accessibility: "Accesibilidad",
        largeText: "Texto Grande",
        largeTextDesc: "Aumentar el tamaño de todo el texto.",
        data: "Datos y Privacidad",
        repeatOnboarding: "Repetir Introducción",
        privacyNotice: "No guardamos audio. El historial se guarda solo en este dispositivo.",
        clearData: "Borrar Todos los Datos",
        clearDataConfirm: "Esto eliminará todo el historial y los ajustes."
      },
      providers: {
        title: "Buscar Proveedor",
        searchPlaceholder: "Buscar por nombre o especialidad...",
        call: "Llamar",
        book: "Reservar Cita",
        comingSoon: "Próximamente",
        languages: "Idiomas: ",
        noResults: "No se encontraron proveedores."
      }
    }
  }
};

const savedLang = localStorage.getItem('careClarity_lang') || 'en';

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: savedLang,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
