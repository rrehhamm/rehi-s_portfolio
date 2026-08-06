import { secretFacts } from "../../data/social";
import { useWindowManager } from "../../context/WindowManagerContext";
import "./SecretWindow.css";

export default function SecretWindow() {
  const { closeWindow } = useWindowManager();

  return (
    <div className="win secret-window">
      <div className="win-scroll">
        <p className="secret-window__heading">You opened it anyway... ♡</p>
        <ul className="list-plain secret-window__facts">
          {secretFacts.map((f, i) => <li key={i}>{f}</li>)}
        </ul>
        <button type="button" className="btn btn--sm secret-window__close" onClick={() => closeWindow("secret")}>
          Close before Reham notices.
        </button>
      </div>
    </div>
  );
}
