import { Language, t } from "@/lib/translations";

interface Props {
  onSelect: (lang: Language) => void;
}

export default function Screen0Language({ onSelect }: Props) {
  return (
    <div className="cc-screen" style={{ justifyContent: "center", alignItems: "center", gap: 0 }}>
      <div style={{ textAlign: "center", paddingInlineStart: 0, paddingInlineEnd: 0, width: "100%" }}>
        {/* Logo / brand mark */}
        <div style={{ marginBottom: 40, display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 16,
              background: "var(--cc-primary)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 16,
            }}
          >
            <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 6C11.373 6 6 11.373 6 18s5.373 12 12 12 12-5.373 12-12S24.627 6 18 6zm0 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S8 23.523 8 18 12.477 8 18 8z" fill="#F2F7F5" opacity="0.5"/>
              <path d="M18 11v7l4 2.5" stroke="#F2F7F5" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="18" cy="18" r="2.5" fill="#F2F7F5"/>
            </svg>
          </div>
          <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 24, fontWeight: 700, color: "var(--cc-text-dark)", letterSpacing: "-0.02em" }}>
            CareClarity
          </div>
        </div>

        <p
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: 18,
            fontWeight: 500,
            color: "var(--cc-text-dark)",
            marginBottom: 36,
            lineHeight: 1.4,
          }}
          data-testid="text-language-prompt"
        >
          {t.en.selectLanguage}
          <br />
          <span style={{ color: "#4A7A72", fontWeight: 400, fontSize: 16 }}>{t.es.selectLanguage}</span>
        </p>

        <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
          <button
            className="cc-pill-btn"
            style={{ minWidth: 140, fontSize: 18, padding: "14px 32px" }}
            onClick={() => onSelect("en")}
            data-testid="btn-select-english"
          >
            {t.en.english}
          </button>
          <button
            className="cc-pill-btn"
            style={{ minWidth: 140, fontSize: 18, padding: "14px 32px" }}
            onClick={() => onSelect("es")}
            data-testid="btn-select-spanish"
          >
            {t.en.spanish}
          </button>
        </div>
      </div>
    </div>
  );
}
