// Metadata for every window the OS can open. Kept separate from the React
// components (see App.jsx componentMap) so the reducer can stay framework-light.

export const WINDOW_REGISTRY = {
  about: { title: "About_Reham.txt", icon: "user", defaultSize: { width: 760, height: 640 }, minSize: { width: 420, height: 420 } },
  projects: { title: "Projects_Explorer", icon: "folder", defaultSize: { width: 940, height: 640 }, minSize: { width: 560, height: 420 } },
  qalab: { title: "QA_Lab.app", icon: "flask-conical", defaultSize: { width: 940, height: 660 }, minSize: { width: 580, height: 440 } },
  skills: { title: "Applications", icon: "wrench", defaultSize: { width: 820, height: 600 }, minSize: { width: 480, height: 420 } },
  experience: { title: "Experience_Log", icon: "briefcase", defaultSize: { width: 800, height: 620 }, minSize: { width: 460, height: 420 } },
  gallery: { title: "Gallery.app", icon: "image", defaultSize: { width: 900, height: 640 }, minSize: { width: 520, height: 420 } },
  hobbies: { title: "Life.exe", icon: "heart", defaultSize: { width: 760, height: 600 }, minSize: { width: 440, height: 420 } },
  contact: { title: "Mail.app", icon: "mail", defaultSize: { width: 820, height: 620 }, minSize: { width: 460, height: 440 } },
  resume: { title: "My Resume.pdf", icon: "file-text", defaultSize: { width: 700, height: 700 }, minSize: { width: 420, height: 480 } },
  secret: { title: "Do Not Open", icon: "lock", defaultSize: { width: 460, height: 420 }, minSize: { width: 340, height: 340 } },
  settings: { title: "Settings", icon: "settings", defaultSize: { width: 480, height: 460 }, minSize: { width: 360, height: 380 } },
  shortcuts: { title: "Keyboard Shortcuts", icon: "keyboard", defaultSize: { width: 440, height: 460 }, minSize: { width: 340, height: 360 } },
  "about-portfolio": { title: "About This Portfolio", icon: "info", defaultSize: { width: 460, height: 440 }, minSize: { width: 340, height: 340 } },
  games: { title: "My Games", icon: "gamepad", defaultSize: { width: 560, height: 520 }, minSize: { width: 380, height: 360 } },
  photography: { title: "My Photography Gallery", icon: "camera", defaultSize: { width: 880, height: 620 }, minSize: { width: 480, height: 400 } },
  letterboxd: { title: "My Letterboxd", icon: "clapperboard", defaultSize: { width: 500, height: 600 }, minSize: { width: 360, height: 420 } },
  books: { title: "My Bookshelf", icon: "book", defaultSize: { width: 480, height: 560 }, minSize: { width: 340, height: 380 } },
};

export const WINDOW_IDS = Object.keys(WINDOW_REGISTRY);
