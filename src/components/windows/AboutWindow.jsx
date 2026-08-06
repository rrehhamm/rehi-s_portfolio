import { Coffee, Heart, Sparkles, Workflow, MapPin, GraduationCap } from "lucide-react";
import { aboutContent, personalInfo, quickFacts, timeline } from "../../data/about";
import "./AboutWindow.css";

const FACT_ICONS = { coffee: Coffee, heart: Heart, sparkles: Sparkles, workflow: Workflow };

export default function AboutWindow() {
  return (
    <div className="win about-window">
      <div className="win-scroll">
        <h2 className="about-window__heading">{aboutContent.heading}</h2>
        <div className="about-window__body">
          {aboutContent.paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>

        <p className="section-title">Currently Expanding My Knowledge In</p>
        <div className="tag-row">
          {aboutContent.currentlyExpanding.map((t) => (
            <span key={t} className="tag">{t}</span>
          ))}
        </div>

        <p className="section-title">Personal Information</p>
        <div className="card about-window__info-card">
          {Object.entries(personalInfo).map(([label, value]) => (
            <div key={label} className="about-window__info-row">
              <span className="about-window__info-label">
                {label === "Location" && <MapPin size={13} />}
                {label === "University" && <GraduationCap size={13} />}
                {label}
              </span>
              <span className="about-window__info-value">{value}</span>
            </div>
          ))}
        </div>

        <p className="section-title">Quick Facts</p>
        <div className="card-grid">
          {quickFacts.map((fact) => {
            const Icon = FACT_ICONS[fact.icon] || Sparkles;
            return (
              <div key={fact.label} className="card about-window__fact">
                <Icon size={16} strokeWidth={1.6} />
                <div>
                  <p className="about-window__fact-label">{fact.label}</p>
                  <p className="about-window__fact-value">{fact.value}</p>
                </div>
              </div>
            );
          })}
        </div>

        <p className="section-title">Software Engineering Journey</p>
        <ol className="about-window__timeline">
          {timeline.map((step) => (
            <li key={step}>
              <span className="about-window__timeline-dot" />
              <span>{step}</span>
            </li>
          ))}
        </ol>

        <blockquote className="quote-block">"{aboutContent.quote}"</blockquote>
      </div>
    </div>
  );
}
