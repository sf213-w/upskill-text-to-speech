import { Language } from "@/lib/translations";

export interface Medication {
  name: string;
  dosage: string;
}

export interface FormData {
  language: Language;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  biologicalSex: string;
  knownConditions: string[];
  allergies: string;
  surgicalHistory: string;
  takingMedications: boolean | null;
  medications: Medication[];
  visitReason: string;
  symptomSeverity: string;
  symptomDuration: string;
  consentGiven: boolean;
  privacySetting: "private" | "care_team";
}

export const initialFormData: FormData = {
  language: "en",
  firstName: "",
  lastName: "",
  dateOfBirth: "",
  biologicalSex: "",
  knownConditions: [],
  allergies: "",
  surgicalHistory: "",
  takingMedications: null,
  medications: [],
  visitReason: "",
  symptomSeverity: "",
  symptomDuration: "",
  consentGiven: false,
  privacySetting: "private",
};
