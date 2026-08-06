import { PORTFOLIO_NAME, PORTFOLIO_VERSION } from "../../utils/constants";

export default function AboutPortfolioWindow() {
  return (
    <div className="win">
      <div className="win-scroll">
        <h2 className="win-title" style={{ fontSize: 20 }}>{PORTFOLIO_NAME}</h2>
        <p className="win-lead" style={{ marginTop: 8, marginBottom: 16 }}>
          A desktop-inspired portfolio built to feel like exploring Reham's own computer rather than browsing a
          website — folders, windows, and a dock, all built from scratch.
        </p>
        <div className="detail-field"><p className="detail-field__label">Version</p><p className="detail-field__value">{PORTFOLIO_VERSION}</p></div>
        <div className="detail-field"><p className="detail-field__label">Built With</p><p className="detail-field__value">React, Vite, Framer Motion, Lucide Icons</p></div>
        <div className="detail-field"><p className="detail-field__label">Design</p><p className="detail-field__value">Warm, cozy, minimal — inspired by macOS, made original.</p></div>
      </div>
    </div>
  );
}
