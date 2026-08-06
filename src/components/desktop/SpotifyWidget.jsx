import { useRef, useState } from "react";
import { Music2, GripHorizontal } from "lucide-react";
import { useDesktopLayout } from "../../context/DesktopLayoutContext";
import { useDraggableWidget } from "../../hooks/useDraggableWidget";
import { useReportWidgetSize } from "../../hooks/useReportWidgetSize";
import { useIsMobile } from "../../hooks/useMediaQuery";
import "./SpotifyWidget.css";

// Uses the existing dynamic image endpoint from
// spotify-recently-played-readme.vercel.app — the returned image is
// third-party generated content and is not redesigned or recreated here.
const spotifyProfileUrl = "https://open.spotify.com/user/312hzfon43bmcwaif6lbiwspwz3y";
const recentlyPlayedUrl = "https://spotify-recently-played-readme.vercel.app/api?user=312hzfon43bmcwaif6lbiwspwz3y&count=3";

export default function SpotifyWidget() {
  const { spotify } = useDesktopLayout();
  const { dragHandleProps, dragging, position } = useDraggableWidget("spotify", spotify);
  const isMobile = useIsMobile();
  const [failed, setFailed] = useState(false);
  const widgetRef = useRef(null);
  useReportWidgetSize("spotify", widgetRef);

  if (!spotify.visible) return null;

  const style = isMobile ? undefined : { left: position.x, top: position.y };

  return (
    <div
      ref={widgetRef}
      className={`spotify-widget ${dragging ? "spotify-widget--dragging" : ""}`}
      style={style}
    >
      {!isMobile && (
        <div className="spotify-widget__handle" {...dragHandleProps} aria-hidden="true">
          <GripHorizontal size={13} />
        </div>
      )}
      <a
        href={spotifyProfileUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="spotify-widget__link"
        aria-label="Open Reham's Spotify profile"
      >
        <span className="spotify-widget__label">Recently Played</span>
        {!failed ? (
          <img
            src={recentlyPlayedUrl}
            alt="Reham's recently played tracks on Spotify"
            loading="lazy"
            onError={() => setFailed(true)}
          />
        ) : (
          <span className="spotify-widget__fallback">
            <Music2 size={16} strokeWidth={1.6} />
            Recently played tracks are unavailable right now — view profile
          </span>
        )}
      </a>
    </div>
  );
}
