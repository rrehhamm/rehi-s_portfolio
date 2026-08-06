export default function WindowControls({ onClose, onMinimize, onMaximize, maximized }) {
  return (
    <div className="window-controls" role="group" aria-label="Window controls">
      <button
        type="button"
        className="window-dot window-dot--close"
        aria-label="Close window"
        onClick={onClose}
      >
        <span className="window-dot__glyph">×</span>
      </button>
      <button
        type="button"
        className="window-dot window-dot--minimize"
        aria-label="Minimize window"
        onClick={onMinimize}
      >
        <span className="window-dot__glyph">−</span>
      </button>
      <button
        type="button"
        className="window-dot window-dot--maximize"
        aria-label={maximized ? "Restore window" : "Maximize window"}
        onClick={onMaximize}
      >
        <span className="window-dot__glyph">{maximized ? "⤡" : "+"}</span>
      </button>
    </div>
  );
}
