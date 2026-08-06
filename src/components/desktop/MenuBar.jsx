import { Wifi, Sun, Moon } from "lucide-react";
import { useWindowManager } from "../../context/WindowManagerContext";
import { useTheme } from "../../context/ThemeContext";
import { useToast } from "../../context/ToastContext";
import { useDesktopLayout } from "../../context/DesktopLayoutContext";
import { useClock } from "../../hooks/useClock";
import { socialLinks } from "../../data/social";
import { PORTFOLIO_NAME } from "../../utils/constants";
import logo from "../../assets/images/logo.png";
import MenuBarDropdown from "./MenuBarDropdown";
import "./MenuBar.css";

export default function MenuBar() {
  const { openWindow, closeAll, resetPositions } = useWindowManager();
  const { theme, setTheme } = useTheme();
  const { showToast } = useToast();
  const { welcome, setWidgetVisible, resetWidgetPositions, resetIconPositions } = useDesktopLayout();
  const { time, day, date } = useClock();

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(socialLinks.email);
      showToast("Email Copied", { icon: "copy" });
    } catch {
      showToast("Couldn't copy — email is " + socialLinks.email);
    }
  };

  const copyDiscord = async () => {
    try {
      await navigator.clipboard.writeText(socialLinks.discord);
      showToast("Discord Username Copied", { icon: "copy" });
    } catch {
      showToast("Couldn't copy — Discord is " + socialLinks.discord);
    }
  };

  const fileMenu = [
    { label: "Open Resume", onSelect: () => openWindow("resume") },
    { label: "Open Projects", onSelect: () => openWindow("projects") },
    { label: "Open About", onSelect: () => openWindow("about") },
    { divider: true },
    { label: "Close All Windows", onSelect: () => closeAll() },
  ];

  const viewMenu = [
    { label: "Light Mode", onSelect: () => setTheme("light") },
    { label: "Dark Mode", onSelect: () => setTheme("dark") },
    { divider: true },
    { label: "Reset Window Positions", onSelect: () => resetPositions() },
    { label: "Reset Widget Positions", onSelect: () => resetWidgetPositions() },
    { label: "Reset Icon Positions", onSelect: () => resetIconPositions() },
    { label: "Toggle Welcome Card", onSelect: () => setWidgetVisible("welcome", !welcome.visible) },
  ];

  const exploreMenu = [
    { label: "About Me", onSelect: () => openWindow("about") },
    { label: "Projects", onSelect: () => openWindow("projects") },
    { label: "QA Lab", onSelect: () => openWindow("qalab") },
    { label: "Skills", onSelect: () => openWindow("skills") },
    { label: "Experience", onSelect: () => openWindow("experience") },
    { label: "Gallery", onSelect: () => openWindow("gallery") },
    { label: "Hobbies", onSelect: () => openWindow("hobbies") },
    { divider: true },
    { label: "Secret Folder", onSelect: () => openWindow("secret") },
  ];

  const helpMenu = [
    { label: "Keyboard Shortcuts", onSelect: () => openWindow("shortcuts") },
    { label: "Portfolio Version", onSelect: () => showToast("The World of Rehi — v1.0.0") },
    { label: "About This Portfolio", onSelect: () => openWindow("about-portfolio") },
  ];

  const contactMenu = [
    { label: "Copy Email", onSelect: copyEmail },
    { label: "LinkedIn", onSelect: () => window.open(socialLinks.linkedin, "_blank", "noopener,noreferrer") },
    { label: "GitHub", onSelect: () => window.open(socialLinks.github, "_blank", "noopener,noreferrer") },
    { label: `Copy Discord (${socialLinks.discord})`, onSelect: copyDiscord },
  ];

  return (
    <div className="menubar">
      <div className="menubar__left">
        <img src={logo} alt="" className="menubar__logo" aria-hidden="true" />
        <span className="menubar__brand">{PORTFOLIO_NAME}</span>
        <nav className="menubar__menus" aria-label="Main menu">
          <MenuBarDropdown label="File" items={fileMenu} />
          <MenuBarDropdown label="View" items={viewMenu} />
          <MenuBarDropdown label="Explore" items={exploreMenu} />
          <MenuBarDropdown label="Help" items={helpMenu} />
          <MenuBarDropdown label="Contact" items={contactMenu} />
        </nav>
      </div>
      <div className="menubar__right">
        <Wifi size={14} strokeWidth={2} aria-hidden="true" />
        <button
          type="button"
          className="menubar__theme-toggle"
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          aria-label="Toggle theme"
        >
          {theme === "light" ? <Moon size={13} /> : <Sun size={13} />}
        </button>
        <span className="menubar__clock">{day} {date} · {time}</span>
      </div>
    </div>
  );
}
