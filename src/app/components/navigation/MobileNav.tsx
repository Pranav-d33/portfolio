"use client";

import { useState, useCallback } from "react";

const navItems = [
  { id: "about", label: "About" },
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Projects" },
  { id: "research", label: "Research" },
  { id: "contact", label: "Contact" },
];

export function MobileNav() {
  const [open, setOpen] = useState(false);

  const scrollTo = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
    setOpen(false);
  }, []);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 md:hidden" aria-label="Mobile navigation">
      <div className="flex items-center justify-between px-4 py-3 bg-canvas-porcelain border-b border-fog-border">
        <button
          onClick={() => scrollTo("about")}
          className="font-degular text-sm font-medium text-ebony-text"
          type="button"
        >
          Pranav Dhiran
        </button>
        <button
          onClick={() => setOpen(!open)}
          className="p-2 text-ebony-text"
          aria-label={open ? "Close menu" : "Open menu"}
          type="button"
        >
          {open ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="4" y1="8" x2="20" y2="8"/><line x1="4" y1="16" x2="20" y2="16"/>
            </svg>
          )}
        </button>
      </div>
      {open && (
        <div className="bg-canvas-porcelain border-b border-fog-border px-4 pb-4">
          <div className="flex flex-col gap-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollTo(item.id)}
                className="nav-link text-left w-full py-2"
                type="button"
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
