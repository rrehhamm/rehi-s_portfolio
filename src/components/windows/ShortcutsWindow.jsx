import { KEYBOARD_SHORTCUTS } from "../../utils/constants";

export default function ShortcutsWindow() {
  return (
    <div className="win">
      <div className="win-scroll">
        <p className="win-lead" style={{ marginBottom: 14 }}>Keyboard shortcuts for navigating the desktop.</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {KEYBOARD_SHORTCUTS.map((s) => (
            <div key={s.action} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 4px", borderBottom: "1px solid var(--border-soft)" }}>
              <span style={{ fontSize: 13 }}>{s.action}</span>
              <kbd style={{ fontFamily: "var(--font-secondary)", fontSize: 11.5, background: "var(--bg-surface-alt)", border: "1px solid var(--border-strong)", borderRadius: 6, padding: "3px 8px" }}>{s.keys}</kbd>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
