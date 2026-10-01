"use client";

import { useCallback, useEffect, useRef } from "react";
import { scrollToSection, scrollToTop } from "@/lib/scroll";
import { useTheme } from "@/lib/useTheme";
import { Moon, Sun, Terminal } from "lucide-react";

const navItems = [
  { id: "about", label: "About" },
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Projects" },
  { id: "research", label: "Research" },
  { id: "writing", label: "Writing" },
  { id: "contact", label: "Contact" },
];

export function MobileNav({
  activeSection,
  onOpenAgentView,
}: {
  activeSection: string;
  onOpenAgentView?: () => void;
}) {
  const { isDark, toggle: toggleDark } = useTheme();

  const scrollTo = useCallback((id: string) => {
    scrollToSection(id);
  }, []);

  /* Chrome on Android lays `position: fixed` out against the LAYOUT viewport,
     which is sized as though the URL bar were already retracted. On first
     paint the bar is still showing, so `bottom: 1rem` resolves to a point
     roughly 60px below what you can actually see — the dock is off screen
     until scrolling collapses the bar. (The chat pill escapes this only
     because its 80px offset happens to clear the bar.) Lift the dock by
     whatever the browser chrome is currently covering. */
  const dockRef = useRef<HTMLElement>(null);
  useEffect(() => {
    const vv = window.visualViewport;
    if (!vv) return;
    const sync = () => {
      const covered = document.documentElement.clientHeight - (vv.offsetTop + vv.height);
      // The soft keyboard shrinks the same viewport; clamp so the dock rides
      // the URL bar without launching itself up the screen on input focus.
      const lift = Math.min(Math.max(covered, 0), 120);
      dockRef.current?.style.setProperty("--dock-lift", `${lift}px`);
    };
    sync();

    /* The layout viewport changes without emitting a visualViewport resize —
       notably when SiteIntro releases `body { overflow: hidden }` and the page
       becomes scrollable, which is precisely when this first goes wrong. Watch
       the document element itself so that resize is not missed. */
    const ro = new ResizeObserver(sync);
    ro.observe(document.documentElement);

    vv.addEventListener("resize", sync);
    vv.addEventListener("scroll", sync);
    window.addEventListener("resize", sync);
    window.addEventListener("orientationchange", sync);
    return () => {
      ro.disconnect();
      vv.removeEventListener("resize", sync);
      vv.removeEventListener("scroll", sync);
      window.removeEventListener("resize", sync);
      window.removeEventListener("orientationchange", sync);
    };
  }, []);

  return (
    <>
      {/* Top bar: name + theme */}
      <header className="fixed z-50 top-0 left-0 right-0 lg:hidden flex items-center justify-between px-5 py-4 bg-background/80 backdrop-blur-md border-b border-border-dim/60">
        <button
          onClick={scrollToTop}
          className="flex items-center gap-2 font-degular text-lg text-ebony-text tracking-tight"
          type="button"
          aria-label="Back to top"
        >
          <img src="/logo-mark.png" alt="" className="site-mark" width={24} height={24} />
          Pranav Dhiran
        </button>
        <div className="flex items-center gap-2">
          {onOpenAgentView && (
            <button
              onClick={onOpenAgentView}
              className="inline-flex h-9 items-center gap-1.5 rounded-full border border-rule px-3 text-[10px] font-meta tracking-[0.14em] text-ink-soft dark:border-white/20 dark:text-[#e5e7eb] transition-colors"
              type="button"
              aria-label="Open agent view"
            >
              <Terminal className="w-[13px] h-[13px] stroke-[1.7]" />
              <span className="mobile-agents-label">AGENTS</span>
            </button>
          )}
          <button
            onClick={toggleDark}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-rule bg-transparent text-ink-soft hover:text-ink hover:border-ink-soft dark:border-white/20 dark:text-[#e5e7eb] dark:hover:bg-[#e5e7eb] dark:hover:text-[#1A1A1A] dark:hover:border-[#e5e7eb] transition-colors"
            type="button"
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
            title={isDark ? "Light mode" : "Dark mode"}
          >
            {isDark ? <Moon className="w-[18px] h-[18px] stroke-[1.7]" /> : <Sun className="w-[18px] h-[18px] stroke-[1.7]" />}
          </button>
        </div>
      </header>

      {/* Bottom bar: section nav */}
      <nav
        ref={dockRef}
        className="mobile-dock fixed z-50 bottom-4 left-4 right-4 lg:hidden"
        aria-label="Mobile navigation"
      >
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
