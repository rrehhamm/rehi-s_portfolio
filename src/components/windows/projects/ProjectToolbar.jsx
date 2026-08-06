import { ChevronLeft, ChevronRight, Home, Grid2x2, List, Search } from "lucide-react";
import SidebarToggleButton from "../../shared/SidebarToggleButton";

export default function ProjectToolbar({
  canGoBack, canGoForward, onBack, onForward, onHome,
  view, onViewChange, search, onSearchChange, sortBy, onSortChange, breadcrumb,
  sidebar,
}) {
  return (
    <div>
      <div className="toolbar">
        {sidebar && (
          <SidebarToggleButton
            collapsed={sidebar.collapsed}
            isMobile={sidebar.isMobile}
            onToggle={sidebar.toggle}
            onOpenMobile={sidebar.openMobile}
            label="category sidebar"
          />
        )}
        <button type="button" className="toolbar__btn" onClick={onBack} disabled={!canGoBack} aria-label="Back">
          <ChevronLeft size={15} />
        </button>
        <button type="button" className="toolbar__btn" onClick={onForward} disabled={!canGoForward} aria-label="Forward">
          <ChevronRight size={15} />
        </button>
        <button type="button" className="toolbar__btn" onClick={onHome} aria-label="Home">
          <Home size={14} />
        </button>

        <div className="search-input">
          <Search size={13} />
          <input
            type="search"
            placeholder="Search projects..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            aria-label="Search projects"
          />
        </div>

        <select className="select" value={sortBy} onChange={(e) => onSortChange(e.target.value)} aria-label="Sort by">
          <option value="featured">Sort: Featured</option>
          <option value="newest">Sort: Newest</option>
          <option value="name">Sort: Name</option>
          <option value="category">Sort: Category</option>
        </select>

        <div style={{ flex: 1 }} />

        <button
          type="button"
          className={`toolbar__btn ${view === "icon" ? "toolbar__btn--active" : ""}`}
          onClick={() => onViewChange("icon")}
          aria-label="Icon view"
          aria-pressed={view === "icon"}
        >
          <Grid2x2 size={14} />
        </button>
        <button
          type="button"
          className={`toolbar__btn ${view === "list" ? "toolbar__btn--active" : ""}`}
          onClick={() => onViewChange("list")}
          aria-label="List view"
          aria-pressed={view === "list"}
        >
          <List size={14} />
        </button>
      </div>
      <div className="projects-window__breadcrumb">
        {breadcrumb.map((b, i) => (
          <span key={i}>
            {i > 0 && <span className="projects-window__crumb-sep">›</span>}
            {b}
          </span>
        ))}
      </div>
    </div>
  );
}
