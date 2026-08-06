import { useState, useMemo } from "react";
import { Search, X } from "lucide-react";
import { motion } from "framer-motion";
import { bugReports, SEVERITY_LEVELS, BUG_STATUSES } from "../../../data/bugReports";
import EmptyState from "../../shared/EmptyState";

const SEVERITY_BADGE = { Critical: "badge--red", High: "badge--yellow", Medium: "badge--sky", Low: "badge--muted" };
const STATUS_BADGE = { Open: "badge--red", "In Progress": "badge--yellow", Fixed: "badge--green", Retest: "badge--sky", Closed: "badge--muted", Rejected: "badge--muted", "Cannot Reproduce": "badge--muted" };

export default function BugReportsTab() {
  const [search, setSearch] = useState("");
  const [severity, setSeverity] = useState("all");
  const [status, setStatus] = useState("all");
  const [selected, setSelected] = useState(null);

  const filtered = useMemo(() => {
    let list = [...bugReports];
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter((b) => b.title.toLowerCase().includes(q) || b.id.toLowerCase().includes(q));
    }
    if (severity !== "all") list = list.filter((b) => b.severity === severity);
    if (status !== "all") list = list.filter((b) => b.status === status);
    return list;
  }, [search, severity, status]);

  return (
    <div>
      <div className="toolbar" style={{ padding: "0 0 14px", border: "none", background: "transparent" }}>
        <div className="search-input">
          <Search size={13} />
          <input placeholder="Search bugs..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <select className="select" value={severity} onChange={(e) => setSeverity(e.target.value)}>
          <option value="all">All Severities</option>
          {SEVERITY_LEVELS.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <select className="select" value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="all">All Statuses</option>
          {BUG_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon="bug" title="No bugs match" text="Adjust your search or filters." />
      ) : (
        <div className="card-grid">
          {filtered.map((b) => (
            <button key={b.id} type="button" className="card qalab__bug-card" onClick={() => setSelected(b)}>
              <div className="tag-row" style={{ marginBottom: 8 }}>
                <span className={`badge ${SEVERITY_BADGE[b.severity]}`}>{b.severity}</span>
                <span className={`badge ${STATUS_BADGE[b.status]}`}>{b.status}</span>
              </div>
              <p className="qalab__bug-id">{b.id}</p>
              <p className="qalab__bug-title">{b.title}</p>
              {b.module && <p className="qalab__bug-module">{b.module}</p>}
            </button>
          ))}
        </div>
      )}

      {selected && (
        <div className="modal-overlay" onClick={() => setSelected(null)}>
          <motion.div className="card qalab__detail-card" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} onClick={(e) => e.stopPropagation()}>
            <button type="button" className="qalab__detail-close" onClick={() => setSelected(null)} aria-label="Close"><X size={16} /></button>
            <h3 className="qalab__detail-title">{selected.id} — {selected.title}</h3>
            <div className="tag-row" style={{ margin: "8px 0 14px" }}>
              <span className={`badge ${SEVERITY_BADGE[selected.severity]}`}>{selected.severity} severity</span>
              {selected.priority && <span className="badge badge--outline">{selected.priority} priority</span>}
              <span className={`badge ${STATUS_BADGE[selected.status]}`}>{selected.status}</span>
            </div>
            {selected.module && <div className="detail-field"><p className="detail-field__label">Module</p><p className="detail-field__value">{selected.module}</p></div>}
            <div className="detail-field"><p className="detail-field__label">Environment</p><p className="detail-field__value">{selected.environment}</p></div>
            {selected.preconditions && <div className="detail-field"><p className="detail-field__label">Preconditions</p><p className="detail-field__value">{selected.preconditions}</p></div>}
            <div className="detail-field">
              <p className="detail-field__label">Steps to Reproduce</p>
              <ol className="list-plain">{selected.stepsToReproduce.map((s, i) => <li key={i}>{s}</li>)}</ol>
            </div>
            <div className="detail-field"><p className="detail-field__label">Expected Result</p><p className="detail-field__value">{selected.expectedResult}</p></div>
            <div className="detail-field"><p className="detail-field__label">Actual Result</p><p className="detail-field__value">{selected.actualResult}</p></div>
            {selected.evidence && <div className="detail-field"><p className="detail-field__label">Evidence</p><p className="detail-field__value">{selected.evidence}</p></div>}
            {selected.assignedTo && <div className="detail-field"><p className="detail-field__label">Assigned To</p><p className="detail-field__value">{selected.assignedTo}</p></div>}
            {selected.retestResult && <div className="detail-field"><p className="detail-field__label">Retest Result</p><p className="detail-field__value">{selected.retestResult}</p></div>}
          </motion.div>
        </div>
      )}
    </div>
  );
}
