import { useState } from "react";
import { Grid2x2, Rows3 } from "lucide-react";
import { photographyItems } from "../../../data/photography";
import Lightbox from "../../shared/Lightbox";
import EmptyState from "../../shared/EmptyState";
import "./photography.css";

export default function PhotographyWindow() {
  const [layout, setLayout] = useState("masonry");
  const [lightboxIndex, setLightboxIndex] = useState(null);

  const lightboxItems = photographyItems.map((p) => ({
    src: p.image,
    title: p.title,
    caption: p.date ? p.date : undefined,
  }));

  return (
    <div className="win photography-window">
      <div className="toolbar">
        <p className="win-lead" style={{ margin: 0, flex: 1 }}>Personal photography — a separate space from the Design Gallery.</p>
        <button type="button" className={`toolbar__btn ${layout === "grid" ? "toolbar__btn--active" : ""}`} onClick={() => setLayout("grid")} aria-label="Grid layout">
          <Grid2x2 size={14} />
        </button>
        <button type="button" className={`toolbar__btn ${layout === "masonry" ? "toolbar__btn--active" : ""}`} onClick={() => setLayout("masonry")} aria-label="Masonry layout">
          <Rows3 size={14} />
        </button>
      </div>

      <div className="photography-window__scroll scrollable">
        {photographyItems.length === 0 ? (
          <EmptyState
            icon="camera"
            title="No photos yet"
            text="Add real captures to src/data/photography.js — the shape is documented right in the file."
          />
        ) : (
          <div className={layout === "masonry" ? "photo-masonry" : "photo-grid"}>
            {photographyItems.map((p, i) => (
              <button key={p.id} type="button" className="photo-card" onClick={() => setLightboxIndex(i)}>
                {p.image ? <img src={p.image} alt={p.title} loading="lazy" /> : <span className="photo-card__fallback">No image</span>}
                <span className="photo-card__meta">
                  <span className="photo-card__title">{p.title}</span>
                  {p.date && <span className="photo-card__date">{p.date}</span>}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      {lightboxIndex !== null && (
        <Lightbox items={lightboxItems} index={lightboxIndex} onNavigate={setLightboxIndex} onClose={() => setLightboxIndex(null)} />
      )}
    </div>
  );
}
