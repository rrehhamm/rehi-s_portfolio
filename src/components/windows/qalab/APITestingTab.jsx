import { useState, useMemo } from "react";
import { Search } from "lucide-react";
import { apiEndpoints } from "../../../data/apiEndpoints";
import EmptyState from "../../shared/EmptyState";

const METHOD_BADGE = { GET: "badge--sky", POST: "badge--green", PATCH: "badge--yellow", PUT: "badge--yellow", DELETE: "badge--red" };

export default function APITestingTab() {
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState(apiEndpoints[0]?.id || null);

  const filtered = useMemo(() => {
    if (!search.trim()) return apiEndpoints;
    const q = search.trim().toLowerCase();
    return apiEndpoints.filter(
      (ep) => ep.name.toLowerCase().includes(q) || ep.endpoint.toLowerCase().includes(q) || ep.module.toLowerCase().includes(q)
    );
  }, [search]);

  const grouped = useMemo(() => {
    const groups = [];
    const byModule = new Map();
    for (const ep of filtered) {
      if (!byModule.has(ep.module)) {
        const group = { module: ep.module, items: [] };
        byModule.set(ep.module, group);
        groups.push(group);
      }
      byModule.get(ep.module).items.push(ep);
    }
    return groups;
  }, [filtered]);

  const selected = apiEndpoints.find((ep) => ep.id === selectedId) || filtered[0] || null;

  if (apiEndpoints.length === 0) {
    return <EmptyState icon="workflow" title="No API endpoints yet" text="Add endpoints to apiEndpoints.js." />;
  }

  return (
    <div>
      <p className="win-lead">Real API routes documented from my Postman collections (Task Manager API and Waves E-Commerce API) — reference documentation, not live requests.</p>

      <div className="search-input" style={{ margin: "10px 0 14px", maxWidth: 320 }}>
        <Search size={13} />
        <input placeholder="Search endpoints..." value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      <div className="qalab__api-layout">
        <div className="qalab__api-list">
          {grouped.length === 0 ? (
            <EmptyState icon="search" title="No endpoints match" text="Try a different search term." />
          ) : (
            grouped.map((g) => (
              <div key={g.module}>
                <p className="qalab__api-group-title">{g.module}</p>
                {g.items.map((ep) => (
                  <button
                    key={ep.id}
                    type="button"
                    className={`qalab__api-row ${selected?.id === ep.id ? "qalab__api-row--active" : ""}`}
                    onClick={() => setSelectedId(ep.id)}
                  >
                    <span className={`badge ${METHOD_BADGE[ep.method] || "badge--muted"}`}>{ep.method}</span>
                    <span className="qalab__api-endpoint">{ep.name}</span>
                  </button>
                ))}
              </div>
            ))
          )}
        </div>

        {selected && (
          <div className="card qalab__api-detail">
            <div className="tag-row" style={{ marginBottom: 6 }}>
              <span className={`badge ${METHOD_BADGE[selected.method] || "badge--muted"}`}>{selected.method}</span>
              <span className="badge badge--outline">{selected.module}</span>
            </div>
            <code className="qalab__api-endpoint-code" style={{ display: "block", marginBottom: 10 }}>{selected.endpoint}</code>
            <p style={{ fontFamily: "var(--font-secondary)", fontWeight: 700, fontSize: 13, marginBottom: 10 }}>{selected.name}</p>

            {selected.description && (
              <div className="detail-field"><p className="detail-field__label">Notes</p><p className="detail-field__value">{selected.description}</p></div>
            )}

            {selected.requestHeaders && (
              <div className="detail-field">
                <p className="detail-field__label">Request Headers</p>
                <pre className="qalab__code-block">{JSON.stringify(selected.requestHeaders, null, 2)}</pre>
              </div>
            )}

            {selected.requestBody && (
              <div className="detail-field">
                <p className="detail-field__label">Request Body</p>
                <pre className="qalab__code-block">{JSON.stringify(selected.requestBody, null, 2)}</pre>
              </div>
            )}

            {!selected.requestHeaders && !selected.requestBody && (
              <p className="detail-field__value" style={{ color: "var(--text-muted)" }}>No request body — this endpoint doesn't require one.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
