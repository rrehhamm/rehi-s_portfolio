import { usabilityAreas, usabilityObservations } from "../../../data/qaSkills";
import EmptyState from "../../shared/EmptyState";

const PRIORITY_BADGE = { High: "badge--red", Medium: "badge--yellow", Low: "badge--muted" };

export default function UsabilityTestingTab() {
  if (usabilityAreas.length === 0 && usabilityObservations.length === 0) {
    return (
      <EmptyState
        icon="eye"
        title="No usability notes yet"
        text="Add areas and observations to qaSkills.js."
      />
    );
  }

  return (
    <div>
      <p className="win-lead">I evaluate usability across these areas, then log specific observations with a recommended fix.</p>

      <p className="section-title">Areas Covered</p>
      <div className="tag-row">
        {usabilityAreas.map((a) => <span key={a} className="tag">{a}</span>)}
      </div>

      <p className="section-title">Observations</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {usabilityObservations.map((o) => (
          <div key={o.id} className="card">
            <div className="tag-row" style={{ marginBottom: 8 }}>
              <span className="badge badge--outline">{o.area}</span>
              <span className={`badge ${PRIORITY_BADGE[o.priority]}`}>{o.priority} priority</span>
            </div>
            <div className="detail-field"><p className="detail-field__label">Observation</p><p className="detail-field__value">{o.observation}</p></div>
            <div className="detail-field"><p className="detail-field__label">User Impact</p><p className="detail-field__value">{o.userImpact}</p></div>
            <div className="detail-field"><p className="detail-field__label">Recommendation</p><p className="detail-field__value">{o.recommendation}</p></div>
          </div>
        ))}
      </div>
    </div>
  );
}
