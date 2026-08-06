import { PORTFOLIO_NAME, PORTFOLIO_VERSION } from "../../utils/constants";
import "./StatusBar.css";

export default function StatusBar() {
  return (
    <div className="status-bar" aria-hidden="true">
      <span>{PORTFOLIO_NAME}</span>
      <span className="status-bar__dot">·</span>
      <span>Version {PORTFOLIO_VERSION}</span>
      <span className="status-bar__dot">·</span>
      <span>Built with React</span>
    </div>
  );
}
