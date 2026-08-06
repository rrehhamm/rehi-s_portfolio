import { createContext, useContext, useCallback, useEffect } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { useToast } from "./ToastContext";
import { useWindowManager } from "./WindowManagerContext";
import { achievementDefs } from "../data/achievements";
import { projects } from "../data/projects";

const AchievementContext = createContext(null);

const PROJECT_IDS = projects.map((p) => p.id);
const ALL_FOLDER_IDS = ["about", "projects", "qalab", "skills", "experience", "gallery", "hobbies", "contact"];
const WATCHED_IDS = [...ALL_FOLDER_IDS, "secret"];

export function AchievementProvider({ children }) {
  const [unlocked, setUnlocked] = useLocalStorage("rehi-achievements", []);
  const [openedFolders, setOpenedFolders] = useLocalStorage("rehi-opened-folders", []);
  const [openedProjects, setOpenedProjects] = useLocalStorage("rehi-opened-projects", []);
  const { showToast } = useToast();
  const { windows } = useWindowManager();

  const unlock = useCallback((id) => {
    setUnlocked((prev) => {
      if (prev.includes(id)) return prev;
      const def = achievementDefs.find((a) => a.id === id);
      if (def) showToast(`Achievement Unlocked: ${def.title}`, { type: "achievement" });
      return [...prev, id];
    });
  }, [setUnlocked, showToast]);

  const trackFolderOpen = useCallback((folderId) => {
    setOpenedFolders((prev) => {
      const next = prev.includes(folderId) ? prev : [...prev, folderId];
      return next;
    });

    if (folderId === "qalab") unlock("qa-detective");
    if (folderId === "hobbies") unlock("coffee-lover");
    if (folderId === "secret") unlock("curious-mind");
  }, [setOpenedFolders, unlock]);

  const trackProjectOpen = useCallback((projectId) => {
    setOpenedProjects((prev) => (prev.includes(projectId) ? prev : [...prev, projectId]));
  }, [setOpenedProjects]);

  const resetAchievements = useCallback(() => {
    setUnlocked([]);
    setOpenedFolders([]);
    setOpenedProjects([]);
  }, [setUnlocked, setOpenedFolders, setOpenedProjects]);

  // Any window (opened via desktop icon, Dock, or menu bar) counts toward folder
  // achievements — tracked centrally here instead of at each call site.
  useEffect(() => {
    WATCHED_IDS.forEach((id) => {
      if (windows[id]?.isOpen) trackFolderOpen(id);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [windows]);

  // Derived unlocks that depend on accumulated state — checked after commits, not during render.
  useEffect(() => {
    if (openedFolders.length >= 1) unlock("explorer");
    if (ALL_FOLDER_IDS.every((id) => openedFolders.includes(id))) unlock("world-explorer");
  }, [openedFolders, unlock]);

  useEffect(() => {
    if (PROJECT_IDS.length > 0 && PROJECT_IDS.every((id) => openedProjects.includes(id))) unlock("project-hunter");
  }, [openedProjects, unlock]);

  return (
    <AchievementContext.Provider
      value={{ unlocked, achievements: achievementDefs, trackFolderOpen, trackProjectOpen, resetAchievements }}
    >
      {children}
    </AchievementContext.Provider>
  );
}

export function useAchievements() {
  const ctx = useContext(AchievementContext);
  if (!ctx) throw new Error("useAchievements must be used within AchievementProvider");
  return ctx;
}
