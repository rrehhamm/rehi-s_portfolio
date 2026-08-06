import { ExternalLink } from "lucide-react";
import { games } from "../../../data/games";
import "./games.css";

export default function GamesWindow() {
  return (
    <div className="win">
      <div className="win-scroll">
        <p className="win-lead" style={{ marginBottom: 14 }}>Games I play, for whenever a break is due.</p>
        <div className="games-list">
          {games.map((g) => {
            const hasLink = Boolean(g.profileUrl);
            const Row = hasLink ? "a" : "div";
            return (
              <Row
                key={g.id}
                className="game-row"
                href={hasLink ? g.profileUrl : undefined}
                target={hasLink ? "_blank" : undefined}
                rel={hasLink ? "noopener noreferrer" : undefined}
              >
                <img src={g.cover} alt="" className="game-row__cover" />
                <div className="game-row__meta">
                  <p className="game-row__title">{g.title}</p>
                  <p className="game-row__username">{g.platform} · {g.username}</p>
                </div>
                <span className={`game-row__link ${hasLink ? "" : "game-row__link--disabled"}`} title={hasLink ? "Open profile" : "No public profile link yet"}>
                  <ExternalLink size={14} />
                </span>
              </Row>
            );
          })}
        </div>
      </div>
    </div>
  );
}
