import { useState } from "react";
import { useLocation } from "wouter";
import { Language, t } from "@/lib/translations";
import { FormData, initialFormData } from "./types";
import Screen0Language from "./Screen0Language";
import Screen1BasicProfile from "./Screen1BasicProfile";
import Screen2HealthHistory from "./Screen2HealthHistory";
import Screen3Medications from "./Screen3Medications";
import Screen4TodaysVisit from "./Screen4TodaysVisit";
import Screen5Consent from "./Screen5Consent";
import { useCreatePatientHealthProfile } from "@workspace/api-client-react";

const TOTAL_STEPS = 5; // screens 1–5

function StepDots({ current }: { current: number }) {
  return (
    <div
      style={{ display: "flex", gap: 8, justifyContent: "center", padding: "16px 0 8px" }}
      role="progressbar"
      aria-valuenow={current}
      aria-valuemin={1}
      aria-valuemax={TOTAL_STEPS}
    >
      {Array.from({ length: TOTAL_STEPS }).map((_, i) => {
        const step = i + 1;
        let cls = "cc-step-dot upcoming";
        if (step < current) cls = "cc-step-dot completed";
        else if (step === current) cls = "cc-step-dot current";
        return <div key={i} className={cls} aria-label={`Step ${step}`} />;
      })}
    </div>
  );
}

function validateScreen(screen: number, data: FormData, lang: Language): Record<string, string> {
  const tr = t[lang];
  const errs: Record<string, string> = {};

  if (screen === 1) {
    if (!data.firstName.trim()) errs.firstName = tr.fieldRequired;
    if (!data.lastName.trim()) errs.lastName = tr.fieldRequired;
    if (!data.dateOfBirth) errs.dateOfBirth = tr.fieldRequired;
    if (!data.biologicalSex) errs.biologicalSex = tr.fieldRequired;
  }

  if (screen === 2) {
    if (!data.surgicalHistory) errs.surgicalHistory = tr.fieldRequired;
  }

  if (screen === 4) {
    if (!data.visitReason.trim()) errs.visitReason = tr.fieldRequired;
    if (!data.symptomSeverity) errs.symptomSeverity = tr.fieldRequired;
    if (!data.symptomDuration) errs.symptomDuration = tr.fieldRequired;
  }

  if (screen === 5) {
    if (!data.consentGiven) errs.consentGiven = tr.consentRequired;
  }

  return errs;
}

export default function IntakeFlow() {
  const [, setLocation] = useLocation();
  const [screen, setScreen] = useState<0 | 1 | 2 | 3 | 4 | 5>(0);
  const [lang, setLang] = useState<Language>("en");
  const [data, setData] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const createProfile = useCreatePatientHealthProfile();

  const handleChange = (updates: Partial<FormData>) => {
    setData((prev) => ({ ...prev, ...updates }));
    // Clear errors for changed fields
    const clearedKeys = Object.keys(updates);
    if (clearedKeys.some((k) => errors[k])) {
      setErrors((prev) => {
        const next = { ...prev };
        clearedKeys.forEach((k) => delete next[k]);
        return next;
      });
    }
  };

  const handleLanguageSelect = (selectedLang: Language) => {
    setLang(selectedLang);
    setData((prev) => ({ ...prev, language: selectedLang }));
    setScreen(1);
  };

  const handleNext = () => {
    const errs = validateScreen(screen, data, lang);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});
    if (screen < 5) {
      setScreen((s) => (s + 1) as typeof screen);
    }
  };

  const handleBack = () => {
    if (screen > 1) {
      setErrors({});
      setScreen((s) => (s - 1) as typeof screen);
    }
  };

  const handleSubmit = async () => {
    const errs = validateScreen(5, data, lang);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      const medications = data.takingMedications
        ? data.medications.filter((m) => m.name.trim())
        : [];

      await createProfile.mutateAsync({
        data: {
          userId: null,
          languagePreference: lang,
          firstName: data.firstName.trim(),
          lastName: data.lastName.trim(),
          dateOfBirth: data.dateOfBirth,
          biologicalSex: data.biologicalSex,
          knownConditions: data.knownConditions,
          allergies: data.allergies.trim() || null,
          surgicalHistory: data.surgicalHistory,
          medications,
          visitReason: data.visitReason.trim(),
          symptomSeverity: data.symptomSeverity as "mild" | "moderate" | "severe",
          symptomDuration: data.symptomDuration,
          consentGiven: data.consentGiven,
          privacySetting: data.privacySetting,
        },
      });

      setLocation("/dashboard");
    } catch {
      setErrors({ submit: t[lang].saveFailed });
    } finally {
      setIsSubmitting(false);
    }
  };

  const tr = t[lang];

  if (screen === 0) {
    return <Screen0Language onSelect={handleLanguageSelect} />;
  }

  const isLastScreen = screen === 5;
  const showBack = screen > 1;

  return (
    <div className="cc-screen">
      <StepDots current={screen} />

      <div style={{ flex: 1, overflowY: "auto", paddingBottom: 8 }}>
        {screen === 1 && (
          <Screen1BasicProfile lang={lang} data={data} onChange={handleChange} errors={errors} />
        )}
        {screen === 2 && (
          <Screen2HealthHistory lang={lang} data={data} onChange={handleChange} errors={errors} />
        )}
        {screen === 3 && (
          <Screen3Medications lang={lang} data={data} onChange={handleChange} />
        )}
        {screen === 4 && (
          <Screen4TodaysVisit lang={lang} data={data} onChange={handleChange} errors={errors} />
        )}
        {screen === 5 && (
          <Screen5Consent lang={lang} data={data} onChange={handleChange} errors={errors} />
        )}
      </div>

      {/* Bottom navigation */}
      <div style={{ paddingTop: 16, paddingBottom: 32, display: "flex", flexDirection: "column", gap: 12 }}>
        <button
          className="cc-btn-primary"
          onClick={isLastScreen ? handleSubmit : handleNext}
          disabled={isLastScreen ? (!data.consentGiven || isSubmitting) : false}
          data-testid={isLastScreen ? "btn-save-continue" : "btn-next"}
        >
          {isSubmitting ? (
            <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ animation: "spin 1s linear infinite" }}>
                <path d="M21 12a9 9 0 11-6.219-8.56"/>
              </svg>
              {isLastScreen ? tr.saveAndContinue : tr.next}
            </span>
          ) : (
            <>
              {isLastScreen ? tr.saveAndContinue : (
                <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  {tr.next}
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 18 15 12 9 6"/>
                  </svg>
                </span>
              )}
            </>
          )}
        </button>

        {showBack && (
          <button
            onClick={handleBack}
            style={{
              background: "transparent",
              border: "none",
              color: "var(--cc-primary)",
              fontSize: 16,
              cursor: "pointer",
              fontFamily: "'Inter', sans-serif",
              fontWeight: 500,
              padding: "8px 0",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
            }}
            data-testid="btn-back"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
            {tr.back}
          </button>
        )}
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
