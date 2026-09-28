"use client";

import { useCallback } from "react";
import { scrollToSection, scrollToTop } from "@/lib/scroll";
import { motion } from "framer-motion";
import { MOTION } from "@/lib/motion";

const navItems = [
  { id: "about", label: "Background" },
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Selected work" },
  { id: "research", label: "Research" },
  { id: "writing", label: "Writing & Talks" },
  { id: "contact", label: "Contact" },
];

export function Sidebar({ activeSection }: { activeSection: string }) {
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

    </aside>
  );
}
