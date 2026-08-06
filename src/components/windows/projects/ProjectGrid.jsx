import { MacFolderIcon } from "../../shared/FolderIcon";
import EmptyState from "../../shared/EmptyState";
import { useIsMobile } from "../../../hooks/useMediaQuery";

const STATUS_BADGE = {
  Completed: "badge--green",
  "In Development": "badge--sky",
  Concept: "badge--lavender",
  Ongoing: "badge--yellow",
  "Coming Soon": "badge--muted",
  "In Progress": "badge--yellow",
  "Academic Project": "badge--muted",
};

export default function ProjectGrid({ projects, view, onOpen }) {
  const isMobile = useIsMobile();

  if (projects.length === 0) {
    return <EmptyState icon="search" title="No projects found" text="Try a different search term or category." />;
  }

  const openHandlers = (id) => isMobile
    ? { onClick: () => onOpen(id) }
    : { onDoubleClick: () => onOpen(id), onClick: (e) => e.currentTarget.focus() };

  if (view === "list") {
    return (
      <table className="data-table projects-window__table">
        <thead>
          <tr><th>Name</th><th>Category</th><th>Status</th><th>Year</th></tr>
        </thead>
        <tbody>
          {projects.map((p) => (
            <tr
              key={p.id}
              tabIndex={0}
              {...openHandlers(p.id)}
              onKeyDown={(e) => (e.key === "Enter") && onOpen(p.id)}
            >
              <td>{p.name}{p.featured && <span className="badge badge--outline projects-window__featured-chip">Featured</span>}</td>
              <td>{p.subtitle}</td>
              <td><span className={`badge ${STATUS_BADGE[p.status] || "badge--muted"}`}>{p.status}</span></td>
              <td>{p.year || "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }

  return (
    <div className="projects-window__grid">
      {projects.map((p) => (
        <div
          key={p.id}
          className="project-folder"
          tabIndex={0}
          role="button"
          aria-label={`Open ${p.name}`}
          {...openHandlers(p.id)}
          onKeyDown={(e) => (e.key === "Enter") && onOpen(p.id)}
        >
          {p.featured && <span className="badge badge--outline project-folder__featured">Featured</span>}
          <MacFolderIcon size={46} />
          <p className="project-folder__name">{p.name}</p>
          <p className="project-folder__subtitle">{p.subtitle}</p>
          <span className={`badge ${STATUS_BADGE[p.status] || "badge--muted"} project-folder__status`}>{p.status}</span>
          <div className="tag-row project-folder__tags">
            {p.technologies.slice(0, 3).map((t) => <span key={t} className="tag">{t}</span>)}
          </div>
        </div>
      ))}
    </div>
  );
}
