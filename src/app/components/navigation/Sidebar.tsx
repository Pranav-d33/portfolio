"use client";

import { useCallback, useSyncExternalStore } from "react";
import { motion, useReducedMotion, useScroll, useSpring, useTransform, useVelocity } from "framer-motion";
import { Moon, Sun } from "lucide-react";
import { MOTION } from "@/lib/motion";

const navItems = [
  { id: "about", label: "About" },
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Projects" },
  { id: "research", label: "Research" },
  { id: "contact", label: "Contact" },
];

function getDarkSnapshot() {
  return document.documentElement.classList.contains("dark");
}

function subscribeToDark(callback: () => void) {
  const observer = new MutationObserver(() => {
    callback();
  });
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
  return () => observer.disconnect();
}

function useDarkMode() {
  return useSyncExternalStore(subscribeToDark, getDarkSnapshot, () => false);
}

export function Sidebar({ activeSection }: { activeSection: string }) {
  const isDark = useDarkMode();
  const prefersReducedMotion = useReducedMotion();
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const easedVelocity = useSpring(scrollVelocity, MOTION.springEditorial);
  const nameY = useTransform(easedVelocity, [-1400, 0, 1400], [-3, 0, 3]);
  const nameRotate = useTransform(easedVelocity, [-1400, 0, 1400], [-2, 0, 2]);
  const nameScale = useTransform(easedVelocity, [-1400, 0, 1400], [0.985, 1, 1.015]);

  const toggleDark = useCallback(() => {
    const next = !document.documentElement.classList.contains("dark");
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  }, []);

  const scrollTo = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  const scrollHome = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <>
      {/* Fixed top header */}
      <header className="fixed top-0 left-0 z-50 p-6 flex justify-between items-center w-full">
        <motion.button
          onClick={scrollHome}
          className="font-blanco text-xl font-medium text-ebony-text/70 hover:text-ebony-text origin-left transform-gpu motion-safe"
          style={prefersReducedMotion ? undefined : { y: nameY, rotate: nameRotate, scale: nameScale }}
          whileHover={{ scale: 1.015 }}
          whileTap={{ scale: 0.99 }}
          transition={MOTION.springEditorial}
          type="button"
        >
          Pranav Dhiran
        </motion.button>
        <motion.button
          onClick={toggleDark}
          className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
          transition={MOTION.springEditorial}
          type="button"
          aria-label={isDark ? "Dark mode" : "Light mode"}
        >
          {isDark ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
        </motion.button>
      </header>

      {/* Desktop left nav */}
      <nav className="hidden lg:block fixed z-50 bottom-6 left-6" aria-label="Main navigation">
        <ul className="flex flex-col space-y-4 text-xl font-blanco">
          {navItems.map((item) => (
            <li key={item.id}>
              <motion.button
                onClick={() => scrollTo(item.id)}
                className={`relative px-3 py-1.5 -mx-3 text-left w-full rounded-sm ${
                  activeSection === item.id
                    ? "bg-ebony-text/[0.04] dark:bg-white/[0.04] text-ebony-text"
                    : "text-graphite-text hover:text-ebony-text"
                }`}
                whileHover={{ x: 3 }}
                whileTap={{ scale: 0.98 }}
                transition={MOTION.springEditorial}
                type="button"
              >
                {item.label}
                {activeSection === item.id && (
                  <motion.span
                    className="absolute left-3 right-3 bottom-0 h-px bg-ebony-text dark:bg-white"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: MOTION.fast, ease: MOTION.easeOutQuart }}
                    style={{ transformOrigin: 'left' }}
                  />
                )}
              </motion.button>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
}
