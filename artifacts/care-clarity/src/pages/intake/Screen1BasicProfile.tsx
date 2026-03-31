import { Language, t } from "@/lib/translations";
import { FormData } from "@/pages/intake/types";

interface Props {
  lang: Language;
  data: FormData;
  onChange: (updates: Partial<FormData>) => void;
  errors: Record<string, string>;
}

export default function Screen1BasicProfile({ lang, data, onChange, errors }: Props) {
  const tr = t[lang];

  return (
    <div style={{ paddingTop: 24, flex: 1, display: "flex", flexDirection: "column", gap: 20 }}>
      <div>
        <h1 className="cc-page-title" data-testid="title-basic-profile">{tr.basicProfile}</h1>
        <p className="cc-subtitle">{tr.basicProfileSubtitle}</p>
      </div>

      {/* First Name */}
      <div>
        <label className="cc-label" htmlFor="firstName">{tr.firstName}</label>
        <input
          id="firstName"
          className="cc-input"
          type="text"
          value={data.firstName}
          onChange={(e) => onChange({ firstName: e.target.value })}
          placeholder={tr.firstName}
          data-testid="input-first-name"
          autoComplete="given-name"
        />
        {errors.firstName && <div className="cc-error" data-testid="error-first-name">{errors.firstName}</div>}
      </div>

      {/* Last Name */}
      <div>
        <label className="cc-label" htmlFor="lastName">{tr.lastName}</label>
        <input
          id="lastName"
          className="cc-input"
          type="text"
          value={data.lastName}
          onChange={(e) => onChange({ lastName: e.target.value })}
          placeholder={tr.lastName}
          data-testid="input-last-name"
          autoComplete="family-name"
        />
        {errors.lastName && <div className="cc-error" data-testid="error-last-name">{errors.lastName}</div>}
      </div>

      {/* Date of Birth */}
      <div>
        <label className="cc-label" htmlFor="dateOfBirth">{tr.dateOfBirth}</label>
        <input
          id="dateOfBirth"
          className="cc-input"
          type="date"
          value={data.dateOfBirth}
          onChange={(e) => onChange({ dateOfBirth: e.target.value })}
          data-testid="input-date-of-birth"
          max={new Date().toISOString().split("T")[0]}
        />
        {errors.dateOfBirth && <div className="cc-error" data-testid="error-date-of-birth">{errors.dateOfBirth}</div>}
      </div>

      {/* Biological Sex */}
      <div>
        <label className="cc-label" htmlFor="biologicalSex">{tr.biologicalSex}</label>
        <div style={{ position: "relative" }}>
          <select
            id="biologicalSex"
            className="cc-select"
            value={data.biologicalSex}
            onChange={(e) => onChange({ biologicalSex: e.target.value })}
            data-testid="select-biological-sex"
          >
            <option value="">—</option>
            <option value="male">{tr.male}</option>
            <option value="female">{tr.female}</option>
            <option value="prefer_not_to_say">{tr.preferNotToSay}</option>
          </select>
        </div>
        {errors.biologicalSex && <div className="cc-error" data-testid="error-biological-sex">{errors.biologicalSex}</div>}
      </div>

      {/* Primary language — read-only confirmation */}
      <div className="cc-card" style={{ background: "rgba(214,237,231,0.4)" }}>
        <label className="cc-label" style={{ fontSize: 14, color: "#4A7A72", marginBottom: 4 }}>
          {tr.primaryLanguage}
        </label>
        <p style={{ fontSize: 16, fontWeight: 500, color: "var(--cc-text-dark)" }} data-testid="text-primary-language">
          {lang === "en" ? tr.english_label : tr.spanish_label}
        </p>
      </div>
    </div>
  );
}
