import { useState, useMemo } from "react";
import { skills, skillCategories } from "../../../data/skills";
import SkillIcon from "./SkillIcon";
import "./skills.css";

// A clean, minimal "Applications folder" grid — each card shows only the
// skill's official logo (or a clean outline icon when no logo exists) and
// its name. No categories, levels, notes, or detail popups on the cards.
export default function SkillsWindow() {
  const [activeCategory, setActiveCategory] = useState(skillCategories[0].id);

  const visibleSkills = useMemo(
    () => skills.filter((s) => s.category === activeCategory),
    [activeCategory]
  );

  return (
    <div className="win skills-window">
      <div className="tabs">
        {skillCategories.map((c) => (
          <button key={c.id} type="button" className={`tab ${activeCategory === c.id ? "tab--active" : ""}`} onClick={() => setActiveCategory(c.id)}>
            {c.label}
          </button>
        ))}
      </div>

      <div className="win-scroll">
        <div className="skills-window__grid">
          {visibleSkills.map((skill) => (
            <div key={skill.id} className="skill-app">
              <span className="skill-app__icon"><SkillIcon skillId={skill.id} size={26} /></span>
              <span className="skill-app__name">{skill.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
