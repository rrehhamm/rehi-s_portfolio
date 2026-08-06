import { Lock, FileText } from "lucide-react";

// A small original take on the classic macOS blue folder — not a copy of
// Apple's asset, just inspired by its silhouette and coloring.
export function MacFolderIcon({ locked, size = 52 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <path
        d="M6 20c0-2.2 1.8-4 4-4h13l4 5h27c2.2 0 4 1.8 4 4v25c0 2.2-1.8 4-4 4H10c-2.2 0-4-1.8-4-4V20z"
        fill="url(#folderBody)"
      />
      <path
        d="M6 20c0-2.2 1.8-4 4-4h13l4 5H6v-1z"
        fill="url(#folderTab)"
      />
      <defs>
        <linearGradient id="folderBody" x1="6" y1="16" x2="58" y2="54" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#8fc3ee" />
          <stop offset="1" stopColor="#5e9fd6" />
        </linearGradient>
        <linearGradient id="folderTab" x1="6" y1="16" x2="27" y2="24" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#a6d2f2" />
          <stop offset="1" stopColor="#7ab4e6" />
        </linearGradient>
      </defs>
      {locked && (
        <g transform="translate(24, 24)">
          <rect x="0" y="8" width="16" height="13" rx="3" fill="#fdf9f4" />
          <path d="M3 8V5.5a5 5 0 0 1 10 0V8" stroke="#fdf9f4" strokeWidth="2.4" fill="none" />
        </g>
      )}
    </svg>
  );
}

export function FileIcon({ size = 52 }) {
  return (
    <div className="file-icon" style={{ width: size, height: size }} aria-hidden="true">
      <FileText size={size * 0.62} strokeWidth={1.4} />
    </div>
  );
}

export function LockIcon({ size = 18 }) {
  return <Lock size={size} strokeWidth={2} />;
}
