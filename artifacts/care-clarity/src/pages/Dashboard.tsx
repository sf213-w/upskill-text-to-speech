export default function Dashboard() {
  return (
    <div
      style={{
        minHeight: "100dvh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--cc-surface)",
        fontFamily: "'Inter', sans-serif",
        flexDirection: "column",
        gap: 16,
        padding: 20,
        textAlign: "center",
      }}
    >
      <div
        style={{
          width: 64,
          height: 64,
          borderRadius: 16,
          background: "var(--cc-primary)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 8,
        }}
      >
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#F2F7F5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
          <polyline points="22 4 12 14.01 9 11.01"/>
        </svg>
      </div>
      <h1 style={{ fontSize: 28, fontWeight: 700, color: "var(--cc-text-dark)", margin: 0 }}>
        Health Dashboard
      </h1>
      <p style={{ fontSize: 16, color: "#4A7A72", maxWidth: 360, lineHeight: 1.5, margin: 0 }}>
        Your health profile has been saved. The full dashboard will be available here once it is built by your team.
      </p>
    </div>
  );
}
