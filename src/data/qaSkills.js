// QA Lab content. Add your own real overview, skills, checklists, and
// session data below — this file is intentionally empty until then.

export const qaOverview = {
  heading: "Quality Assurance is where curiosity becomes improvement.",
  paragraphs: [
    "I enjoy exploring software carefully, testing different scenarios, and identifying details that may affect functionality or user experience.",
    "I naturally evaluate software from two perspectives: as an everyday user who expects the product to feel simple, clear, and reliable, and as a developer who understands the logic and systems behind the interface.",
    "I have the patience to continue exploring a system until I discover what may need correction, clarification, or improvement.",
  ],
  interests: [
    "Manual testing", "UI testing", "Usability testing", "Exploratory testing",
    "Test-case design", "Bug reporting", "API testing",
    "Software-quality principles", "ISTQB CTFL preparation",
  ],
};

// Honest, non-percentage experience labels only — kept as reusable options.
export const EXPERIENCE_LABELS = [
  "Practical Experience", "Educational Experience", "Self-Learning Experience",
  "Familiar", "Currently Learning", "Currently Improving", "Used in Projects",
  "Basic Knowledge", "Studied — Exam Pending",
];

export const qaSkillCards = [
  { name: "Manual Testing", label: "Practical Experience" },
  { name: "Test Case Design", label: "Practical Experience" },
  { name: "UI Testing", label: "Practical Experience" },
  { name: "Usability Testing", label: "Used in Projects" },
  { name: "Exploratory Testing", label: "Practical Experience" },
  { name: "Bug Reporting", label: "Practical Experience" },
  { name: "API Testing with Postman", label: "Used in Projects" },
  { name: "Swagger", label: "Used in Projects" },
  { name: "Jira", label: "Familiar" },
  { name: "Trello", label: "Familiar" },
  { name: "Basic SQL Testing", label: "Basic Knowledge" },
  { name: "Browser Developer Tools", label: "Practical Experience" },
  { name: "ISTQB CTFL Concepts", label: "Studied — Exam Pending" },
];

export const uiTestingChecklist = [];

export const uiRecommendations = [];

export const usabilityAreas = [];

export const usabilityObservations = [];

export const exploratorySession = {
  sessionId: "",
  charter: "",
  scope: "",
  duration: "",
  environment: "",
  tester: "",
  areasExplored: [],
  risks: [],
  observations: [],
  bugsFound: [],
  questions: [],
  followUpActions: [],
};

export const istqbJourney = {
  status: "Finished studying — preparing to take the ISTQB CTFL exam and get certified.",
  topics: [
    { name: "Software testing fundamentals", state: "Done" },
    { name: "Testing principles", state: "Done" },
    { name: "Test process", state: "Done" },
    { name: "Static testing", state: "Done" },
    { name: "Test techniques", state: "Done" },
    { name: "Test management", state: "Done" },
    { name: "Tool support", state: "Done" },
    { name: "Practice questions", state: "Done" },
    { name: "ISTQB CTFL Exam", state: "Upcoming" },
    { name: "Certification", state: "Upcoming" },
  ],
};
