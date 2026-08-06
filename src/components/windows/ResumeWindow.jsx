import { useEffect, useRef, useState } from "react";
import { Download, ExternalLink, ZoomIn, ZoomOut, FileText } from "lucide-react";
import * as pdfjsLib from "pdfjs-dist";
import pdfWorkerUrl from "pdfjs-dist/build/pdf.worker.min.js?url";
import EmptyState from "../shared/EmptyState";
import "./ResumeWindow.css";

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorkerUrl;

// Graceful fallback: if no PDF exists in this folder, the glob is simply empty
// instead of breaking the build. Drop the real file at src/assets/resume/*.pdf.
const resumeModules = import.meta.glob("/src/assets/resume/*.pdf", { eager: true, query: "?url", import: "default" });
const resumeEntry = Object.entries(resumeModules)[0];
const resumeUrl = resumeEntry ? resumeEntry[1] : null;
const resumeFileName = resumeEntry ? resumeEntry[0].split("/").pop() : "Reham-Alhasabeen-CV.pdf";

export default function ResumeWindow() {
  const canvasRef = useRef(null);
  const [pdfDoc, setPdfDoc] = useState(null);
  const [pageNum, setPageNum] = useState(1);
  const [numPages, setNumPages] = useState(0);
  const [scale, setScale] = useState(1.1);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!resumeUrl) return;
    let cancelled = false;
    pdfjsLib.getDocument(resumeUrl).promise
      .then((doc) => {
        if (cancelled) return;
        setPdfDoc(doc);
        setNumPages(doc.numPages);
      })
      .catch(() => setError(true));
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (!pdfDoc || !canvasRef.current) return;
    let cancelled = false;
    pdfDoc.getPage(pageNum).then((page) => {
      if (cancelled) return;
      const viewport = page.getViewport({ scale });
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      page.render({ canvasContext: ctx, viewport });
    });
    return () => { cancelled = true; };
  }, [pdfDoc, pageNum, scale]);

  if (!resumeUrl || error) {
    return (
      <div className="win">
        <div className="win-scroll" style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}>
          <EmptyState
            icon="file-text"
            title="Resume coming soon"
            text={`Please add src/assets/resume/${resumeFileName} to display it here.`}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="win resume-window">
      <div className="toolbar">
        <a className="toolbar__btn" href={resumeUrl} download={resumeFileName} aria-label="Download resume">
          <Download size={14} />
        </a>
        <a className="toolbar__btn" href={resumeUrl} target="_blank" rel="noopener noreferrer" aria-label="Open in new tab">
          <ExternalLink size={14} />
        </a>
        <button type="button" className="toolbar__btn" onClick={() => setScale((s) => Math.max(0.6, +(s - 0.15).toFixed(2)))} aria-label="Zoom out">
          <ZoomOut size={14} />
        </button>
        <button type="button" className="toolbar__btn" onClick={() => setScale((s) => Math.min(2.2, +(s + 0.15).toFixed(2)))} aria-label="Zoom in">
          <ZoomIn size={14} />
        </button>
        <span className="resume-window__zoom">{Math.round(scale * 100)}%</span>
        <div style={{ flex: 1 }} />
        <div className="resume-window__pager">
          <button type="button" className="toolbar__btn" disabled={pageNum <= 1} onClick={() => setPageNum((p) => p - 1)} aria-label="Previous page">‹</button>
          <span className="resume-window__page-indicator">Page {pageNum} of {numPages || "…"}</span>
          <button type="button" className="toolbar__btn" disabled={pageNum >= numPages} onClick={() => setPageNum((p) => p + 1)} aria-label="Next page">›</button>
        </div>
      </div>
      <div className="resume-window__stage scrollable">
        {!pdfDoc ? (
          <div className="resume-window__loading"><FileText size={26} strokeWidth={1.3} /><span>Loading resume…</span></div>
        ) : (
          <canvas ref={canvasRef} className="resume-window__canvas" />
        )}
      </div>
    </div>
  );
}
