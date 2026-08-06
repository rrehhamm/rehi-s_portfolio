import { Check } from "lucide-react";
import { uiTestingChecklist, uiRecommendations } from "../../../data/qaSkills";
import EmptyState from "../../shared/EmptyState";

export default function UITestingTab() {
  if (uiTestingChecklist.length === 0 && uiRecommendations.length === 0) {
    return (
      <EmptyState
        icon="palette"
        title="No UI testing notes yet"
        text="Add a checklist and recommendations to qaSkills.js."
      />
    );
  }

  return (
    <div>
      <p className="win-lead">A checklist I use while reviewing an interface for consistency and polish.</p>

      <p className="section-title">UI Testing Checklist</p>
      <div className="card-grid">
        {uiTestingChecklist.map((item) => (
          <div key={item} className="card qalab__checklist-item">
            <Check size={14} /> {item}
          </div>
        ))}
      </div>

      <p className="section-title">Example Recommendations</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {uiRecommendations.map((r) => (
          <div key={r.id} className="card">
            <p style={{ fontFamily: "var(--font-secondary)", fontWeight: 700, fontSize: 13, marginBottom: 8 }}>{r.title}</p>
            <div className="qalab__before-after">
              <div>
                <p className="detail-field__label">Before</p>
                <p className="detail-field__value">{r.before}</p>
              </div>
              <div>
                <p className="detail-field__label">After (Example)</p>
                <p className="detail-field__value">{r.after}</p>
              </div>
            </div>
            <p className="qalab__note">{r.note}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
