import { istqbJourney } from "../../../data/qaSkills";
import EmptyState from "../../shared/EmptyState";

const STATE_BADGE = { "In Progress": "badge--yellow", Upcoming: "badge--muted", Done: "badge--green" };

export default function ISTQBTab() {
  if (!istqbJourney.status && istqbJourney.topics.length === 0) {
    return (
      <EmptyState
        icon="cap"
        title="No ISTQB journey logged yet"
        text="Add your status and topics to istqbJourney in qaSkills.js."
      />
    );
  }

  return (
    <div>
      <div className="card" style={{ marginBottom: 18 }}>
        <p className="detail-field__label">Current Status</p>
        <p style={{ fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 600 }}>{istqbJourney.status}</p>
      </div>

      <p className="section-title">Learning Timeline</p>
      <ol className="about-window__timeline" style={{ listStyle: "none", padding: 0, margin: 0 }}>
        {istqbJourney.topics.map((t) => (
          <li key={t.name} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid var(--border-soft)" }}>
            <span style={{ fontSize: 13 }}>{t.name}</span>
            <span className={`badge ${STATE_BADGE[t.state] || "badge--muted"}`}>{t.state}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}
