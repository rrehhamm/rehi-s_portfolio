// All project data. No invented links, metrics, or dates.
// Use `null` or empty string for links that don't exist yet.

import cvisionDemoVideo from "../assets/videos/cvision-demo.mp4";
import utadoDemoVideo from "../assets/videos/utado-demo.mp4";

import cvisionDocumentation from "../assets/documents/CVision-Documentation.pdf";
import utadoReadme from "../assets/documents/utado-readme.md?raw";

export const PROJECT_CATEGORIES = [
  { id: "all", label: "All Projects" },
  { id: "featured", label: "Featured" },
  { id: "software-development", label: "Software Development" },
  { id: "quality-assurance", label: "Quality Assurance" },
  { id: "ui-ux-design", label: "UI/UX Design" },
  { id: "university", label: "University Projects" },
  { id: "archived", label: "Archived Ideas" },
];

export const projects = [
  {
    id: "cvision",
    name: "CVision",
    subtitle: "Software Tool for Smart Team Role Assignment",
    category: "software-development",
    tags: ["Graduation Project", "AI-Powered", "Full-Stack"],
    type: "Graduation Project",
    status: "Completed",
    year: "2026",
    role: "Team Leader and Software Developer",
    featured: true,

    shortDescription:
      "CVision is an AI-powered software tool that helps project managers build stronger teams by analyzing team members' resumes, identifying their skills and experience, and recommending the most suitable project roles.",

    overview:
      "CVision was created to improve the team-role assignment process. Project managers can create a project, define required roles and skills, and invite team members using a project code. Team members can join the project and upload their resumes. The system analyzes the resumes, extracts skills and experience, compares the results with project requirements, recommends suitable roles, and identifies missing skills. The project manager can review the recommendations and manually adjust assignments when necessary. The system also helps identify the team's strengths and weaknesses, detect skill gaps, and support role assignment in a more accurate and professional way.",

    features: [
      "User registration and login",
      "Email verification",
      "Project creation",
      "Team-code generation",
      "Team joining",
      "CV upload",
      "PDF and DOCX validation",
      "AI-powered resume analysis",
      "Technical skill extraction",
      "Soft skill extraction",
      "Tools and technology extraction",
      "Years-of-experience extraction",
      "Skill scoring",
      "Automatic role recommendations",
      "Manual role override",
      "Skill-gap detection",
      "Team-skill overview",
      "Project dashboard",
      "Project archive and restore",
      "Authentication and authorization",
      "API documentation",
    ],

    technologies: [
      "React",
      "Vite",
      "JavaScript",
      "FastAPI",
      "Python",
      "SQLAlchemy",
      "PostgreSQL",
      "Neon",
      "Gemini API",
      "JWT",
      "REST API",
      "Postman",
      "Swagger",
      "Figma",
      "GitHub",
    ],

    responsibilities: [
      "Led a multidisciplinary project team",
      "Helped define the product idea and system requirements",
      "Worked on backend development",
      "Designed and maintained database structures",
      "Developed and tested REST APIs",
      "Used Postman and Swagger for API testing",
      "Integrated AI-powered resume analysis",
      "Worked with Neon PostgreSQL",
      "Contributed to UI design in Figma",
      "Contributed to React implementation",
      "Prepared technical documentation",
      "Helped resolve integration and logic issues",
      "Coordinated tasks across team members",
    ],

    links: {
      github: null,
      liveDemo: null,
      caseStudy: cvisionDocumentation,
      readme: null,
    },

    screenshots: [],
    demoVideo: cvisionDemoVideo,
  },

  {
    id: "waves",
    name: "Waves E-Commerce",
    subtitle: "Full-Stack Multilingual Shopping Platform",
    category: "software-development",
    tags: ["Full-Stack", "E-Commerce"],
    type: "Personal / Team Project",
    status: "In Development",
    year: "2025",
    role: "Backend Developer and UI Contributor",
    featured: true,

    shortDescription:
      "Waves is a full-stack e-commerce platform that allows users to browse products, explore categories and brands, manage carts and wishlists, complete orders, and interact with a dynamic administrative system.",

    overview:
      "Waves is a full-stack e-commerce platform that allows users to browse products, explore categories and brands, manage carts and wishlists, complete orders, and interact with a dynamic administrative system.",

    features: [
      "User authentication",
      "Product browsing",
      "Categories",
      "Brands",
      "Product search",
      "Product details",
      "Shopping cart",
      "Wishlist",
      "Checkout",
      "Order placement",
      "Order history",
      "Order details",
      "User profile",
      "Arabic and English interface support",
      "Admin dashboard",
      "Dynamic customer statistics",
      "Product management",
      "Category management",
      "Brand management",
      "Banner management",
      "Featured category management",
      "Featured brand management",
      "Discount management",
      "Order management",
      "Dynamic home-page content",
      "Archive and data-management workflows",
    ],

    technologies: [
      "Laravel",
      "PHP",
      "MySQL",
      "React",
      "JavaScript",
      "REST API",
      "Postman",
      "Git",
      "GitHub",
      "XAMPP",
      "Figma",
    ],

    responsibilities: [
      "Worked on backend development",
      "Developed and updated API controllers",
      "Worked with routes and database logic",
      "Tested endpoints using Postman",
      "Contributed to frontend and UI improvements",
      "Helped connect frontend and backend features",
      "Fixed dynamic-content and routing issues",
      "Improved multilingual support",
      "Managed project code using GitHub",
    ],

    links: {
      github: null,
      liveDemo: null,
      caseStudy: null,
      readme: null,
    },

    screenshots: [],
    demoVideo: null,
  },

  {
    id: "utado",
    name: "Utado",
    subtitle: "A Letterboxd-Inspired Social Platform for Music Lovers",
    category: "software-development",
    tags: ["Full-Stack", "Social Platform"],
    type: "Personal Project",
    status: "Completed",
    year: "",
    role: "Full-Stack Developer",
    featured: true,

    shortDescription:
      "Utado is a Letterboxd-inspired social platform for music lovers — log every song you listen to, rate it, review it, and see what the people around you are hearing.",

    overview:
      "Utado lets users log, rate, and review songs, follow other listeners, browse a social feed of what people are hearing, curate custom song lists, and track personal listening stats and badges. The build covers a 5-phase MVP roadmap — core data & auth, ratings/reviews/diary, follow graph/likes/comments/feed, lists & discovery, and stats & badges — plus a full marketing landing page. A follow-up hardening pass added rate limiting, security headers, Redis caching, pagination, an automated test suite (Vitest + Playwright) with CI, and a real music catalog imported from MusicBrainz and Spotify.",

    features: [
      "Log, rate (half-star), and review every song you listen to",
      "Follow other users, like and comment on logs, and browse a personalized feed",
      "Create and curate custom song lists",
      "Discover page with Top Rated and Trending songs",
      "Profile stats and computed badges (Regular, Critic, Influencer, etc.)",
      "Real music catalog imported from MusicBrainz and Spotify, with cover art and deep links",
      "Full marketing landing page built from the brand identity and moodboard",
    ],

    technologies: [
      "Next.js",
      "TypeScript",
      "Tailwind CSS",
      "Node.js",
      "Express",
      "PostgreSQL",
      "Redis",
      "Zod",
      "Docker",
      "JWT",
      "Vitest",
      "Playwright",
      "GitHub Actions",
    ],

    responsibilities: [
      "Designed and built the full-stack architecture (Next.js frontend, Express backend, shared TypeScript/Zod package)",
      "Implemented authentication, ratings/reviews, the social follow graph, feed, lists, and discovery across a 5-phase roadmap",
      "Wrote automated backend and frontend test suites (Vitest, Playwright) and set up CI",
      "Hardened the app post-launch: rate limiting, security headers, caching, pagination, and real Spotify/MusicBrainz catalog imports",
      "Deployed the full stack with Docker Compose for production",
    ],

    links: {
      github: null,
      liveDemo: null,
      caseStudy: null,
      readme: utadoReadme,
    },

    screenshots: [],
    demoVideo: utadoDemoVideo,
  },
];

export const getProjectById = (id) =>
  projects.find((project) => project.id === id);