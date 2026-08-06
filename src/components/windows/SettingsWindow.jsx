import { useTheme } from "../../context/ThemeContext";
import { useWindowManager } from "../../context/WindowManagerContext";
import { useAchievements } from "../../context/AchievementContext";
import { useToast } from "../../context/ToastContext";
import { useDesktopLayout } from "../../context/DesktopLayoutContext";
import "./SettingsWindow.css";

export default function SettingsWindow() {
  const { theme, setTheme, reduceMotion, setReduceMotion, dockMode, setDockMode } = useTheme();
  const { resetPositions, closeAll } = useWindowManager();
  const { resetAchievements } = useAchievements();
  const { showToast } = useToast();
  const { spotify, setWidgetVisible, resetWidgetPositions, resetIconPositions } = useDesktopLayout();

  const handleResetDesktop = () => {
    closeAll();
    resetPositions();
    resetIconPositions();
    showToast("Desktop reset");
  };

  return (
    <div className="win">
      <div className="win-scroll">
        <p className="section-title" style={{ marginTop: 0 }}>Appearance</p>
        <div className="card settings-window__row">
          <span>Theme</span>
          <div className="settings-window__toggle-group">
            <button type="button" className={`btn btn--sm ${theme === "light" ? "btn--primary" : ""}`} onClick={() => setTheme("light")}>Light</button>
            <button type="button" className={`btn btn--sm ${theme === "dark" ? "btn--primary" : ""}`} onClick={() => setTheme("dark")}>Dark</button>
          </div>
        </div>
        <div className="card settings-window__row">
          <span>Reduce Motion</span>
          <label className="settings-window__switch">
            <input type="checkbox" checked={reduceMotion} onChange={(e) => setReduceMotion(e.target.checked)} />
            <span className="settings-window__switch-track"><span className="settings-window__switch-thumb" /></span>
          </label>
        </div>

        <p className="section-title">Desktop</p>
        <div className="card settings-window__row">
          <span>Dock</span>
          <div className="settings-window__toggle-group">
            <button type="button" className={`btn btn--sm ${dockMode === null ? "btn--primary" : ""}`} onClick={() => setDockMode(null)} title="Stays visible normally; auto-hides itself only while a maximized or very tall window is open">
              Smart
            </button>
            <button type="button" className={`btn btn--sm ${dockMode === "always" ? "btn--primary" : ""}`} onClick={() => setDockMode("always")}>
              Always Visible
            </button>
            <button type="button" className={`btn btn--sm ${dockMode === "auto" ? "btn--primary" : ""}`} onClick={() => setDockMode("auto")}>
              Auto Hide
            </button>
          </div>
        </div>
        <div className="card settings-window__row">
          <span>Show Spotify Widget</span>
          <label className="settings-window__switch">
            <input type="checkbox" checked={spotify.visible} onChange={(e) => setWidgetVisible("spotify", e.target.checked)} />
            <span className="settings-window__switch-track"><span className="settings-window__switch-thumb" /></span>
          </label>
        </div>
        <div className="card settings-window__row">
          <span>Reset Desktop</span>
          <button type="button" className="btn btn--sm" onClick={handleResetDesktop}>Reset</button>
        </div>
        <div className="card settings-window__row">
          <span>Reset Window Positions</span>
          <button type="button" className="btn btn--sm" onClick={() => { resetPositions(); showToast("Window positions reset"); }}>Reset</button>
        </div>
        <div className="card settings-window__row">
          <span>Reset Widget Positions</span>
          <button type="button" className="btn btn--sm" onClick={() => { resetWidgetPositions(); showToast("Widget positions reset"); }}>Reset</button>
        </div>
        <div className="card settings-window__row">
          <span>Reset Desktop Icon Positions</span>
          <button type="button" className="btn btn--sm" onClick={() => { resetIconPositions(); showToast("Desktop icon positions reset to the compact default layout"); }}>Reset</button>
        </div>
        <div className="card settings-window__row">
          <span>Clear Achievements</span>
          <button type="button" className="btn btn--sm" onClick={() => { resetAchievements(); showToast("Achievements cleared"); }}>Clear</button>
        </div>
      </div>
    </div>
  );
}
