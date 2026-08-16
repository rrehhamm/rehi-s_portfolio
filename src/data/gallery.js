// Design Gallery data. `image: null` renders the missing-image fallback —
// drop real files into src/assets/images/gallery/ and reference them here.

import frankOcean from "../assets/images/gallery/graphic-design/frank-ocean.png";
import frankOceanBlonde from "../assets/images/gallery/graphic-design/frank-ocean-blonde.png";

export const galleryCategories = [
  { id: "ui-ux", label: "UI/UX" },
  { id: "graphic-design", label: "Graphic Design" },
  { id: "social-media", label: "Social Media" },
  { id: "personal", label: "Personal" },
];

export const galleryItems = [
  {
    id: "frank-ocean",
    title: "Frank Ocean",
    category: "graphic-design",
    tool: "Canva",
    year: 2026,
    image: frankOcean,
  },
  {
    id: "frank-ocean-blonde",
    title: "White Ferrari",
    category: "graphic-design",
    tool: "Canva",
    year: 2026,
    image: frankOceanBlonde,
  },
];