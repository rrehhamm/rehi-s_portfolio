import { useState, useCallback } from "react";
import { useWindowManager } from "../../context/WindowManagerContext";
import { useAchievements } from "../../context/AchievementContext";
import { useDesktopLayout } from "../../context/DesktopLayoutContext";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import { useIsMobile } from "../../hooks/useMediaQuery";
import { DESKTOP_ICONS } from "../../utils/constants";
import DesktopIcon from "./DesktopIcon";
import FirstVisitTooltip from "./FirstVisitTooltip";
import SpotifyWidget from "./SpotifyWidget";
import WelcomeCard from "./WelcomeCard";
import wallpaper from "../../assets/images/desktop-wallpaper.png";
import "./Desktop.css";

export default function Desktop() {
  const { openWindow } = useWindowManager();
  const { trackFolderOpen } = useAchievements();
  const { iconPositions, previewOverlapIds } = useDesktopLayout();
  const isMobile = useIsMobile();
  const [selectedId, setSelectedId] = useState(null);
  const [hasOpenedFolder, setHasOpenedFolder] = useLocalStorage("rehi-opened-first-folder", false);

  const handleOpen = useCallback((icon) => {
    setHasOpenedFolder(true);
    trackFolderOpen(icon.id);
    openWindow(icon.id);
  }, [openWindow, trackFolderOpen, setHasOpenedFolder]);

  return (
    <div className="desktop" onPointerDown={(e) => { if (e.target === e.currentTarget) setSelectedId(null); }}>
      <div className="desktop__wallpaper" style={{ backgroundImage: `url(${wallpaper})` }} role="img" aria-label="Reham's Minecraft-themed desktop wallpaper at sunset" />
      <div className="desktop__ambient" aria-hidden="true">
        {Array.from({ length: 14 }).map((_, i) => (
          <span key={i} className={`desktop__particle desktop__particle--${i % 5}`} style={{ left: `${(i * 137) % 100}%`, animationDelay: `${(i * 1.7) % 12}s` }} />
        ))}
      </div>

      <div className="desktop__icon-layer">
        {DESKTOP_ICONS.map((icon) => {
          const pos = iconPositions[icon.id];
          return (
            <DesktopIcon
              key={icon.id}
              icon={icon}
              selected={selectedId === icon.id}
              onSelect={() => setSelectedId(icon.id)}
              onOpen={() => handleOpen(icon)}
              position={isMobile ? null : pos}
              displaced={previewOverlapIds.includes(icon.id)}
            />
          );
        })}
      </div>

      <FirstVisitTooltip visible={!hasOpenedFolder} />
      <WelcomeCard />
      <SpotifyWidget />
    </div>
  );
}
