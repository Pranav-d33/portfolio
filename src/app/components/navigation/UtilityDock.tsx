"use client";

import { motion } from "framer-motion";
import { Moon, Sun, Terminal } from "lucide-react";
import { MOTION } from "@/lib/motion";
import { useTheme } from "@/lib/useTheme";

/**
 * Top-right utility cluster: where people already look for a theme switch.
 * The agent view sits beside it because it is the same kind of control —
 * a way to change how the whole site is presented, not a place to navigate to.
 */
export function UtilityDock({
  onOpenAgentView,
  /** Show at every width. The home page hides it on phones, where MobileNav
   *  carries the same controls; pages without that bar need it everywhere. */
  alwaysVisible = false,
}: {
  onOpenAgentView?: () => void;
  alwaysVisible?: boolean;
}) {
  const { isDark, toggle } = useTheme();

  return (
    <div className={`utility-dock${alwaysVisible ? " utility-dock--always" : ""}`}>
      {onOpenAgentView && (
        <>
          <motion.button
            onClick={onOpenAgentView}
            className="utility-dock__agents group"
            whileTap={{ scale: 0.96 }}
            transition={MOTION.springEditorial}
            type="button"
            title="Read this site the way an agent does"
          >
            <Terminal className="w-[13px] h-[13px] stroke-[1.7]" aria-hidden="true" />
            <span>For agents</span>
            <span className="utility-dock__pulse" aria-hidden="true" />
          </motion.button>

          <span className="utility-dock__divider" aria-hidden="true" />
        </>
      )}

      <motion.button
        onClick={toggle}
        className="utility-dock__theme"
        whileTap={{ scale: 0.94 }}
        transition={MOTION.springEditorial}
        type="button"
        aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
        title={isDark ? "Light mode" : "Dark mode"}
      >
        <motion.span
          key={isDark ? "moon" : "sun"}
          initial={{ opacity: 0, rotate: -25, scale: 0.8 }}
          animate={{ opacity: 1, rotate: 0, scale: 1 }}
          transition={{ duration: 0.22, ease: "easeOut" }}
          className="flex"
        >
          {isDark ? (
            <Moon className="w-[17px] h-[17px] stroke-[1.7]" />
          ) : (
            <Sun className="w-[17px] h-[17px] stroke-[1.7]" />
          )}
        </motion.span>
      </motion.button>
    </div>
  );
}
