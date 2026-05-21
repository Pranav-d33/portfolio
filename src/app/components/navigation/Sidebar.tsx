"use client";

import { useCallback } from "react";

const navItems = [
  { id: "about", label: "About" },
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Projects" },
  { id: "research", label: "Research" },
  { id: "contact", label: "Contact" },
];

export function Sidebar({ activeSection }: { activeSection: string }) {
  const scrollTo = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  return (
    <nav className="fixed left-0 top-0 h-screen w-[200px] flex flex-col justify-center px-6 z-50 select-none" aria-label="Main navigation">
      <div className="flex flex-col gap-1">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => scrollTo(item.id)}
            className={`nav-link text-left ${activeSection === item.id ? "active" : ""}`}
            type="button"
          >
            {item.label}
          </button>
        ))}
      </div>
    </nav>
  );
}
