"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

gsap.registerPlugin(ScrollTrigger);

let lenis: Lenis | null = null;

export function isTouch() {
  return (
    typeof window !== "undefined" &&
    !window.matchMedia("(hover: hover) and (pointer: fine)").matches
  );
}

export function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

export function getLenis() {
  return lenis;
}

export function scrollToSection(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  if (lenis) {
    lenis.scrollTo(el, {
      offset: -32,
      duration: 1.1,
      easing: (t) => 1 - Math.pow(1 - t, 4),
    });
  } else {
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

export function scrollToTop() {
  if (lenis) {
    lenis.scrollTo(0, { duration: 1.1, easing: (t) => 1 - Math.pow(1 - t, 4) });
  } else {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
}

export function useSmoothScroll() {
  useEffect(() => {
    if (isTouch() || prefersReducedMotion()) return;

    lenis = new Lenis({ lerp: 0.1 });
    lenis.on("scroll", ScrollTrigger.update);

    const raf = (time: number) => lenis?.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(raf);
      lenis?.destroy();
      lenis = null;
    };
  }, []);
}

export function SmoothScroll() {
  useSmoothScroll();
  return null;
}
