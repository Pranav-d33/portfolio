"use client";

import { useCallback, useRef, useState, useSyncExternalStore } from "react";

const PROMPT_KEY = "cd-tray-prompted";
const TRACK = "/time-flows-ever-onward.mp3";

const askListeners = new Set<() => void>();

function subscribeAsk(callback: () => void) {
  askListeners.add(callback);
  window.addEventListener("storage", callback);
  return () => {
    askListeners.delete(callback);
    window.removeEventListener("storage", callback);
  };
}

function getAsked() {
  try {
    return localStorage.getItem(PROMPT_KEY) === "1";
  } catch {
    return true;
  }
}

/** Server renders the widget without the prompt; the client reveals it after
 *  hydration, so a first visit still gets asked. */
const getAskedOnServer = () => true;

function markAsked() {
  try {
    localStorage.setItem(PROMPT_KEY, "1");
  } catch {
    /* private mode — ask again next visit */
  }
  askListeners.forEach((listener) => listener());
}

/**
 * A deck with a CD half-inserted in the tray. Closed = paused, disc out and
 * spinning = playing. First visit asks before making any noise.
 */
export function MusicPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const asked = useSyncExternalStore(subscribeAsk, getAsked, getAskedOnServer);

  const play = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = 0.55;
    audio.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
  }, []);

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) play();
    else {
      audio.pause();
      setPlaying(false);
    }
  };

  const answer = (accept: boolean) => {
    markAsked();
    if (accept) play();
  };

  return (
    <div className="cd-tray">
      {!asked && (
        <div className="cd-tray__card">
          <div className="cd-tray__head">
            <span className="cd-tray__mini" aria-hidden="true" />
            <p className="cd-tray__title">Some music while you look around?</p>
          </div>
          <div className="cd-tray__actions">
            <button type="button" className="cd-tray__btn cd-tray__btn--yes" onClick={() => answer(true)}>
              Yes, play it
            </button>
            <button type="button" className="cd-tray__btn" onClick={() => answer(false)}>
              No thanks
            </button>
          </div>
        </div>
      )}

      <button
        type="button"
        className={`cd-tray__button${playing ? " is-playing" : ""}`}
        aria-pressed={playing}
        aria-label={playing ? "Pause the music" : "Play the music"}
        title={playing ? "Pause the music" : "Play the music"}
        onClick={toggle}
      >
        <span className="cd-tray__disc" aria-hidden="true">
          <span className="cd-tray__reel" />
        </span>
        <svg className="cd-tray__ring" viewBox="0 0 100 100" aria-hidden="true">
          <circle cx="50" cy="50" r="47" fill="none" stroke="var(--color-rule)" strokeWidth="1.5" />
          <circle
            cx="50"
            cy="50"
            r="47"
            fill="none"
            stroke="var(--color-accent)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeDasharray={`${progress * 295.3} 295.3`}
          />
        </svg>
        <span className="cd-tray__tip" aria-hidden="true">
          {playing ? "pause the record" : "play the record"}
        </span>
      </button>

      <audio
        ref={audioRef}
        src={TRACK}
        preload="none"
        loop
        onTimeUpdate={(e) => {
          const { currentTime, duration } = e.currentTarget;
          setProgress(duration ? currentTime / duration : 0);
        }}
        onEnded={() => setPlaying(false)}
      />
    </div>
  );
}
