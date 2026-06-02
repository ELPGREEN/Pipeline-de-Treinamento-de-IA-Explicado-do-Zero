const UI = {
  Card: ({ children, onClick, active, color }) => (
    <button
      onClick={onClick}
      style={{
        background: active ? `${color}20` : "#0d1117",
        border: active ? `1px solid ${color}` : "1px solid #1e293b",
        borderRadius: 12, padding: "16px", cursor: "pointer", textAlign: "left",
        transition: "all 0.2s", color: "inherit", position: "relative"
      }}
    >
      {children}
    </button>
  ),
  Tabs: ({ tabs, activeTab, onTabChange, color }) => (
    <div style={{ display: "flex", borderBottom: "1px solid #1e293b", padding: "0 24px" }}>
      {tabs.map(t => (
        <button
          key={t}
          onClick={() => onTabChange(t)}
          style={{
            background: "none", border: "none",
            borderBottom: activeTab === t ? `2px solid ${color}` : "2px solid transparent",
            color: activeTab === t ? color : "#475569",
            padding: "14px 16px", cursor: "pointer", fontSize: 12, fontWeight: 600,
            textTransform: "uppercase", transition: "all 0.2s"
          }}
        >
          {t}
        </button>
      ))}
    </div>
  ),
  CodeBlock: ({ code, language = "python" }) => (
    <div style={{ background: "#030508", borderRadius: 10, border: "1px solid #1e293b", overflow: "hidden" }}>
      <div style={{ padding: "10px 16px", borderBottom: "1px solid #1e293b", fontSize: 11, color: "#475569", display: "flex", gap: 8 }}>
        <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#ff5f57" }} />
        <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#ffbd2e" }} />
        <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#28c840" }} />
        <span style={{marginLeft: "auto"}}>{language}</span>
      </div>
      <pre style={{ padding: "20px", margin: 0, fontSize: 13, color: "#7dd3fc", overflowX: "auto", fontFamily: "monospace" }}>
        <code>{code}</code>
      </pre>
    </div>
  )
};

// Global safely attached to window for cross-script access in browser
try {
  Object.defineProperty(window, 'AppUI', {
    value: UI,
    writable: false,
    configurable: false
  });
} catch (e) {
  window.AppUI = UI;
}
