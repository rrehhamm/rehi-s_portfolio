import { exploratorySession } from "../../../data/qaSkills";
import EmptyState from "../../shared/EmptyState";

export default function ExploratoryTestingTab() {
  const s = exploratorySession;

  if (!s.charter) {
    return (
      <EmptyState
        icon="compass"
        title="No exploratory session logged yet"
        text="Add a session to exploratorySession in qaSkills.js."
      />
    );
  }

  return (
    <div>
      <p className="win-lead">A session-based exploratory testing template I use to keep exploration focused and documented.</p>

      <div className="card">
        <div className="tag-row" style={{ marginBottom: 10 }}>
          <span className="badge badge--outline">{s.sessionId}</span>
          <span className="badge badge--muted">{s.duration}</span>
        </div>
        <div className="detail-field"><p className="detail-field__label">Charter</p><p className="detail-field__value">{s.charter}</p></div>
        <div className="detail-field"><p className="detail-field__label">Scope</p><p className="detail-field__value">{s.scope}</p></div>
        <div className="detail-field"><p className="detail-field__label">Environment</p><p className="detail-field__value">{s.environment}</p></div>
        <div className="detail-field"><p className="detail-field__label">Tester</p><p className="detail-field__value">{s.tester}</p></div>

        <div className="detail-field">
          <p className="detail-field__label">Areas Explored</p>
          <div className="tag-row">{s.areasExplored.map((a) => <span key={a} className="tag">{a}</span>)}</div>
        </div>
        <div className="detail-field">
          <p className="detail-field__label">Risks</p>
          <ul className="list-plain">{s.risks.map((r, i) => <li key={i}>{r}</li>)}</ul>
        </div>
        <div className="detail-field">
          <p className="detail-field__label">Observations</p>
          <ul className="list-plain">{s.observations.map((o, i) => <li key={i}>{o}</li>)}</ul>
        </div>
        <div className="detail-field">
          <p className="detail-field__label">Bugs Found</p>
          <div className="tag-row">{s.bugsFound.map((b) => <span key={b} className="badge badge--red">{b}</span>)}</div>
        </div>
        <div className="detail-field">
          <p className="detail-field__label">Questions</p>
          <ul className="list-plain">{s.questions.map((q, i) => <li key={i}>{q}</li>)}</ul>
        </div>
        <div className="detail-field">
          <p className="detail-field__label">Follow-up Actions</p>
          <ul className="list-plain">{s.followUpActions.map((f, i) => <li key={i}>{f}</li>)}</ul>
        </div>
      </div>
    </div>
  );
}
