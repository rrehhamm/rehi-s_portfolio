import { useState } from "react";
import { List, GitBranch } from "lucide-react";
import { experience } from "../../../data/experience";
import { events } from "../../../data/events";
import "./experience.css";

export default function ExperienceWindow() {
  const [section, setSection] = useState("experience");
  const [view, setView] = useState("timeline");

  return (
    <div className="win">
      <div className="tabs">
        <button type="button" className={`tab ${section === "experience" ? "tab--active" : ""}`} onClick={() => setSection("experience")}>Experience</button>
        <button type="button" className={`tab ${section === "events" ? "tab--active" : ""}`} onClick={() => setSection("events")}>Events</button>
      </div>

      <div className="win-scroll">
        {section === "experience" && (
          <>
            <div className="toolbar" style={{ padding: "0 0 16px", border: "none", background: "transparent" }}>
              <button type="button" className={`toolbar__btn ${view === "timeline" ? "toolbar__btn--active" : ""}`} onClick={() => setView("timeline")} aria-label="Timeline view">
                <GitBranch size={14} />
              </button>
              <button type="button" className={`toolbar__btn ${view === "card" ? "toolbar__btn--active" : ""}`} onClick={() => setView("card")} aria-label="Card view">
                <List size={14} />
              </button>
              <span style={{ fontSize: 11.5, color: "var(--text-muted)", fontFamily: "var(--font-secondary)" }}>
                {view === "timeline" ? "Timeline View" : "Card View"}
              </span>
            </div>

            {view === "timeline" ? (
              <ol className="exp-timeline">
                {experience.map((e) => (
                  <li key={e.id} className="exp-timeline__item">
                    <span className="exp-timeline__dot" />
                    <div className="exp-timeline__content">
                      <p className="exp-timeline__org">{e.organization}</p>
                      <p className="exp-timeline__role">{e.role} · {e.duration}</p>
                      {e.description && <p className="exp-timeline__desc">{e.description}</p>}
                      <div className="tag-row" style={{ marginTop: 8 }}>
                        {e.skills.map((s) => <span key={s} className="tag">{s}</span>)}
                      </div>
                    </div>
                  </li>
                ))}
              </ol>
            ) : (
              <div className="exp-card-grid">
                {experience.map((e) => (
                  <div key={e.id} className="card exp-card">
                    <p className="exp-card__org">{e.organization}</p>
                    <p className="exp-card__role">{e.role}</p>
                    <span className="badge badge--outline exp-card__duration">{e.duration}</span>
                    {e.description && <p className="exp-card__desc">{e.description}</p>}
                    {e.responsibilities.length > 0 && (
                      <ul className="list-plain exp-card__resp">
                        {e.responsibilities.slice(0, 4).map((r) => <li key={r}>{r}</li>)}
                      </ul>
                    )}
                    <div className="tag-row" style={{ marginTop: 8 }}>
                      {e.skills.map((s) => <span key={s} className="tag">{s}</span>)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {section === "events" && (
          <div className="exp-card-grid">
            {events.map((ev) => (
              <div key={ev.id} className="card exp-card">
                <p className="exp-card__org">{ev.name}</p>
                <p className="exp-card__role">{ev.role}{ev.date ? ` · ${ev.date}` : ""}</p>
                <p className="exp-card__desc">{ev.description}</p>
                <div className="tag-row" style={{ marginTop: 8 }}>
                  {ev.skills.map((s) => <span key={s} className="tag">{s}</span>)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
