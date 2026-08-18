import { useEffect, useRef, useState } from "react";
import { AlertTriangle, CheckCircle2, Trash2 } from "lucide-react";
import { useWindowManager } from "../../context/WindowManagerContext";

import alertGif from "../../assets/GIF/Alert.gif";
import scubaDanceGif from "../../assets/GIF/scuba-dance.gif";

import securityAlertSound from "../../assets/sounds/security-alert.mp3";
import scubaSound from "../../assets/sounds/scuba.mp3";

import "./SecretWindow.css";

export default function SecretWindow() {
  const { closeWindow } = useWindowManager();

  const [stage, setStage] = useState("alert");
  const [progress, setProgress] = useState(0);

  const securityAudioRef = useRef(null);
  const scubaAudioRef = useRef(null);

  const securityStartedRef = useRef(false);
  const scubaStartedRef = useRef(false);

  const playSecuritySound = async () => {
    const audio = securityAudioRef.current;

    if (!audio || securityStartedRef.current) {
      return;
    }

    try {
      audio.currentTime = 0;
      await audio.play();
      securityStartedRef.current = true;
    } catch (error) {
      console.warn("Security sound was blocked by the browser:", error);
    }
  };

  const playScubaSound = async () => {
    const audio = scubaAudioRef.current;

    if (!audio || scubaStartedRef.current) {
      return;
    }

    try {
      audio.currentTime = 0;
      await audio.play();
      scubaStartedRef.current = true;
    } catch (error) {
      console.warn("Scuba sound was blocked by the browser:", error);
    }
  };

  const stopSecuritySound = () => {
    const audio = securityAudioRef.current;

    if (!audio) {
      return;
    }

    audio.pause();
    audio.currentTime = 0;
    securityStartedRef.current = false;
  };

  const stopScubaSound = () => {
    const audio = scubaAudioRef.current;

    if (!audio) {
      return;
    }

    audio.pause();
    audio.currentTime = 0;
    scubaStartedRef.current = false;
  };

  useEffect(() => {
    const securityAudio = new Audio(securityAlertSound);
    const scubaAudio = new Audio(scubaSound);

    securityAudio.preload = "auto";
    scubaAudio.preload = "auto";

    securityAudio.volume = 0.55;
    scubaAudio.volume = 0.5;

    securityAudio.loop = true;
    scubaAudio.loop = true;

    securityAudioRef.current = securityAudio;
    scubaAudioRef.current = scubaAudio;

    // Try immediately.
    playSecuritySound();

    const progressInterval = setInterval(() => {
      setProgress((current) => {
        if (current >= 87) {
          clearInterval(progressInterval);
          return 87;
        }

        const next =
          current + Math.floor(Math.random() * 4) + 1;

        return Math.min(next, 87);
      });
    }, 150);

    const kiddingTimer = setTimeout(() => {
      stopSecuritySound();

      setStage("kidding");

      // Try starting the scuba song immediately.
      setTimeout(() => {
        playScubaSound();
      }, 50);
    }, 6000);

    return () => {
      clearInterval(progressInterval);
      clearTimeout(kiddingTimer);

      securityAudio.pause();
      scubaAudio.pause();

      securityAudio.currentTime = 0;
      scubaAudio.currentTime = 0;

      securityStartedRef.current = false;
      scubaStartedRef.current = false;
    };
  }, []);

  /*
   * Browser autoplay fallback.
   *
   * If Chrome blocks audio when the window first opens,
   * the first click/touch anywhere inside this window
   * will start the appropriate sound.
   */
  const handleUserInteraction = () => {
    if (stage === "alert") {
      playSecuritySound();
    }

    if (stage === "kidding") {
      playScubaSound();
    }
  };

  const deleteEvidence = () => {
    stopScubaSound();
    setStage("deleted");
  };

  const closeSecretWindow = () => {
    stopSecuritySound();
    stopScubaSound();

    closeWindow("secret");
  };

  return (
    <div
      className="win secret-window"
      onClick={handleUserInteraction}
      onTouchStart={handleUserInteraction}
    >
      <div className="win-scroll secret-window__scroll">
        {stage === "alert" && (
          <div className="secret-window__screen secret-window__screen--alert">
            <img
              src={alertGif}
              alt=""
              className="secret-window__gif secret-window__gif--alert"
            />

            <div className="secret-window__alert-title">
              <AlertTriangle size={25} />
              <h2>SECURITY ALERT</h2>
            </div>

            <p className="secret-window__main-text">
              Unauthorized access detected.
            </p>

            <p className="secret-window__upload-text">
              Uploading browser history to Reham...
            </p>

            <div className="secret-window__progress-row">
              <div className="secret-window__progress">
                <div
                  className="secret-window__progress-fill"
                  style={{
                    width: `${progress}%`,
                  }}
                />
              </div>

              <span className="secret-window__progress-value">
                {progress}%
              </span>
            </div>

            <div className="secret-window__fake-log">
              <span>&gt; IP address located.</span>
              <span>&gt; Browser fingerprint captured.</span>
              <span>&gt; Extracting cookies...</span>
              <span>&gt; Analyzing tabs...</span>

              <span>
                &gt;{" "}
                {progress >= 87
                  ? "Almost there..."
                  : "Processing..."}
              </span>
            </div>

            <p className="secret-window__warning">
              Do not close this window.
            </p>
          </div>
        )}

        {stage === "kidding" && (
          <div className="secret-window__screen secret-window__screen--kidding">
            <img
              src={scubaDanceGif}
              alt=""
              className="secret-window__gif secret-window__gif--dance"
            />

            <h2 className="secret-window__kidding-title">
              JUST KIDDING 😭
            </h2>

            <p className="secret-window__kidding-question">
              Why did you look scared though?
            </p>

            <p className="secret-window__kidding-copy">
              Reham doesn't want your browser history.
              <br />
              <span>...probably.</span>
            </p>

            <button
              type="button"
              className="btn secret-window__delete"
              onClick={(event) => {
                event.stopPropagation();
                deleteEvidence();
              }}
            >
              <Trash2 size={14} />
              DELETE EVIDENCE
            </button>
          </div>
        )}

        {stage === "deleted" && (
          <div className="secret-window__screen secret-window__screen--deleted">
            <CheckCircle2
              size={46}
              className="secret-window__deleted-icon"
            />

            <h2 className="secret-window__deleted-title">
              EVIDENCE DELETED
            </h2>

            <p className="secret-window__deleted-copy">
              Reham will never know you were here.
              <br />
              <span>...probably.</span>
            </p>

            <button
              type="button"
              className="btn secret-window__escape"
              onClick={(event) => {
                event.stopPropagation();
                closeSecretWindow();
              }}
            >
              GET ME OUT OF HERE
            </button>
          </div>
        )}
      </div>
    </div>
  );
}