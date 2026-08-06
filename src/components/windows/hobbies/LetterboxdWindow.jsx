import { ExternalLink, Clapperboard } from "lucide-react";
import { letterboxdProfile } from "../../../data/letterboxd";
import letterboxdMark from "../../../assets/images/hobbies/letterboxd.png";
import EmptyState from "../../shared/EmptyState";
import "./letterboxd.css";

export default function LetterboxdWindow() {
  const p = letterboxdProfile;

  return (
    <div className="win">
      <div className="win-scroll">
        <div className="letterboxd-window__profile">
          <span className="letterboxd-window__avatar">
            {p.avatar ? <img src={p.avatar} alt="" /> : <img src={letterboxdMark} alt="" className="letterboxd-window__avatar-mark" />}
          </span>
          <p className="letterboxd-window__username">{p.username || "Add your Letterboxd username"}</p>
          <p className="letterboxd-window__bio">{p.bio}</p>
          <a className="btn btn--primary" href={p.profileUrl} target="_blank" rel="noopener noreferrer">
            View My Letterboxd Profile <ExternalLink size={13} />
          </a>
        </div>

        <p className="section-title">Favorite Films</p>
        {p.favoriteFilms.length === 0 ? (
          <EmptyState icon="clapperboard" title="No favorites listed yet" text="Add favorite films to letterboxd.js." />
        ) : (
          <div className="letterboxd-window__films">
            {p.favoriteFilms.map((f) => (
              <div key={f.id || f.title} className="letterboxd-window__film">
                <span className="letterboxd-window__film-poster">
                  {f.poster ? <img src={f.poster} alt="" loading="lazy" /> : <Clapperboard size={20} strokeWidth={1.4} />}
                </span>
                <p className="letterboxd-window__film-title">{f.title}{f.year ? ` (${f.year})` : ""}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
