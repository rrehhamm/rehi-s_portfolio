import { qaOverview, qaSkillCards } from "../../../data/qaSkills";
import EmptyState from "../../shared/EmptyState";

export default function OverviewTab() {
  const isEmpty = !qaOverview.heading && qaOverview.paragraphs.length === 0 && qaSkillCards.length === 0;

  if (isEmpty) {
    return (
      <EmptyState
        icon="flask-conical"
        title="QA overview coming soon"
        text="Add your real overview, interests, and skill snapshot to qaSkills.js."
      />
    );
  }

  return (
    <div>
      <h2 className="win-title" style={{ fontSize: 21 }}>{qaOverview.heading}</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 12, fontSize: 13.5, lineHeight: 1.7 }}>
        {qaOverview.paragraphs.map((p, i) => <p key={i}>{p}</p>)}
      </div>

      <p className="section-title">Current QA Interests</p>
      <div className="tag-row">
        {qaOverview.interests.map((i) => <span key={i} className="tag">{i}</span>)}
      </div>

      <p className="section-title">Skill Snapshot</p>
      <div className="card-grid">
        {qaSkillCards.map((s) => (
          <div key={s.name} className="card">
            <p style={{ fontFamily: "var(--font-secondary)", fontWeight: 700, fontSize: 13 }}>{s.name}</p>
            <span className="badge badge--outline" style={{ marginTop: 6 }}>{s.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
