// Maps every skill id to a real, official icon — never an invented or
// uploaded image. Priority order: Devicon (languages/frameworks/tools),
// then Simple Icons (brands Devicon doesn't cover), then a clean Lucide
// outline icon for skills with no official logo (soft skills, QA practices).
import {
  ClipboardCheck, ListChecks, Bug, LayoutPanelLeft, Accessibility, Compass, Webhook, Database,
  Terminal, LayoutTemplate, Layers, PenTool, Lightbulb, Palette, Share2, Crown, Users,
  MessagesSquare, Puzzle, Eye, Hourglass, Sparkles, Clock, FileText, Mic, LayoutGrid, Telescope,
  GraduationCap,
} from "lucide-react";

const devicon = (name, variant = "original") => ({
  type: "img",
  src: `https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${name}/${name}-${variant}.svg`,
});
const simpleIcon = (slug) => ({ type: "img", src: `https://cdn.simpleicons.org/${slug}` });
const outline = (Icon) => ({ type: "icon", Icon });

export const TECH_ICONS = {
  // Quality Assurance
  "manual-testing": outline(ClipboardCheck),
  "test-case-writing": outline(ListChecks),
  "bug-reporting": outline(Bug),
  "ui-testing": outline(LayoutPanelLeft),
  "usability-testing": outline(Accessibility),
  "exploratory-testing": outline(Compass),
  "api-testing": outline(Webhook),
  "postman-qa": simpleIcon("postman"),
  swagger: simpleIcon("swagger"),
  jira: simpleIcon("jira"),
  trello: simpleIcon("trello"),
  istqb: outline(GraduationCap),
  "sql-testing": outline(Database),

  // Development
  java: devicon("java"),
  cpp: devicon("cplusplus"),
  csharp: devicon("csharp"),
  python: devicon("python"),
  javascript: devicon("javascript"),
  php: devicon("php"),
  sql: outline(Database),
  html: devicon("html5"),
  css: devicon("css3"),

  // Frameworks & Technologies
  react: devicon("react"),
  vite: simpleIcon("vite"),
  laravel: devicon("laravel"),
  fastapi: devicon("fastapi"),
  "rest-api": outline(Webhook),
  sqlalchemy: outline(Database),
  jwt: simpleIcon("jsonwebtokens"),

  // Databases
  mysql: devicon("mysql"),
  postgresql: devicon("postgresql"),
  neon: simpleIcon("neon"),
  sqlite: devicon("sqlite"),

  // Design
  figma: devicon("figma"),
  canva: simpleIcon("canva"),
  illustrator: simpleIcon("adobeillustrator"),
  wireframing: outline(LayoutTemplate),
  prototyping: outline(Layers),
  "ui-design": outline(PenTool),
  "ux-thinking": outline(Lightbulb),
  "visual-design": outline(Palette),
  "social-design": outline(Share2),

  // Tools
  git: devicon("git"),
  github: devicon("github"),
  "postman-tool": simpleIcon("postman"),
  "swagger-tool": simpleIcon("swagger"),
  "jira-tool": simpleIcon("jira"),
  "trello-tool": simpleIcon("trello"),
  xampp: simpleIcon("xampp"),
  vscode: devicon("vscode"),
  devtools: outline(Terminal),

  // Soft Skills
  leadership: outline(Crown),
  teamwork: outline(Users),
  communication: outline(MessagesSquare),
  "problem-solving": outline(Puzzle),
  "attention-to-detail": outline(Eye),
  patience: outline(Hourglass),
  creativity: outline(Sparkles),
  "time-management": outline(Clock),
  documentation: outline(FileText),
  "public-speaking": outline(Mic),
  organization: outline(LayoutGrid),
  curiosity: outline(Telescope),
};
