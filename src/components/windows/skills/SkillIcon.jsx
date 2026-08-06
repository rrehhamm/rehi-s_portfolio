import { useState } from "react";
import { Code2 } from "lucide-react";
import { TECH_ICONS } from "./techIcons";

// Renders a skill's official logo (Devicon/Simple Icons SVG) or, for skills
// with no brand, a clean Lucide outline icon. If a logo URL ever fails to
// load, this silently swaps to a generic icon instead of showing a broken
// image — so the grid never has an empty or broken placeholder.
export default function SkillIcon({ skillId, size = 26 }) {
  const [failed, setFailed] = useState(false);
  const entry = TECH_ICONS[skillId];

  if (entry?.type === "img" && !failed) {
    return (
      <img
        src={entry.src}
        alt=""
        width={size}
        height={size}
        loading="lazy"
        onError={() => setFailed(true)}
      />
    );
  }

  const Icon = entry?.type === "icon" ? entry.Icon : Code2;
  return <Icon size={size} strokeWidth={1.6} />;
}
