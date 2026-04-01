import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  es: {
    translation: {
      onboarding: {
        step1_title: "Bienvenido a Care Clarity",
        step1_desc: "Tu traductor médico personal en tiempo real.",
        step2_title: "Permiso de Micrófono",
        step2_desc: "Care Clarity necesita acceso a tu micrófono para escuchar y traducir tu consulta médica al instante.",
        step3_title: "Privacidad Garantizada",
        step3_desc: "🔒 Esta aplicación no guarda grabaciones de audio. Tu privacidad es nuestra prioridad.",
        btn_start: "Comenzar",
        btn_understand: "Entendido",
        btn_skip: "Omitir"
      },
      legal: {
        title: "Legal y Privacidad / Legal & Privacy",
        privacy_title: "Aviso de Privacidad / Privacy Notice",
        privacy_body: "🔒 Esta aplicación no guarda grabaciones de audio. Las transcripciones se almacenan únicamente en tu dispositivo.",
        hipaa_title: "Aviso de Derechos HIPAA / HIPAA Rights Notice",
        hipaa_body: "Tienes derecho a acceder, corregir y eliminar tu información de salud en cualquier momento. Esta aplicación no comparte tu información con terceros.",
        terms_title: "Términos de Uso / Terms of Use",
        terms_body: "Care Clarity es una ayuda de traducción, no un dispositivo médico. Siempre confirma información médica importante directamente con tu proveedor.",
        data_rights_title: "Derecho a Eliminar Datos / Data Deletion Rights",
        data_rights_body: "Puedes eliminar todos tus datos guardados en cualquier momento desde la pantalla de Ajustes.",
        accept_btn: "Entiendo y acepto / I understand and agree",
        scroll_to_accept: "Desplázate hacia abajo para aceptar",
        accepted_on: "Aceptado el",
        view: "Ver",
        delete_all: "Eliminar todos mis datos / Delete All My Data",
        delete_confirm: "¿Estás seguro? Esto eliminará todas tus sesiones, recordatorios y configuraciones guardadas. / Are you sure? This will delete all your sessions, reminders, and saved settings.",
        delete_cancel: "Cancelar / Cancel"
      },
      nav: {
        home: "Inicio",
        search: "Buscar",
        book: "Reservar",
        translate: "Traducir",
        settings: "Ajustes",
        consultation: "Consulta",
        history: "Historial",
        providers: "Doctores"
      },
      home: {
        greeting: "Hola, Maria",
        greeting_sub: "¿Qué necesita hoy?",
        more_services: "Más Servicios",
        action_find_provider: "Buscar Doctor",
        action_find_desc: "Encuentra especialistas",
        action_book: "Reservar Cita",
        action_book_desc: "Programa una visita",
        action_intake: "Formularios",
        action_intake_desc: "Documentos de ingreso",
        action_translate: "Traducción",
        action_translate_desc: "En vivo con doctor",
        action_post_visit: "Resumen post-visita",
        action_pharmacy: "Farmacia",
        action_referrals: "Referidos",
        subtitle: "Tu traductor médico",
        start_now: "Comenzar ahora",
        consultation_desc: "Comienza una traducción en vivo con tu doctor.",
        find_specialists: "Busca especialistas",
        saved_sessions: "Sesiones guardadas"
      },
      booking: {
        title: "Reservar Cita",
        select_method: "Selecciona un método de reserva",
        provider_label: "Doctor seleccionado",
        method_call: "Llamada Telefónica",
        call_desc: "Traducción en tiempo real",
        method_form: "Formulario Online",
        form_desc: "Campos traducidos",
        method_email: "Correo Electrónico",
        email_desc: "Mensaje auto-traducido",
        calendar_reminder: "Añadir recordatorio al calendario del teléfono",
        reminder_set: "✓ Recordatorio añadido al calendario",
        reminder_failed: "No se pudo añadir al calendario. Descargando archivo .ics..."
      },
      intake: {
        title: "Formularios de Ingreso",
        digital_form: "Formulario Digital (Traducido)",
        paper_form: "Traducción de Formulario en Papel",
        capture_btn: "Capturar Formulario",
        hipaa_title: "Aviso de Privacidad (HIPAA)",
        hipaa_accept: "He leído y acepto",
        continue_btn: "Continuar a Consulta →"
      },
      pharmacy: {
        title: "Farmacia",
        scan_label: "Escanear Etiqueta",
        dialog_title: "Diálogo con Farmacéutico",
        dialog_btn: "🎤 Iniciar Traducción",
        reminders_title: "Recordatorios de Medicamentos",
        continue_btn: "Continuar a Referidos →"
      },
      referrals: {
        title: "Referidos",
        active_title: "Referidos Activos",
        flow_title: "Flujo de Referidos",
        search_book: "Buscar y Reservar",
        share_history: "📎 Compartir Historial",
        intake_forms: "Formularios"
      },
      settings: {
        title: "Ajustes",
        profile_title: "Perfil de Usuario",
        security_title: "Seguridad y Privacidad",
        biometric: "Bloqueo Biométrico",
        encryption: "Encriptación de Datos",
        offline_mode: "Modo Sin Conexión",
        offline_features: "Funciones Sin Conexión",
        language: "Idioma de la Interfaz",
        large_text: "Texto Grande",
        privacy: "Ver Política de Privacidad",
        version: "Versión",
        reminders_title: "Mis Recordatorios / My Reminders",
        no_reminders: "No hay recordatorios guardados.",
        legal_title: "Legal y Consentimiento / Legal & Consent"
      },
      consultation: {
        consent_title: "Consentimiento de Grabación",
        consent_desc: "¿El doctor da su consentimiento para que esta sesión sea transcrita con fines de traducción?",
        consent_yes: "Doctor Consiente ✓",
        consent_no: "Declina",
        privacy_badge: "🔒 Sin almacenamiento de audio",
        patient_title: "Paciente (Español)",
        provider_title: "Doctor (English)",
        tap_to_speak: "Toca para hablar",
        listening: "Escuchando...",
        processing: "Traduciendo...",
        end_session: "Terminar Sesión",
        read_aloud: "Leer en voz alta",
        input_placeholder: "O escribe aquí...",
        send: "Enviar"
      },
      transcript: {
        title: "Resumen de Visita",
        save: "Guardar Sesión",
        share: "Compartir",
        saved_success: "¡Sesión guardada exitosamente!",
        back: "Volver al Inicio",
        provider: "Proveedor",
        specialty: "Especialidad",
        duration: "Duración",
        messages: "Mensajes",
        lifestyle_title: "Instrucciones de Estilo de Vida / Lifestyle Instructions",
        lifestyle_diet: "Dieta / Diet",
        lifestyle_exercise: "Ejercicio / Exercise",
        lifestyle_pt: "Fisioterapia / Physical Therapy",
        lifestyle_save: "Guardar / Save",
        lifestyle_share: "Compartir / Share"
      },
      history: {
        title: "Historial de Consultas",
        empty: "No hay sesiones guardadas aún.",
        delete: "Eliminar",
        view: "Ver transcripción"
      },
      providers: {
        title: "Buscar un Doctor",
        search_placeholder: "¿Cuál es tu preocupación de salud?",
        specialty: "Especialidad",
        languages: "Idiomas",
        call: "Llamar",
        book: "Reservar",
        coming_soon: "Próximamente"
      },
      common: {
        cancel: "Cancelar",
        confirm: "Confirmar",
        error: "Ha ocurrido un error.",
        back: "Volver"
      }
    }
  },
  en: {
    translation: {
      onboarding: {
        step1_title: "Welcome to Care Clarity",
        step1_desc: "Your personal real-time medical translator.",
        step2_title: "Microphone Access",
        step2_desc: "Care Clarity needs microphone access to listen and translate your medical consultation instantly.",
        step3_title: "Privacy Guaranteed",
        step3_desc: "🔒 This app does not save audio recordings. Your privacy is our priority.",
        btn_start: "Get Started",
        btn_understand: "I Understand",
        btn_skip: "Skip"
      },
      legal: {
        title: "Legal & Privacy / Legal y Privacidad",
        privacy_title: "Privacy Notice / Aviso de Privacidad",
        privacy_body: "🔒 This app does not save audio recordings. Transcriptions are stored only on your device.",
        hipaa_title: "HIPAA Rights Notice / Aviso de Derechos HIPAA",
        hipaa_body: "You have the right to access, correct, and delete your health information at any time. This app does not share your information with third parties.",
        terms_title: "Terms of Use / Términos de Uso",
        terms_body: "Care Clarity is a translation aid — not a medical device. Always confirm important medical information directly with your provider.",
        data_rights_title: "Data Deletion Rights / Derecho a Eliminar Datos",
        data_rights_body: "You may delete all your saved data at any time from the Settings screen.",
        accept_btn: "I understand and agree / Entiendo y acepto",
        scroll_to_accept: "Scroll to the bottom to accept",
        accepted_on: "Accepted on",
        view: "View",
        delete_all: "Delete All My Data / Eliminar todos mis datos",
        delete_confirm: "Are you sure? This will delete all your sessions, reminders, and saved settings. / ¿Estás seguro? Esto eliminará todas tus sesiones, recordatorios y configuraciones guardadas.",
        delete_cancel: "Cancel / Cancelar"
      },
      nav: {
        home: "Home",
        search: "Search",
        book: "Book",
        translate: "Translate",
        settings: "Settings",
        consultation: "Consultation",
        history: "History",
        providers: "Providers"
      },
      home: {
        greeting: "Hello, Maria",
        greeting_sub: "What do you need today?",
        more_services: "More Services",
        action_find_provider: "Find Provider",
        action_find_desc: "Search specialists",
        action_book: "Book Appointment",
        action_book_desc: "Schedule a visit",
        action_intake: "Intake Forms",
        action_intake_desc: "Admin documents",
        action_translate: "Translation",
        action_translate_desc: "Live with doctor",
        action_post_visit: "Post-Visit Summary",
        action_pharmacy: "Pharmacy",
        action_referrals: "Referrals",
        subtitle: "Your medical translator",
        start_now: "Start now",
        consultation_desc: "Start a live translation with your doctor.",
        find_specialists: "Find specialists",
        saved_sessions: "Saved sessions"
      },
      booking: {
        title: "Book Appointment",
        select_method: "Select a booking method",
        provider_label: "Selected Provider",
        method_call: "Phone Call",
        call_desc: "Real-time speech translation",
        method_form: "Online Form",
        form_desc: "Translated form fields",
        method_email: "Email",
        email_desc: "Auto-translated message",
        calendar_reminder: "Add Spanish reminder to phone calendar",
        reminder_set: "✓ Reminder added to calendar",
        reminder_failed: "Could not add to calendar. Downloading .ics file..."
      },
      intake: {
        title: "Intake Forms",
        digital_form: "Digital Intake Form (Translated)",
        paper_form: "Paper Form Translation",
        capture_btn: "Capture Paper Form",
        hipaa_title: "Privacy Notice (HIPAA)",
        hipaa_accept: "I have read and accept",
        continue_btn: "Continue to Consultation →"
      },
      pharmacy: {
        title: "Pharmacy",
        scan_label: "Scan Label",
        dialog_title: "Pharmacist Dialog",
        dialog_btn: "🎤 Start Dialog Translation",
        reminders_title: "Medication Reminders",
        continue_btn: "Continue to Referrals →"
      },
      referrals: {
        title: "Referrals",
        active_title: "Active Referrals",
        flow_title: "Referral Flow",
        search_book: "Search & Book",
        share_history: "📎 Share History",
        intake_forms: "Intake Forms"
      },
      settings: {
        title: "Settings",
        profile_title: "User Profile",
        security_title: "Security & Privacy",
        biometric: "Biometric Lock",
        encryption: "Data Encryption",
        offline_mode: "Offline Mode",
        offline_features: "Offline Features",
        language: "Interface Language",
        large_text: "Large Text",
        privacy: "View Privacy Policy",
        version: "Version",
        reminders_title: "My Reminders / Mis Recordatorios",
        no_reminders: "No saved reminders yet.",
        legal_title: "Legal & Consent / Legal y Consentimiento"
      },
      consultation: {
        consent_title: "Recording Consent",
        consent_desc: "Does the doctor consent to this session being transcribed for translation purposes?",
        consent_yes: "Doctor Consents ✓",
        consent_no: "Declines",
        privacy_badge: "🔒 No audio stored",
        patient_title: "Patient (Español)",
        provider_title: "Provider (English)",
        tap_to_speak: "Tap to speak",
        listening: "Listening...",
        processing: "Translating...",
        end_session: "End Session",
        read_aloud: "Read aloud",
        input_placeholder: "Or type here...",
        send: "Send"
      },
      transcript: {
        title: "Post-Visit Summary",
        save: "Save Session",
        share: "Share",
        saved_success: "Session saved successfully!",
        back: "Back to Home",
        provider: "Provider",
        specialty: "Specialty",
        duration: "Duration",
        messages: "Messages",
        lifestyle_title: "Lifestyle Instructions / Instrucciones de Estilo de Vida",
        lifestyle_diet: "Diet / Dieta",
        lifestyle_exercise: "Exercise / Ejercicio",
        lifestyle_pt: "Physical Therapy / Fisioterapia",
        lifestyle_save: "Save / Guardar",
        lifestyle_share: "Share / Compartir"
      },
      history: {
        title: "Consultation History",
        empty: "No saved sessions yet.",
        delete: "Delete",
        view: "View transcript"
      },
      providers: {
        title: "Find a Provider",
        search_placeholder: "What is your health concern?",
        specialty: "Specialty",
        languages: "Languages",
        call: "Call",
        book: "Book",
        coming_soon: "Coming soon"
      },
      common: {
        cancel: "Cancel",
        confirm: "Confirm",
        error: "An error occurred.",
        back: "Back"
      }
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: "en",
    fallbackLng: "en",
    interpolation: {
      escapeValue: false 
    }
  });

export default i18n;
