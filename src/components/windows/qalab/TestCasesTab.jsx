import { useState, useMemo } from "react";
import { Search, X } from "lucide-react";
import { motion } from "framer-motion";
import { testCases, TEST_CASE_FILTERS } from "../../../data/testCases";
import EmptyState from "../../shared/EmptyState";

const STATUS_BADGE = { Passed: "badge--green", Failed: "badge--red", Blocked: "badge--yellow", "Not Run": "badge--muted" };

export default function TestCasesTab() {
  const [search, setSearch] = useState("");
  const [activeFilters, setActiveFilters] = useState([]);
  const [selected, setSelected] = useState(null);

  const toggleFilter = (f) => setActiveFilters((prev) => prev.includes(f) ? prev.filter((x) => x !== f) : [...prev, f]);

  const filtered = useMemo(() => {
    let list = [...testCases];
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter((t) => t.title.toLowerCase().includes(q) || t.id.toLowerCase().includes(q) || t.module.toLowerCase().includes(q));
    }
    if (activeFilters.length > 0) {
      list = list.filter((t) => activeFilters.every((f) => t.type === f || t.status === f));
    }
    return list;
  }, [search, activeFilters]);

  return (
    <div>
      <div className="toolbar" style={{ padding: "0 0 14px", border: "none", background: "transparent" }}>
        <div className="search-input">
          <Search size={13} />
          <input placeholder="Search test cases..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <div className="tag-row">
          {TEST_CASE_FILTERS.map((f) => (
            <button
              key={f}
              type="button"
              className={`badge ${activeFilters.includes(f) ? "badge--sky" : "badge--outline"}`}
              style={{ border: "none", cursor: "pointer" }}
              onClick={() => toggleFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon="search" title="No test cases match" text="Adjust your search or filters." />
      ) : (
        <table className="data-table">
          <thead>
            <tr><th>ID</th><th>Title</th><th>Module</th><th>Type</th><th>Priority</th><th>Status</th><th>Updated</th></tr>
          </thead>
          <tbody>
            {filtered.map((tc) => (
              <tr key={tc.id} tabIndex={0} onClick={() => setSelected(tc)} onKeyDown={(e) => e.key === "Enter" && setSelected(tc)}>
                <td>{tc.id}</td>
                <td>{tc.title}</td>
                <td>{tc.module}</td>
                <td>{tc.type}</td>
                <td>{tc.priority}</td>
                <td>{tc.status && <span className={`badge ${STATUS_BADGE[tc.status] || "badge--muted"}`}>{tc.status}</span>}</td>
                <td>{tc.lastUpdated}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {selected && (
        <div className="modal-overlay" onClick={() => setSelected(null)}>
          <motion.div
            className="card qalab__detail-card"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={(e) => e.stopPropagation()}
          >
            <button type="button" className="qalab__detail-close" onClick={() => setSelected(null)} aria-label="Close"><X size={16} /></button>
            <h3 className="qalab__detail-title">{selected.id} — {selected.title}</h3>
            <div className="tag-row" style={{ margin: "8px 0 14px" }}>
              {selected.status && <span className={`badge ${STATUS_BADGE[selected.status] || "badge--muted"}`}>{selected.status}</span>}
              {selected.type && <span className="badge badge--outline">{selected.type}</span>}
              {selected.priority && <span className="badge badge--muted">{selected.priority} priority</span>}
            </div>

            <div className="detail-field"><p className="detail-field__label">Objective</p><p className="detail-field__value">{selected.objective}</p></div>
            {selected.module && <div className="detail-field"><p className="detail-field__label">Module</p><p className="detail-field__value">{selected.module}</p></div>}
            {selected.preconditions && <div className="detail-field"><p className="detail-field__label">Preconditions</p><p className="detail-field__value">{selected.preconditions}</p></div>}
            <div className="detail-field">
              <p className="detail-field__label">Test Steps</p>
              <ol className="list-plain">{selected.testSteps.map((s, i) => <li key={i}>{s}</li>)}</ol>
            </div>
            {Object.keys(selected.testData).length > 0 && (
              <div className="detail-field">
                <p className="detail-field__label">Test Data</p>
                {Object.entries(selected.testData).map(([k, v]) => (
                  <p key={k} className="detail-field__value">{k}: {v}</p>
                ))}
              </div>
            )}
            <div className="detail-field"><p className="detail-field__label">Expected Result</p><p className="detail-field__value">{selected.expectedResult}</p></div>
            {selected.actualResult && <div className="detail-field"><p className="detail-field__label">Actual Result</p><p className="detail-field__value">{selected.actualResult}</p></div>}
            {selected.environment && <div className="detail-field"><p className="detail-field__label">Environment</p><p className="detail-field__value">{selected.environment}</p></div>}
            {selected.notes && <div className="detail-field"><p className="detail-field__label">Notes</p><p className="detail-field__value">{selected.notes}</p></div>}
          </motion.div>
        </div>
      )}
    </div>
  );
}
