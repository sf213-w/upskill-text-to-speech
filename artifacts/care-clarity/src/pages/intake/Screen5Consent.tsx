import { Language, t } from "@/lib/translations";
import { FormData } from "@/pages/intake/types";

interface Props {
  lang: Language;
  data: FormData;
  onChange: (updates: Partial<FormData>) => void;
  errors: Record<string, string>;
}

export default function Screen5Consent({ lang, data, onChange, errors }: Props) {
  const tr = t[lang];

  return (
    <div style={{ paddingTop: 24, flex: 1, display: "flex", flexDirection: "column", gap: 20 }}>
      <div>
        <h1 className="cc-page-title" data-testid="title-consent">{tr.consentPrivacy}</h1>
      </div>

      {/* Consent statement */}
      <div
        className="cc-card"
        style={{
          background: "rgba(214,237,231,0.35)",
          borderColor: "var(--cc-primary-pale)",
        }}
        data-testid="text-consent-statement"
      >
        <p style={{ fontSize: 16, lineHeight: 1.6, color: "var(--cc-text-dark)" }}>
          {tr.consentStatement}
        </p>
      </div>

      {/* Consent checkbox */}
      <div>
        <label className="cc-checkbox-wrapper" data-testid="checkbox-consent-read">
          <input
            type="checkbox"
            checked={data.consentGiven}
            onChange={(e) => onChange({ consentGiven: e.target.checked })}
          />
          <span style={{ fontSize: 16, fontWeight: 500, color: "var(--cc-text-dark)" }}>
            {tr.haveReadAndUnderstood}
          </span>
        </label>
        {errors.consentGiven && (
          <div className="cc-error" data-testid="error-consent">{errors.consentGiven}</div>
        )}
      </div>

      {/* Privacy setting */}
      <div>
        <label className="cc-label">{tr.whoCanSee}</label>
        <div className="cc-card" style={{ display: "flex", flexDirection: "column", gap: 0 }}>
          <label className="cc-radio-wrapper" data-testid="radio-privacy-private">
            <input
              type="radio"
              name="privacySetting"
              value="private"
              checked={data.privacySetting === "private"}
              onChange={() => onChange({ privacySetting: "private" })}
            />
            <span style={{ fontSize: 16, color: "var(--cc-text-dark)" }}>{tr.onlyMe}</span>
          </label>
          <label className="cc-radio-wrapper" data-testid="radio-privacy-care-team">
            <input
              type="radio"
              name="privacySetting"
              value="care_team"
              checked={data.privacySetting === "care_team"}
              onChange={() => onChange({ privacySetting: "care_team" })}
            />
            <span style={{ fontSize: 16, color: "var(--cc-text-dark)" }}>{tr.meAndCareTeam}</span>
          </label>
        </div>
      </div>

      {errors.submit && (
        <div className="cc-error" data-testid="error-submit">{errors.submit}</div>
      )}
    </div>
  );
}
