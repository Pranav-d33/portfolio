"use client";

import { useCallback, useSyncExternalStore } from "react";
import { scrollToSection, scrollToTop } from "@/lib/scroll";
import { Moon, Sun } from "lucide-react";

const navItems = [
  { id: "about", label: "About" },
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Projects" },
  { id: "research", label: "Research" },
  { id: "writing", label: "Writing" },
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

export function MobileNav({ activeSection }: { activeSection: string }) {
  const isDark = useDarkMode();

  const scrollTo = useCallback((id: string) => {
    scrollToSection(id);
  }, []);

  const toggleDark = useCallback(() => {
    const next = !document.documentElement.classList.contains("dark");
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  }, []);

  return (
    <>
      {/* Top bar: name + theme */}
      <header className="fixed z-50 top-0 left-0 right-0 lg:hidden flex items-center justify-between px-5 py-4 bg-background/80 backdrop-blur-md border-b border-border-dim/60">
        <button
          onClick={scrollToTop}
          className="font-degular text-lg text-ebony-text tracking-tight"
          type="button"
        >
          Pranav Dhiran
        </button>
        <button
          onClick={toggleDark}
          className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-rule bg-transparent text-ink-soft hover:text-ink hover:border-ink-soft transition-colors"
          type="button"
          aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
          title={isDark ? "Light mode" : "Dark mode"}
        >
          {isDark ? <Moon className="w-[18px] h-[18px] stroke-[1.7]" /> : <Sun className="w-[18px] h-[18px] stroke-[1.7]" />}
        </button>
      </header>

      {/* Bottom bar: section nav */}
      <nav className="fixed z-50 bottom-4 left-4 right-4 lg:hidden" aria-label="Mobile navigation">
        <div className="px-3 py-2 bg-background/70 border border-border-dim rounded-2xl shadow-[0_18px_50px_rgba(0,0,0,0.32)] backdrop-blur-xl overflow-hidden">
          <div className="absolute inset-y-0 right-0 w-12 pointer-events-none bg-gradient-to-l from-background/70 to-transparent" />
          <ul className="flex flex-row flex-nowrap overflow-x-auto whitespace-nowrap justify-start gap-1 text-base font-blanco hide-scrollbar">
            {navItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => scrollTo(item.id)}
                  className={`whitespace-nowrap px-2.5 py-1.5 rounded-sm ${
                    activeSection === item.id
                      ? "bg-ebony-text/[0.04] dark:bg-white/[0.04] text-ebony-text"
                      : "text-graphite-text hover:text-ebony-text"
                  } transition-colors`}
                  type="button"
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </>
  );
}
