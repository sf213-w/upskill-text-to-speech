import { Language, t } from "@/lib/translations";
import { FormData, Medication } from "@/pages/intake/types";

interface Props {
  lang: Language;
  data: FormData;
  onChange: (updates: Partial<FormData>) => void;
}

const MAX_MEDICATIONS = 3;

export default function Screen3Medications({ lang, data, onChange }: Props) {
  const tr = t[lang];

  const setTakingMeds = (val: boolean) => {
    onChange({
      takingMedications: val,
      medications: val ? (data.medications.length > 0 ? data.medications : [{ name: "", dosage: "" }]) : [],
    });
  };

  const updateMedication = (index: number, field: keyof Medication, value: string) => {
    const updated = data.medications.map((m, i) => (i === index ? { ...m, [field]: value } : m));
    onChange({ medications: updated });
  };

  const addMedication = () => {
    if (data.medications.length < MAX_MEDICATIONS) {
      onChange({ medications: [...data.medications, { name: "", dosage: "" }] });
    }
  };

  return (
    <div style={{ paddingTop: 24, flex: 1, display: "flex", flexDirection: "column", gap: 20 }}>
      <div>
        <h1 className="cc-page-title" data-testid="title-medications">{tr.currentMedications}</h1>
        <p className="cc-subtitle">{tr.currentMedicationsSubtitle}</p>
      </div>

      {/* Toggle yes/no */}
      <div>
        <label className="cc-label">{tr.takingMedications}</label>
        <div style={{ display: "flex", gap: 12 }}>
          <button
            className={`cc-toggle-btn ${data.takingMedications === true ? "selected" : ""}`}
            onClick={() => setTakingMeds(true)}
            data-testid="btn-medications-yes"
          >
            {tr.yes}
          </button>
          <button
            className={`cc-toggle-btn ${data.takingMedications === false ? "selected" : ""}`}
            onClick={() => setTakingMeds(false)}
            data-testid="btn-medications-no"
          >
            {tr.no}
          </button>
        </div>
      </div>

      {/* Medication rows */}
      {data.takingMedications === true && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {data.medications.map((med, index) => (
            <div key={index} className="cc-card" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div>
                <label className="cc-label" style={{ fontSize: 14, marginBottom: 6 }} htmlFor={`med-name-${index}`}>
                  {tr.medicationName}
                </label>
                <input
                  id={`med-name-${index}`}
                  className="cc-input"
                  type="text"
                  value={med.name}
                  onChange={(e) => updateMedication(index, "name", e.target.value)}
                  placeholder={tr.medicationNamePlaceholder}
                  data-testid={`input-medication-name-${index}`}
                />
              </div>
              <div>
                <label className="cc-label" style={{ fontSize: 14, marginBottom: 6 }} htmlFor={`med-dosage-${index}`}>
                  {tr.dosage}
                </label>
                <input
                  id={`med-dosage-${index}`}
                  className="cc-input"
                  type="text"
                  value={med.dosage}
                  onChange={(e) => updateMedication(index, "dosage", e.target.value)}
                  placeholder={tr.dosagePlaceholder}
                  data-testid={`input-medication-dosage-${index}`}
                />
              </div>
            </div>
          ))}

          {data.medications.length < MAX_MEDICATIONS && (
            <button
              onClick={addMedication}
              style={{
                background: "transparent",
                border: `1px dashed var(--cc-input-border)`,
                borderRadius: 8,
                padding: "14px 16px",
                fontSize: 16,
                color: "var(--cc-primary)",
                cursor: "pointer",
                fontFamily: "'Inter', sans-serif",
                fontWeight: 500,
                textAlign: "center",
              }}
              data-testid="btn-add-medication"
            >
              {tr.addMedication}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
