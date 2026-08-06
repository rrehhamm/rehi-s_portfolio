import { useState, useMemo, useCallback, useEffect } from "react";
import { projects } from "../../../data/projects";
import { useAchievements } from "../../../context/AchievementContext";
import ProjectToolbar from "./ProjectToolbar";
import ProjectGrid from "./ProjectGrid";
import ProjectDetail from "./ProjectDetail";
import "./projects.css";

const initialEntry = { projectId: null };

// Opens straight to the full project grid — no category sidebar/tabs, just
// the projects, with search/sort/view controls in the toolbar.
export default function ProjectsWindow({ params }) {
  const [history, setHistory] = useState([initialEntry]);
  const [index, setIndex] = useState(0);
  const [view, setView] = useState("icon");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("featured");
  const { trackProjectOpen } = useAchievements();

  const current = history[index];

  // Allow other windows/menus to deep-link straight to a project.
  useEffect(() => {
    if (params?.projectId) {
      navigate({ projectId: params.projectId });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params?.projectId]);

  const navigate = useCallback((entry) => {
    setHistory((h) => {
      const next = h.slice(0, index + 1);
      next.push(entry);
      return next;
    });
    setIndex((i) => i + 1);
  }, [index]);

  const goBack = useCallback(() => setIndex((i) => Math.max(0, i - 1)), []);
  const goForward = useCallback(() => setIndex((i) => Math.min(history.length - 1, i + 1)), [history.length]);
  const goHome = useCallback(() => navigate(initialEntry), [navigate]);

  const openProject = useCallback((projectId) => {
    navigate({ projectId });
    trackProjectOpen(projectId);
  }, [navigate, trackProjectOpen]);

  const filteredProjects = useMemo(() => {
    let list = [...projects];

    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter((p) =>
        p.name.toLowerCase().includes(q) ||
        p.subtitle.toLowerCase().includes(q) ||
        p.technologies.some((t) => t.toLowerCase().includes(q)) ||
        p.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    switch (sortBy) {
      case "name": list.sort((a, b) => a.name.localeCompare(b.name)); break;
      case "category": list.sort((a, b) => a.category.localeCompare(b.category)); break;
      case "newest": list.sort((a, b) => String(b.year).localeCompare(String(a.year))); break;
      case "featured":
      default: list.sort((a, b) => Number(b.featured) - Number(a.featured)); break;
    }
    return list;
  }, [search, sortBy]);

  const activeProject = current.projectId ? projects.find((p) => p.id === current.projectId) : null;

  return (
    <div className="win projects-window">
      <div className="split-view">
        <div className="split-view__main">
          <ProjectToolbar
            canGoBack={index > 0}
            canGoForward={index < history.length - 1}
            onBack={goBack}
            onForward={goForward}
            onHome={goHome}
            view={view}
            onViewChange={setView}
            search={search}
            onSearchChange={setSearch}
            sortBy={sortBy}
            onSortChange={setSortBy}
            breadcrumb={["All Projects", activeProject?.name].filter(Boolean)}
          />
          <div className="projects-window__content scrollable">
            {activeProject ? (
              <ProjectDetail project={activeProject} />
            ) : (
              <ProjectGrid projects={filteredProjects} view={view} onOpen={openProject} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
