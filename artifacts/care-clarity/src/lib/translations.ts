export type Language = "en" | "es";

export const t: Record<Language, Record<string, string>> = {
  en: {
    // Screen 0
    selectLanguage: "Please select your language",
    english: "English",
    spanish: "Español",

    // Navigation
    next: "Next",
    back: "Back",
    saveAndContinue: "Save and Continue",

    // Screen 1
    basicProfile: "Basic Profile",
    basicProfileSubtitle: "Let's start with some basic information",
    firstName: "First name",
    lastName: "Last name",
    dateOfBirth: "Date of birth",
    biologicalSex: "Biological sex",
    male: "Male",
    female: "Female",
    preferNotToSay: "Prefer not to say",
    primaryLanguage: "Primary language",
    english_label: "English",
    spanish_label: "Spanish",

    // Screen 2
    healthHistory: "Health History",
    healthHistorySubtitle: "Help us understand your medical background",
    knownConditions: "Known conditions",
    diabetes: "Diabetes",
    heartDisease: "Heart disease",
    hypertension: "Hypertension",
    asthma: "Asthma",
    cancer: "Cancer",
    noneOfTheAbove: "None of the above",
    other: "Other",
    allergies: "Allergies",
    allergiesPlaceholder: "e.g. penicillin, peanuts",
    surgicalHistory: "Surgical history",
    surgicalNone: "None",
    surgicalMinor: "Yes, minor",
    surgicalMajor: "Yes, major",

    // Screen 3
    currentMedications: "Current Medications",
    currentMedicationsSubtitle: "Tell us about any medications you are taking",
    takingMedications: "Are you currently taking any medications?",
    yes: "Yes",
    no: "No",
    medicationName: "Medication name",
    dosage: "Dosage",
    medicationNamePlaceholder: "e.g. Lisinopril",
    dosagePlaceholder: "e.g. 10mg daily",
    addMedication: "+ Add medication",

    // Screen 4
    todaysVisit: "Today's Visit",
    todaysVisitSubtitle: "Tell us about why you're here today",
    whatBringsYouIn: "What brings you in today?",
    whatBringsYouInPlaceholder: "Describe your symptoms or reason for visit...",
    symptomSeverity: "How severe are your symptoms?",
    mild: "Mild",
    moderate: "Moderate",
    severe: "Severe",
    symptomDuration: "How long have you had these symptoms?",
    today: "Today",
    twothreeDays: "2–3 days",
    aboutAWeek: "About a week",
    moreThanAWeek: "More than a week",
    moreThanAMonth: "More than a month",

    // Screen 5
    consentPrivacy: "Consent & Privacy",
    consentStatement: "I consent to CareClarity storing and using my health information to assist with my care. I understand this is a demonstration application.",
    haveReadAndUnderstood: "I have read and understood the above",
    whoCanSee: "Who can see my health information?",
    onlyMe: "Only me",
    meAndCareTeam: "Me and my care team",

    // Errors
    pleaseCompleteRequired: "Please complete all required fields before continuing.",
    saveFailed: "We were unable to save your health profile. Please try again.",
    fieldRequired: "This field is required",
    consentRequired: "You must accept the consent to continue",
  },
  es: {
    // Screen 0
    selectLanguage: "Por favor selecciona tu idioma",
    english: "English",
    spanish: "Español",

    // Navigation
    next: "Siguiente",
    back: "Anterior",
    saveAndContinue: "Guardar y continuar",

    // Screen 1
    basicProfile: "Perfil básico",
    basicProfileSubtitle: "Empecemos con información básica",
    firstName: "Nombre",
    lastName: "Apellido",
    dateOfBirth: "Fecha de nacimiento",
    biologicalSex: "Sexo biológico",
    male: "Masculino",
    female: "Femenino",
    preferNotToSay: "Prefiero no decir",
    primaryLanguage: "Idioma principal",
    english_label: "Inglés",
    spanish_label: "Español",

    // Screen 2
    healthHistory: "Historial de salud",
    healthHistorySubtitle: "Ayúdenos a entender su historial médico",
    knownConditions: "Condiciones conocidas",
    diabetes: "Diabetes",
    heartDisease: "Enfermedades del corazón",
    hypertension: "Hipertensión",
    asthma: "Asma",
    cancer: "Cáncer",
    noneOfTheAbove: "Ninguna de las anteriores",
    other: "Otra",
    allergies: "Alergias",
    allergiesPlaceholder: "p. ej. penicilina, maní",
    surgicalHistory: "Historial quirúrgico",
    surgicalNone: "Ninguno",
    surgicalMinor: "Sí, menor",
    surgicalMajor: "Sí, mayor",

    // Screen 3
    currentMedications: "Medicamentos actuales",
    currentMedicationsSubtitle: "Cuéntenos sobre los medicamentos que está tomando",
    takingMedications: "¿Está tomando actualmente algún medicamento?",
    yes: "Sí",
    no: "No",
    medicationName: "Nombre del medicamento",
    dosage: "Dosis",
    medicationNamePlaceholder: "p. ej. Lisinopril",
    dosagePlaceholder: "p. ej. 10mg diarios",
    addMedication: "+ Añadir medicamento",

    // Screen 4
    todaysVisit: "Visita de hoy",
    todaysVisitSubtitle: "Cuéntenos por qué está aquí hoy",
    whatBringsYouIn: "¿Qué lo trae hoy?",
    whatBringsYouInPlaceholder: "Describa sus síntomas o la razón de su visita...",
    symptomSeverity: "Gravedad de los síntomas",
    mild: "Leve",
    moderate: "Moderado",
    severe: "Grave",
    symptomDuration: "¿Cuánto tiempo lleva con estos síntomas?",
    today: "Hoy",
    twothreeDays: "2–3 días",
    aboutAWeek: "Aproximadamente una semana",
    moreThanAWeek: "Más de una semana",
    moreThanAMonth: "Más de un mes",

    // Screen 5
    consentPrivacy: "Consentimiento y privacidad",
    consentStatement: "Consiento que CareClarity almacene y utilice mi información de salud para asistir con mi atención. Entiendo que esta es una aplicación de demostración.",
    haveReadAndUnderstood: "He leído y entendido lo anterior",
    whoCanSee: "¿Quién puede ver mi información de salud?",
    onlyMe: "Solo yo",
    meAndCareTeam: "Yo y mi equipo de atención",

    // Errors
    pleaseCompleteRequired: "Por favor complete todos los campos requeridos antes de continuar.",
    saveFailed: "No pudimos guardar su perfil de salud. Por favor intente de nuevo.",
    fieldRequired: "Este campo es obligatorio",
    consentRequired: "Debe aceptar el consentimiento para continuar",
  },
};
