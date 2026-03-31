import { Language, t } from "@/lib/translations";
import { FormData } from "@/pages/intake/types";

interface Props {
  lang: Language;
  data: FormData;
  onChange: (updates: Partial<FormData>) => void;
  errors: Record<string, string>;
}

const SEVERITIES = [
  { key: "mild", value: "mild" },
  { key: "moderate", value: "moderate" },
  { key: "severe", value: "severe" },
] as const;

const DURATIONS = [
  "today",
  "twothreeDays",
  "aboutAWeek",
  "moreThanAWeek",
  "moreThanAMonth",
] as const;

const DURATION_VALUES: Record<string, string> = {
  today: "today",
  twothreeDays: "2_3_days",
  aboutAWeek: "about_a_week",
  moreThanAWeek: "more_than_a_week",
  moreThanAMonth: "more_than_a_month",
};

export default function Screen4TodaysVisit({ lang, data, onChange, errors }: Props) {
  const tr = t[lang];

  return (
    <div style={{ paddingTop: 24, flex: 1, display: "flex", flexDirection: "column", gap: 20 }}>
      <div>
        <h1 className="cc-page-title" data-testid="title-todays-visit">{tr.todaysVisit}</h1>
        <p className="cc-subtitle">{tr.todaysVisitSubtitle}</p>
      </div>

      {/* Visit reason */}
      <div>
        <label className="cc-label" htmlFor="visitReason">{tr.whatBringsYouIn}</label>
        <textarea
          id="visitReason"
          className="cc-textarea"
          value={data.visitReason}
          onChange={(e) => onChange({ visitReason: e.target.value })}
          placeholder={tr.whatBringsYouInPlaceholder}
          rows={4}
          data-testid="textarea-visit-reason"
        />
        {errors.visitReason && <div className="cc-error" data-testid="error-visit-reason">{errors.visitReason}</div>}
      </div>

      {/* Severity selector */}
      <div>
        <label className="cc-label">{tr.symptomSeverity}</label>
        <div style={{ display: "flex", gap: 8 }}>
          {SEVERITIES.map(({ key, value }) => (
            <button
              key={value}
              className={`cc-severity-btn ${data.symptomSeverity === value ? "selected" : ""}`}
              onClick={() => onChange({ symptomSeverity: value })}
              data-testid={`btn-severity-${value}`}
            >
              {tr[key]}
            </button>
          ))}
        </div>
        {errors.symptomSeverity && <div className="cc-error" data-testid="error-symptom-severity">{errors.symptomSeverity}</div>}
      </div>

      {/* Duration dropdown */}
      <div>
        <label className="cc-label" htmlFor="symptomDuration">{tr.symptomDuration}</label>
        <div style={{ position: "relative" }}>
          <select
            id="symptomDuration"
            className="cc-select"
            value={data.symptomDuration}
            onChange={(e) => onChange({ symptomDuration: e.target.value })}
            data-testid="select-symptom-duration"
          >
            <option value="">—</option>
            {DURATIONS.map((key) => (
              <option key={key} value={DURATION_VALUES[key]}>{tr[key]}</option>
            ))}
          </select>
        </div>
        {errors.symptomDuration && <div className="cc-error" data-testid="error-symptom-duration">{errors.symptomDuration}</div>}
      </div>
    </div>
  );
}
