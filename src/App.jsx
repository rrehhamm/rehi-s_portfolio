import { useState, useEffect, useCallback } from "react";
import { ThemeProvider, useTheme } from "./context/ThemeContext";
import { ToastProvider } from "./context/ToastContext";
import { WindowManagerProvider, useWindowManager } from "./context/WindowManagerContext";
import { AchievementProvider } from "./context/AchievementContext";
import { DesktopLayoutProvider } from "./context/DesktopLayoutContext";
import { DockProvider } from "./context/DockContext";
import { WINDOW_IDS } from "./utils/windowRegistry";

import SplashScreen from "./components/desktop/SplashScreen";
import MenuBar from "./components/desktop/MenuBar";
import Dock from "./components/desktop/Dock";
import Desktop from "./components/desktop/Desktop";
import StatusBar from "./components/desktop/StatusBar";
import Window from "./components/window/Window";
import ToastContainer from "./components/window/ToastContainer";

import AboutWindow from "./components/windows/AboutWindow";
import ProjectsWindow from "./components/windows/projects/ProjectsWindow";
import QALabWindow from "./components/windows/qalab/QALabWindow";
import SkillsWindow from "./components/windows/skills/SkillsWindow";
import ExperienceWindow from "./components/windows/experience/ExperienceWindow";
import GalleryWindow from "./components/windows/gallery/GalleryWindow";
import HobbiesWindow from "./components/windows/hobbies/HobbiesWindow";
import ContactWindow from "./components/windows/contact/ContactWindow";
import ResumeWindow from "./components/windows/ResumeWindow";
import SecretWindow from "./components/windows/SecretWindow";
import SettingsWindow from "./components/windows/SettingsWindow";
import ShortcutsWindow from "./components/windows/ShortcutsWindow";
import AboutPortfolioWindow from "./components/windows/AboutPortfolioWindow";
import GamesWindow from "./components/windows/hobbies/GamesWindow";
import PhotographyWindow from "./components/windows/hobbies/PhotographyWindow";
import LetterboxdWindow from "./components/windows/hobbies/LetterboxdWindow";
import BooksWindow from "./components/windows/hobbies/BooksWindow";

const CONTENT_MAP = {
  about: AboutWindow,
  projects: ProjectsWindow,
  qalab: QALabWindow,
  skills: SkillsWindow,
  experience: ExperienceWindow,
  gallery: GalleryWindow,
  hobbies: HobbiesWindow,
  contact: ContactWindow,
  resume: ResumeWindow,
  secret: SecretWindow,
  settings: SettingsWindow,
  games: GamesWindow,
  photography: PhotographyWindow,
  letterboxd: LetterboxdWindow,
  books: BooksWindow,
  shortcuts: ShortcutsWindow,
  "about-portfolio": AboutPortfolioWindow,
};

function WindowsLayer() {
  const { windows } = useWindowManager();
  return (
    <>
      {WINDOW_IDS.map((id) => {
        const Content = CONTENT_MAP[id];
        if (!Content || !windows[id]?.isOpen) return null;
        return (
          <Window key={id} id={id}>
            <Content params={windows[id].params} />
          </Window>
        );
      })}
    </>
  );
}

function GlobalShortcuts() {
  const { activeId, openWindow, minimizeWindow, toggleMaximize } = useWindowManager();
  const { toggleTheme } = useTheme();

  useEffect(() => {
    const onKeyDown = (e) => {
      const mod = e.ctrlKey || e.metaKey;
      if (!mod) return;
      const key = e.key.toLowerCase();

      if (key === "m" && e.shiftKey) {
        e.preventDefault();
        if (activeId) toggleMaximize(activeId);
      } else if (key === "m") {
        e.preventDefault();
        if (activeId) minimizeWindow(activeId);
      } else if (key === "d") {
        e.preventDefault();
        toggleTheme();
      } else if (key === "h") {
        e.preventDefault();
        openWindow("about");
      } else if (key === "p") {
        e.preventDefault();
        openWindow("projects");
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [activeId, openWindow, minimizeWindow, toggleMaximize, toggleTheme]);

  return null;
}

function DesktopOS() {
  return (
    <DesktopLayoutProvider>
      <DockProvider>
        <div className="desktop-os">
          <MenuBar />
          <Desktop />
          <WindowsLayer />
          <Dock />
          <StatusBar />
          <ToastContainer />
          <GlobalShortcuts />
        </div>
      </DockProvider>
    </DesktopLayoutProvider>
  );
}

export default function App() {
  const [showSplash, setShowSplash] = useState(() => {
    try {
      return sessionStorage.getItem("rehi-visited") !== "true";
    } catch {
      return true;
    }
  });

  const finishSplash = useCallback(() => {
    try {
      sessionStorage.setItem("rehi-visited", "true");
    } catch {
      /* storage unavailable */
    }
    setShowSplash(false);
  }, []);

  return (
    <ThemeProvider>
      <ToastProvider>
        <WindowManagerProvider>
          <AchievementProvider>
            {showSplash && <SplashScreen onFinish={finishSplash} />}
            {!showSplash && <DesktopOS />}
          </AchievementProvider>
        </WindowManagerProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}
