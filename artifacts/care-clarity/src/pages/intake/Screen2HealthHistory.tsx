import { Language, t } from "@/lib/translations";
import { FormData } from "@/pages/intake/types";

interface Props {
  lang: Language;
  data: FormData;
  onChange: (updates: Partial<FormData>) => void;
  errors: Record<string, string>;
}

const CONDITIONS = ["diabetes", "heartDisease", "hypertension", "asthma", "cancer", "noneOfTheAbove", "other"] as const;
const CONDITION_VALUES: Record<string, string> = {
  diabetes: "diabetes",
  heartDisease: "heart_disease",
  hypertension: "hypertension",
  asthma: "asthma",
  cancer: "cancer",
  noneOfTheAbove: "none",
  other: "other",
};

export default function Screen2HealthHistory({ lang, data, onChange, errors }: Props) {
  const tr = t[lang];

  const toggleCondition = (value: string) => {
    const isNone = value === "none";
    if (isNone) {
      onChange({ knownConditions: ["none"] });
      return;
    }
    const existing = data.knownConditions.filter((c) => c !== "none");
    if (existing.includes(value)) {
      onChange({ knownConditions: existing.filter((c) => c !== value) });
    } else {
      onChange({ knownConditions: [...existing, value] });
    }
  };

  return (
    <div style={{ paddingTop: 24, flex: 1, display: "flex", flexDirection: "column", gap: 20 }}>
      <div>
        <h1 className="cc-page-title" data-testid="title-health-history">{tr.healthHistory}</h1>
        <p className="cc-subtitle">{tr.healthHistorySubtitle}</p>
      </div>

      {/* Known conditions */}
      <div>
        <label className="cc-label">{tr.knownConditions}</label>
        <div className="cc-card" style={{ display: "flex", flexDirection: "column", gap: 0 }}>
          {CONDITIONS.map((key) => {
            const value = CONDITION_VALUES[key];
            const checked = data.knownConditions.includes(value);
            return (
              <label key={key} className="cc-checkbox-wrapper" data-testid={`checkbox-condition-${value}`}>
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggleCondition(value)}
                />
                <span style={{ fontSize: 16, color: "var(--cc-text-dark)" }}>{tr[key]}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Allergies */}
      <div>
        <label className="cc-label" htmlFor="allergies">{tr.allergies}</label>
        <input
          id="allergies"
          className="cc-input"
          type="text"
          value={data.allergies}
          onChange={(e) => onChange({ allergies: e.target.value })}
          placeholder={tr.allergiesPlaceholder}
          data-testid="input-allergies"
        />
      </div>

      {/* Surgical history */}
      <div>
        <label className="cc-label" htmlFor="surgicalHistory">{tr.surgicalHistory}</label>
        <div style={{ position: "relative" }}>
          <select
            id="surgicalHistory"
            className="cc-select"
            value={data.surgicalHistory}
            onChange={(e) => onChange({ surgicalHistory: e.target.value })}
            data-testid="select-surgical-history"
          >
            <option value="">—</option>
            <option value="none">{tr.surgicalNone}</option>
            <option value="minor">{tr.surgicalMinor}</option>
            <option value="major">{tr.surgicalMajor}</option>
          </select>
        </div>
        {errors.surgicalHistory && <div className="cc-error" data-testid="error-surgical-history">{errors.surgicalHistory}</div>}
      </div>
    </div>
  );
}
