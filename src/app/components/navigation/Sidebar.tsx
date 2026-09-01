"use client";

import { useCallback, useSyncExternalStore } from "react";
import { scrollToSection, scrollToTop } from "@/lib/scroll";
import { motion } from "framer-motion";
import { Moon, Sun } from "lucide-react";
import { MOTION } from "@/lib/motion";

const navItems = [
  { id: "about", label: "Background" },
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Selected work" },
  { id: "research", label: "Research" },
  { id: "writing", label: "Writing & Talks" },
  { id: "contact", label: "Contact" },
];

function getDarkSnapshot() {
  return document.documentElement.classList.contains("dark");
}

function subscribeToDark(callback: () => void) {
  const observer = new MutationObserver(() => callback());
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
  return () => observer.disconnect();
}

function useDarkMode() {
  return useSyncExternalStore(subscribeToDark, getDarkSnapshot, () => false);
}

function ThemeToggle({ isDark, onToggle }: { isDark: boolean; onToggle: () => void }) {
  return (
    <motion.button
      onClick={onToggle}
      className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-rule bg-transparent text-ink-soft hover:text-ink hover:border-ink-soft hover:bg-black/[0.04] dark:hover:bg-white/[0.06] transition-colors duration-200"
      whileTap={{ scale: 0.94 }}
      transition={MOTION.springEditorial}
      type="button"
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Light mode" : "Dark mode"}
    >
      <motion.span
        key={isDark ? "moon" : "sun"}
        initial={{ opacity: 0, rotate: -20, scale: 0.85 }}
        animate={{ opacity: 1, rotate: 0, scale: 1 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
      >
        {isDark ? <Moon className="w-[18px] h-[18px] stroke-[1.7]" /> : <Sun className="w-[18px] h-[18px] stroke-[1.7]" />}
      </motion.span>
    </motion.button>
  );
}

export function Sidebar({ activeSection }: { activeSection: string }) {
  const isDark = useDarkMode();

  const toggleDark = useCallback(() => {
    const next = !document.documentElement.classList.contains("dark");
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  }, []);

  const scrollTo = useCallback((id: string) => {
    scrollToSection(id);
  }, []);

  return (
    <aside className="hidden lg:flex fixed left-0 top-0 h-screen w-[260px] flex-col justify-between py-12 pl-12 pr-8 z-30 select-none pointer-events-none">
      {/* Top: Name */}
      <div className="pointer-events-auto">
        <button
          onClick={scrollToTop}
          className="block text-left group"
          aria-label="Back to top"
          type="button"
        >
          <div className="font-degular text-[22px] leading-[1.05] tracking-[-0.02em] text-ebony-text">
            Pranav
          </div>
          <div className="font-degular italic text-[22px] leading-[1.05] tracking-[-0.02em] text-ink-soft group-hover:text-ebony-text transition-colors duration-200">
            Dhiran
          </div>
        </button>
      </div>

      {/* Middle: Nav — vertically centered */}
      <nav aria-label="Main navigation" className="pointer-events-auto my-auto py-16">
        <ul className="flex flex-col gap-0.5">
          {navItems.map((item) => {
            const active = activeSection === item.id;
            return (
              <li key={item.id}>
                <motion.button
                  onClick={() => scrollTo(item.id)}
                  className="group relative flex items-center gap-3 w-full text-left py-1.5"
                  whileTap={{ scale: 0.985 }}
                  transition={MOTION.springEditorial}
                  type="button"
                >
                  <span
                    className={`h-px transition-all duration-500 ease-out ${
                      active
                        ? "w-6 bg-accent"
                        : "w-3 bg-rule/70 group-hover:w-5 group-hover:bg-ink-soft"
                    }`}
                    aria-hidden="true"
                  />
                  <span
                    className={`whitespace-nowrap text-[13px] font-blanco tracking-[-0.005em] transition-colors duration-300 ${
                      active
                        ? "text-ebony-text dark:text-white"
                        : "text-graphite-text group-hover:text-ebony-text dark:text-graphite-text dark:group-hover:text-white"
                    }`}
                  >
                    {item.label}
                  </span>
                </motion.button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Bottom: Theme toggle only */}
      <div className="pointer-events-auto">
        <ThemeToggle isDark={isDark} onToggle={toggleDark} />
      </div>
    </aside>
  );
}
