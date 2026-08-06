// Skills & Tools — displayed like an Applications folder.
// Levels are honest, descriptive labels only — no invented expert claims.

export const skillCategories = [
  { id: "quality-assurance", label: "Quality Assurance" },
  { id: "development", label: "Development" },
  { id: "frameworks", label: "Frameworks & Technologies" },
  { id: "databases", label: "Databases" },
  { id: "design", label: "Design" },
  { id: "tools", label: "Tools" },
  { id: "soft-skills", label: "Soft Skills" },
];

export const skills = [
  // Quality Assurance
  { id: "manual-testing", name: "Manual Testing", category: "quality-assurance", level: "Practical Experience", usedIn: ["cvision", "waves"], note: "Applied throughout personal QA practice and project testing." },
  { id: "test-case-writing", name: "Test Case Writing", category: "quality-assurance", level: "Practical Experience", usedIn: ["qa-testing-portfolio"], note: "Documented in the QA Lab." },
  { id: "bug-reporting", name: "Bug Reporting", category: "quality-assurance", level: "Practical Experience", usedIn: ["qa-testing-portfolio"], note: "Documented in the QA Lab." },
  { id: "ui-testing", name: "UI Testing", category: "quality-assurance", level: "Practical Experience", usedIn: ["qa-testing-portfolio"], note: "" },
  { id: "usability-testing", name: "Usability Testing", category: "quality-assurance", level: "Used in Projects", usedIn: ["qa-testing-portfolio"], note: "" },
  { id: "exploratory-testing", name: "Exploratory Testing", category: "quality-assurance", level: "Practical Experience", usedIn: ["qa-testing-portfolio"], note: "" },
  { id: "api-testing", name: "API Testing", category: "quality-assurance", level: "Used in Projects", usedIn: ["cvision", "qa-testing-portfolio"], note: "" },
  { id: "postman-qa", name: "Postman", category: "quality-assurance", level: "Used in Projects", usedIn: ["cvision", "waves"], note: "" },
  { id: "swagger", name: "Swagger", category: "quality-assurance", level: "Used in Projects", usedIn: ["cvision"], note: "" },
  { id: "jira", name: "Jira", category: "quality-assurance", level: "Familiar", usedIn: [], note: "" },
  { id: "trello", name: "Trello", category: "quality-assurance", level: "Familiar", usedIn: [], note: "" },
  { id: "istqb", name: "ISTQB CTFL Concepts", category: "quality-assurance", level: "Currently Learning", usedIn: [], note: "Preparing for certification." },
  { id: "sql-testing", name: "Basic SQL Testing", category: "quality-assurance", level: "Basic Knowledge", usedIn: [], note: "" },

  // Development
  { id: "java", name: "Java", category: "development", level: "Academic Experience", usedIn: [], note: "" },
  { id: "cpp", name: "C++", category: "development", level: "Academic Experience", usedIn: [], note: "" },
  { id: "csharp", name: "C#", category: "development", level: "Academic Experience", usedIn: [], note: "" },
  { id: "python", name: "Python", category: "development", level: "Practical Experience", usedIn: ["cvision"], note: "Used for backend development with FastAPI." },
  { id: "javascript", name: "JavaScript", category: "development", level: "Practical Experience", usedIn: ["cvision", "waves"], note: "" },
  { id: "php", name: "PHP", category: "development", level: "Practical Experience", usedIn: ["waves"], note: "Used with Laravel." },
  { id: "sql", name: "SQL", category: "development", level: "Practical Experience", usedIn: ["cvision", "waves"], note: "" },
  { id: "html", name: "HTML", category: "development", level: "Practical Experience", usedIn: ["waves"], note: "" },
  { id: "css", name: "CSS", category: "development", level: "Practical Experience", usedIn: ["waves"], note: "" },

  // Frameworks
  { id: "react", name: "React", category: "frameworks", level: "Practical Experience", usedIn: ["cvision", "waves"], note: "" },
  { id: "vite", name: "Vite", category: "frameworks", level: "Practical Experience", usedIn: ["cvision"], note: "" },
  { id: "laravel", name: "Laravel", category: "frameworks", level: "Practical Experience", usedIn: ["waves"], note: "" },
  { id: "fastapi", name: "FastAPI", category: "frameworks", level: "Practical Experience", usedIn: ["cvision"], note: "" },
  { id: "rest-api", name: "REST APIs", category: "frameworks", level: "Practical Experience", usedIn: ["cvision", "waves"], note: "" },
  { id: "sqlalchemy", name: "SQLAlchemy", category: "frameworks", level: "Used in Projects", usedIn: ["cvision"], note: "" },
  { id: "jwt", name: "JWT", category: "frameworks", level: "Used in Projects", usedIn: ["cvision"], note: "" },

  // Databases
  { id: "mysql", name: "MySQL", category: "databases", level: "Practical Experience", usedIn: ["waves"], note: "" },
  { id: "postgresql", name: "PostgreSQL", category: "databases", level: "Practical Experience", usedIn: ["cvision"], note: "" },
  { id: "neon", name: "Neon", category: "databases", level: "Used in Projects", usedIn: ["cvision"], note: "" },
  { id: "sqlite", name: "SQLite", category: "databases", level: "Academic Experience", usedIn: [], note: "" },

  // Design
  { id: "figma", name: "Figma", category: "design", level: "Practical Experience", usedIn: ["cvision", "behind-the-cover"], note: "" },
  { id: "canva", name: "Canva", category: "design", level: "Practical Experience", usedIn: ["behind-the-cover"], note: "" },
  { id: "illustrator", name: "Adobe Illustrator", category: "design", level: "Practical Experience", usedIn: ["behind-the-cover"], note: "" },
  { id: "wireframing", name: "Wireframing", category: "design", level: "Practical Experience", usedIn: ["behind-the-cover"], note: "" },
  { id: "prototyping", name: "Prototyping", category: "design", level: "Used in Projects", usedIn: [], note: "" },
  { id: "ui-design", name: "UI Design", category: "design", level: "Practical Experience", usedIn: ["cvision", "behind-the-cover"], note: "" },
  { id: "ux-thinking", name: "UX Thinking", category: "design", level: "Currently Improving", usedIn: [], note: "" },
  { id: "visual-design", name: "Visual Design", category: "design", level: "Practical Experience", usedIn: [], note: "" },
  { id: "social-design", name: "Social Media Design", category: "design", level: "Practical Experience", usedIn: [], note: "Developed through student-team design work." },

  // Tools
  { id: "git", name: "Git", category: "tools", level: "Practical Experience", usedIn: ["cvision", "waves"], note: "" },
  { id: "github", name: "GitHub", category: "tools", level: "Practical Experience", usedIn: ["cvision", "waves"], note: "" },
  { id: "postman-tool", name: "Postman", category: "tools", level: "Used in Projects", usedIn: ["cvision", "waves"], note: "" },
  { id: "swagger-tool", name: "Swagger", category: "tools", level: "Used in Projects", usedIn: ["cvision"], note: "" },
  { id: "jira-tool", name: "Jira", category: "tools", level: "Familiar", usedIn: [], note: "" },
  { id: "trello-tool", name: "Trello", category: "tools", level: "Familiar", usedIn: [], note: "" },
  { id: "xampp", name: "XAMPP", category: "tools", level: "Used in Projects", usedIn: ["waves"], note: "" },
  { id: "vscode", name: "VS Code", category: "tools", level: "Practical Experience", usedIn: [], note: "" },
  { id: "devtools", name: "Browser Developer Tools", category: "tools", level: "Practical Experience", usedIn: ["qa-testing-portfolio"], note: "" },

  // Soft Skills
  { id: "leadership", name: "Leadership", category: "soft-skills", level: "Practical Experience", usedIn: ["cvision"], note: "Led the CVision graduation project team." },
  { id: "teamwork", name: "Teamwork", category: "soft-skills", level: "Practical Experience", usedIn: [], note: "" },
  { id: "communication", name: "Communication", category: "soft-skills", level: "Practical Experience", usedIn: [], note: "" },
  { id: "problem-solving", name: "Problem Solving", category: "soft-skills", level: "Practical Experience", usedIn: [], note: "" },
  { id: "attention-to-detail", name: "Attention to Detail", category: "soft-skills", level: "Practical Experience", usedIn: [], note: "" },
  { id: "patience", name: "Patience", category: "soft-skills", level: "Practical Experience", usedIn: [], note: "" },
  { id: "creativity", name: "Creativity", category: "soft-skills", level: "Practical Experience", usedIn: [], note: "" },
  { id: "time-management", name: "Time Management", category: "soft-skills", level: "Practical Experience", usedIn: [], note: "" },
  { id: "documentation", name: "Documentation", category: "soft-skills", level: "Practical Experience", usedIn: ["cvision"], note: "" },
  { id: "public-speaking", name: "Public Speaking", category: "soft-skills", level: "Currently Improving", usedIn: [], note: "Developed through Softians PR role." },
  { id: "organization", name: "Organization", category: "soft-skills", level: "Practical Experience", usedIn: [], note: "" },
  { id: "curiosity", name: "Curiosity", category: "soft-skills", level: "Practical Experience", usedIn: [], note: "" },
];
