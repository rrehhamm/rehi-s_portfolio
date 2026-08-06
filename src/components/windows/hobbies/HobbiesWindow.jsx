import { hobbyCards, aboutMeFacts } from "../../../data/hobbies";
import { useWindowManager } from "../../../context/WindowManagerContext";
import "./hobbies.css";

export default function HobbiesWindow() {
  const { openWindow } = useWindowManager();

  return (
    <div className="win">
      <div className="win-scroll">
        <p className="win-lead">A small scrapbook of things outside of code and testing.</p>

        <div className="hobbies-window__grid">
          {hobbyCards.map((h) => {
            const hasLink = Boolean(h.externalUrl);
            const interactive = Boolean(h.openWindow) || hasLink;
            const Wrapper = hasLink ? "a" : interactive ? "button" : "div";
            return (
              <Wrapper
                key={h.id}
                type={!hasLink && interactive ? "button" : undefined}
                href={hasLink ? h.externalUrl : undefined}
                target={hasLink ? "_blank" : undefined}
                rel={hasLink ? "noopener noreferrer" : undefined}
                className={`card hobby-card ${h.variant === "night" ? "hobby-card--night" : ""} ${interactive ? "hobby-card--interactive" : ""} ${h.minimal ? "hobby-card--minimal" : ""}`}
                onClick={!hasLink && h.openWindow ? () => openWindow(h.openWindow) : undefined}
              >
                {h.sticker && (
                  <span className={`hobby-card__sticker ${h.boxed ? "hobby-card__sticker--boxed" : ""}`}>
                    <img src={h.sticker} alt="" loading="lazy" />
                  </span>
                )}
                {h.stickerGroup && (
                  <span className="hobby-card__sticker hobby-card__sticker--group">
                    {h.stickerGroup.map((src, i) => (
                      <img key={i} src={src} alt="" loading="lazy" style={{ zIndex: h.stickerGroup.length - i }} />
                    ))}
                  </span>
                )}
                <p className="hobby-card__title">{h.title}</p>
                {!h.minimal && <p className="hobby-card__text">{h.content}</p>}
                {h.minimal && <p className="hobby-card__minimal-content">{h.content}</p>}
              </Wrapper>
            );
          })}

          <div className="card hobby-card hobby-card--about">
            <p className="hobby-card__title">Something About Me</p>
            <ul className="hobby-card__facts">
              {aboutMeFacts.map((f) => <li key={f}>{f}</li>)}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
