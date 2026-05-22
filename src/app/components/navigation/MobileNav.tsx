"use client";

import { useCallback } from "react";

const navItems = [
  { id: "about", label: "About" },
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Projects" },
  { id: "contact", label: "Contact" },
];

export function MobileNav() {
  const scrollTo = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  return (
    <nav className="fixed z-50 bottom-4 left-4 right-4 lg:hidden" aria-label="Mobile navigation">
      <div className="px-4 py-3 bg-background/85 border border-border-dim rounded-2xl shadow-[0_18px_50px_rgba(0,0,0,0.32)] backdrop-blur-xl overflow-hidden">
        <div className="absolute inset-y-0 right-0 w-12 pointer-events-none bg-gradient-to-l from-background/85 to-transparent" />
        <ul className="flex flex-row flex-nowrap overflow-x-auto whitespace-nowrap justify-start space-x-6 text-base font-blanco hide-scrollbar">
          {navItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => scrollTo(item.id)}
                className="block text-t2 hover:text-t1 transition-colors whitespace-nowrap"
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
