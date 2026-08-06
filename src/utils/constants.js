export const PORTFOLIO_NAME = "THE WORLD OF REHI";
export const PORTFOLIO_TAGLINE = "Designing • Testing • Building";

export const DESKTOP_ICONS = [
  { id: "about", label: "About Reham", kind: "folder" },
  { id: "projects", label: "My Projects", kind: "folder" },
  { id: "qalab", label: "QA Lab", kind: "folder" },
  { id: "skills", label: "Skills & Tools", kind: "folder" },
  { id: "experience", label: "Experience", kind: "folder" },
  { id: "gallery", label: "Design Gallery", kind: "folder" },
  { id: "hobbies", label: "Hobbies", kind: "folder" },
  { id: "contact", label: "Contact Me", kind: "folder" },
  { id: "resume", label: "My Resume.pdf", kind: "file" },
  { id: "secret", label: "Do Not Open", kind: "locked" },
];

// The out-of-the-box desktop icon arrangement a first-time visitor sees
// (desktop viewport only — mobile always flows icons in DESKTOP_ICONS order).
// `col` is measured outward from that side's own screen edge (0 = the
// column closest to the edge), `row` counts grid rows down from the top.
// This is only ever a starting default: the moment a visitor drags an icon,
// their own layout is saved to their browser and takes over from here (see
// DesktopLayoutContext) — this arrangement never overrides a real visitor's
// own customization.
export const DEFAULT_ICON_LAYOUT = {
  about: { side: "left", col: 0, row: 0 },
  projects: { side: "left", col: 1, row: 0 },
  qalab: { side: "left", col: 2, row: 0 },
  experience: { side: "left", col: 0, row: 3 },
  secret: { side: "left", col: 1, row: 3 },
  skills: { side: "left", col: 2, row: 3 },
  resume: { side: "right", col: 2, row: 3 },
  gallery: { side: "right", col: 0, row: 4 },
  hobbies: { side: "right", col: 1, row: 4 },
  contact: { side: "right", col: 2, row: 4 },
};

export const DOCK_ITEMS = [
  { id: "welcome", label: "Home", icon: "home" },
  { id: "about", label: "About", icon: "user" },
  { id: "projects", label: "Projects", icon: "folder" },
  { id: "qalab", label: "QA Lab", icon: "flask-conical" },
  { id: "skills", label: "Skills", icon: "wrench" },
  { id: "experience", label: "Experience", icon: "briefcase" },
  { id: "gallery", label: "Gallery", icon: "image" },
  { id: "hobbies", label: "Hobbies", icon: "heart" },
  { id: "resume", label: "Resume", icon: "file-text" },
  { id: "contact", label: "Contact", icon: "mail" },
];

export const LOADING_MESSAGES = [
  "Initializing Rehi's world...",
  "Loading projects...",
  "Preparing QA Lab...",
  "Brewing an iced americano...",
  "Almost Ready...",
  "Welcome ♡",
];

export const KEYBOARD_SHORTCUTS = [
  { keys: "Double Click", action: "Open folder" },
  { keys: "Esc", action: "Close active window" },
  { keys: "Ctrl + M", action: "Minimize" },
  { keys: "Ctrl + Shift + M", action: "Maximize" },
  { keys: "Ctrl + D", action: "Toggle Theme" },
  { keys: "Ctrl + H", action: "Open About" },
  { keys: "Ctrl + P", action: "Open Projects" },
];

export const PORTFOLIO_VERSION = "1.0.0";
