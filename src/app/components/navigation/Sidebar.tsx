"use client";

import { useCallback, useEffect, useState } from "react";
import { motion, useReducedMotion, useScroll, useSpring, useTransform, useVelocity } from "framer-motion";
import { Moon, Sun } from "lucide-react";

const navItems = [
  { id: "about", label: "About" },
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Projects" },
  { id: "research", label: "Research" },
  { id: "contact", label: "Contact" },
];

function useDarkMode() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    setDark(document.documentElement.classList.contains("dark"));
    const observer = new MutationObserver(() => {
      setDark(document.documentElement.classList.contains("dark"));
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  return dark;
}

export function Sidebar({ activeSection }: { activeSection: string }) {
  const dark = useDarkMode();
  const prefersReducedMotion = useReducedMotion();
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const easedVelocity = useSpring(scrollVelocity, {
    stiffness: 120,
    damping: 24,
    mass: 0.2,
  });
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
          className="font-degular text-lg font-medium text-ebony-text/70 hover:text-ebony-text transition-colors origin-left transform-gpu"
          style={prefersReducedMotion ? undefined : { y: nameY, rotate: nameRotate, scale: nameScale }}
          type="button"
        >
          Pranav Dhiran
        </motion.button>
        <button
          onClick={toggleDark}
          className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          type="button"
          aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
        >
          {dark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
      </header>

      {/* Desktop left nav */}
      <nav className="hidden lg:block fixed z-50 bottom-6 left-6" aria-label="Main navigation">
        <ul className="flex flex-col space-y-3 text-lg font-blanco">
          {navItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => scrollTo(item.id)}
                className={`block transition-colors ${
                  activeSection === item.id
                    ? "text-ebony-text underline"
                    : "text-graphite-text hover:text-ebony-text"
                }`}
                type="button"
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
}
