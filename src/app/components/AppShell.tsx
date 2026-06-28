"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import HomeClient from "./HomeClient";
import { SiteIntro } from "./SiteIntro";
import { PageAtmosphere } from "./PageAtmosphere";

export default function AppShell() {
  const [introComplete, setIntroComplete] = useState(false);
  const mainRef = useRef<HTMLElement>(null);

  const handleIntroComplete = useCallback(() => {
    setIntroComplete(true);
    document.body.style.overflow = "";
  }, []);

  useEffect(() => {
    if (introComplete && mainRef.current) {
      mainRef.current.focus({ preventScroll: true });
    }
  }, [introComplete]);

  return (
    <>
      <PageAtmosphere />
      <HomeClient mainRef={mainRef} introComplete={introComplete} />
      <AnimatePresence mode="wait">
        {!introComplete && (
          <SiteIntro key="site-intro" onComplete={handleIntroComplete} />
        )}
      </AnimatePresence>
    </>
  );
}
