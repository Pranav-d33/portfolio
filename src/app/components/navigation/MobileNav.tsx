"use client";

import { useCallback } from "react";

const navItems = [
  { id: "about", label: "About" },
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Projects" },
  { id: "contact", label: "Contact" },
  { id: "research", label: "Research" },
];

export function MobileNav({ activeSection }: { activeSection: string }) {
  const scrollTo = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  return (
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
  );
}
