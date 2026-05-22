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
      <div className="px-4 py-3 bg-white border border-gray-200 rounded-lg dark:bg-black dark:border-gray-700 overflow-hidden">
        <div className="absolute inset-y-0 right-0 w-12 pointer-events-none bg-gradient-to-l from-white dark:from-black to-transparent" />
        <ul className="flex flex-row flex-nowrap overflow-x-auto whitespace-nowrap justify-start space-x-6 text-base font-blanco hide-scrollbar">
          {navItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => scrollTo(item.id)}
                className="block text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 transition-colors whitespace-nowrap"
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
