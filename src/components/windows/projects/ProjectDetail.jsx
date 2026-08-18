import { useState, useRef } from "react";
import {
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  FileText,
  Maximize2,
  ArrowLeft,
} from "lucide-react";
import { FaGithub } from "react-icons/fa";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Lightbox from "../../shared/Lightbox";
import EmptyState from "../../shared/EmptyState";

const MAX_BULLETS = 7;
const SWIPE_THRESHOLD = 40;

export default function ProjectDetail({ project }) {
  const [shotIndex, setShotIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [readmeOpen, setReadmeOpen] = useState(false);

  const touchStartX = useRef(null);

  const hasVideo = Boolean(project.demoVideo);

  const screenshots = project.screenshots || [];
  const hasScreenshots = screenshots.length > 0;

  const activeShot = hasScreenshots
    ? screenshots[shotIndex]
    : null;

  const goPrev = () =>
    setShotIndex(
      (i) =>
        (i - 1 + screenshots.length) %
        screenshots.length
    );

  const goNext = () =>
    setShotIndex(
      (i) => (i + 1) % screenshots.length
    );

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    if (
      touchStartX.current === null ||
      screenshots.length <= 1
    ) {
      return;
    }

    const dx =
      e.changedTouches[0].clientX -
      touchStartX.current;

    if (dx > SWIPE_THRESHOLD) {
      goPrev();
    } else if (dx < -SWIPE_THRESHOLD) {
      goNext();
    }

    touchStartX.current = null;
  };

  const features = (project.features || []).slice(
    0,
    MAX_BULLETS
  );

  const responsibilities = (
    project.responsibilities || []
  ).slice(0, MAX_BULLETS);

  const links = project.links || {};

  const hasLinks =
    links.liveDemo ||
    links.github ||
    links.caseStudy ||
    links.readme;

  /*
   * README PAGE
   * Replaces the normal project content instead of opening a modal.
   */
  if (readmeOpen && links.readme) {
    return (
      <div className="project-detail project-readme-page">
        <div className="project-readme-page__toolbar">
          <button
            type="button"
            className="project-readme-page__back"
            onClick={() => setReadmeOpen(false)}
          >
            <ArrowLeft size={14} />
            Back to {project.name}
          </button>
        </div>

        <div className="project-readme-page__header">
          <div className="project-readme-page__file">
            <FileText size={17} />

            <div>
              <h2>README.md</h2>
              <span>{project.name}</span>
            </div>
          </div>
        </div>

        <article className="project-readme-page__content">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {links.readme}
          </ReactMarkdown>
        </article>
      </div>
    );
  }

  return (
    <div className="project-detail">
      <div className="project-detail__header">
        <h2 className="project-detail__name">
          {project.name}
        </h2>

        <div className="project-detail__header-meta">
          {project.role && (
            <div className="detail-field">
              <p className="detail-field__label">
                Role
              </p>

              <p className="detail-field__value">
                {project.role}
              </p>
            </div>
          )}

          {project.type && (
            <div className="detail-field">
              <p className="detail-field__label">
                Type
              </p>

              <p className="detail-field__value">
                {project.type}
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="project-detail__top-grid">
        <div className="card project-detail__card">
          <p
            className="section-title"
            style={{ marginTop: 0 }}
          >
            Overview
          </p>

          <p className="project-detail__overview">
            {project.shortDescription ||
              project.overview}
          </p>
        </div>

        {project.technologies?.length > 0 && (
          <div className="card project-detail__card">
            <p
              className="section-title"
              style={{ marginTop: 0 }}
            >
              Technologies
            </p>

            <div className="tag-row">
              {project.technologies.map((t) => (
                <span key={t} className="tag">
                  {t}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="card project-detail__media">
        <p
          className="section-title"
          style={{ marginTop: 0 }}
        >
          {hasVideo ? "Demo" : "Screenshots"}
        </p>

        {hasVideo ? (
          <video
            className="project-detail__video"
            src={project.demoVideo}
            controls
            preload="metadata"
          />
        ) : hasScreenshots ? (
          <>
            <div
              className="project-detail__media-stage"
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            >
              <img
                src={activeShot.src}
                alt={
                  activeShot.title ||
                  project.name
                }
              />

              {screenshots.length > 1 && (
                <>
                  <button
                    type="button"
                    className="project-detail__media-nav project-detail__media-nav--prev"
                    onClick={goPrev}
                    aria-label="Previous screenshot"
                  >
                    <ChevronLeft size={18} />
                  </button>

                  <button
                    type="button"
                    className="project-detail__media-nav project-detail__media-nav--next"
                    onClick={goNext}
                    aria-label="Next screenshot"
                  >
                    <ChevronRight size={18} />
                  </button>
                </>
              )}

              <button
                type="button"
                className="project-detail__media-fullscreen"
                onClick={() =>
                  setLightboxOpen(true)
                }
                aria-label="Open full screen"
              >
                <Maximize2 size={14} />
              </button>
            </div>

            {screenshots.length > 1 && (
              <div className="project-detail__thumbs">
                {screenshots.map((s, i) => (
                  <button
                    key={s.src || i}
                    type="button"
                    className={`project-detail__thumb ${
                      i === shotIndex
                        ? "project-detail__thumb--active"
                        : ""
                    }`}
                    onClick={() =>
                      setShotIndex(i)
                    }
                    aria-label={`Show screenshot ${
                      i + 1
                    }`}
                  >
                    <img src={s.src} alt="" />
                  </button>
                ))}
              </div>
            )}
          </>
        ) : (
          <EmptyState
            icon="image"
            title="Coming soon"
            text="A demo video or screenshots haven't been added yet."
          />
        )}
      </div>

      <div className="project-detail__bottom-grid">
        {features.length > 0 && (
          <div className="card project-detail__card">
            <p
              className="section-title"
              style={{ marginTop: 0 }}
            >
              Features
            </p>

            <ul className="list-plain">
              {features.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
          </div>
        )}

        {responsibilities.length > 0 && (
          <div className="card project-detail__card">
            <p
              className="section-title"
              style={{ marginTop: 0 }}
            >
              My Responsibilities
            </p>

            <ul className="list-plain">
              {responsibilities.map((r) => (
                <li key={r}>{r}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {hasLinks && (
        <div className="project-detail__actions">
          {links.liveDemo && (
            <a
              className="btn btn--primary"
              href={links.liveDemo}
              target="_blank"
              rel="noopener noreferrer"
            >
              <ExternalLink size={13} />
              View Live Demo
            </a>
          )}

          {links.github && (
            <a
              className="btn"
              href={links.github}
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaGithub size={13} />
              View GitHub
            </a>
          )}

          {links.caseStudy && (
            <a
              className="btn"
              href={links.caseStudy}
              target="_blank"
              rel="noopener noreferrer"
            >
              <FileText size={13} />
              View / Download Documentation
            </a>
          )}

          {links.readme && (
            <button
              type="button"
              className="btn"
              onClick={() =>
                setReadmeOpen(true)
              }
            >
              <FileText size={13} />
              View README
            </button>
          )}
        </div>
      )}

      {lightboxOpen && hasScreenshots && (
        <Lightbox
          items={screenshots}
          index={shotIndex}
          onNavigate={setShotIndex}
          onClose={() =>
            setLightboxOpen(false)
          }
        />
      )}
    </div>
  );
}