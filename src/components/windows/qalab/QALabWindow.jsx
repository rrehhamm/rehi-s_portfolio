import { useState, useEffect } from "react";
import OverviewTab from "./OverviewTab";
import TestCasesTab from "./TestCasesTab";
import BugReportsTab from "./BugReportsTab";
import UITestingTab from "./UITestingTab";
import UsabilityTestingTab from "./UsabilityTestingTab";
import APITestingTab from "./APITestingTab";
import ExploratoryTestingTab from "./ExploratoryTestingTab";
import ISTQBTab from "./ISTQBTab";
import "./qalab.css";

const TABS = [
  { id: "overview", label: "Overview" },
  { id: "testcases", label: "Test Cases" },
  { id: "bugs", label: "Bug Reports" },
  { id: "ui", label: "UI Testing" },
  { id: "usability", label: "Usability Testing" },
  { id: "api", label: "API Testing" },
  { id: "exploratory", label: "Exploratory Testing" },
  { id: "istqb", label: "ISTQB Journey" },
];

export default function QALabWindow({ params }) {
  const [tab, setTab] = useState("overview");

  useEffect(() => {
    if (params?.tab && TABS.some((t) => t.id === params.tab)) setTab(params.tab);
  }, [params?.tab]);

  return (
    <div className="win">
      <div className="tabs" role="tablist" aria-label="QA Lab sections">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={tab === t.id}
            className={`tab ${tab === t.id ? "tab--active" : ""}`}
            onClick={() => setTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div className="win-scroll qalab__content">
        {tab === "overview" && <OverviewTab />}
        {tab === "testcases" && <TestCasesTab />}
        {tab === "bugs" && <BugReportsTab />}
        {tab === "ui" && <UITestingTab />}
        {tab === "usability" && <UsabilityTestingTab />}
        {tab === "api" && <APITestingTab />}
        {tab === "exploratory" && <ExploratoryTestingTab />}
        {tab === "istqb" && <ISTQBTab />}
      </div>
    </div>
  );
}
