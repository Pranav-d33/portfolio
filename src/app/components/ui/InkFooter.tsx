"use client";

import { motion, useReducedMotion } from "framer-motion";
import { scrollToTop, scrollToSection } from "@/lib/scroll";

const navLinks = [
  { id: "about", label: "Background" },
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Selected work" },
  { id: "research", label: "Research" },
  { id: "writing", label: "Writing" },
  { id: "contact", label: "Contact" },
];

const socialLinks = [
  { label: "GitHub", href: "https://github.com/Pranav-d33" },
  { label: "LinkedIn", href: "https://linkedin.com/in/prannav-dhiran" },
  { label: "Substack", href: "https://ashborn2.substack.com" },
  { label: "X", href: "https://x.com/Prannav_ai" },
];

export function InkFooter() {
  const reduced = useReducedMotion();

  return (
    <footer className="ink-footer relative overflow-hidden lg:ml-[280px]">
      {/* Giant wordmark */}
      <div className="px-6 md:px-16 lg:px-24 pt-20 md:pt-28 overflow-hidden border-b border-white/10">
        <motion.div
          initial={reduced ? false : { y: 80, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, margin: "0px 0px -80px 0px" }}
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
          className="font-degular italic leading-[0.95] tracking-[-0.02em] select-none"
        >
          <span className="ink-footer-name block text-[clamp(40px,7.5vw,104px)]">
            Pranav Dhiran
          </span>
        </motion.div>

        {/* Thin rule beneath name */}
        <div className="mt-8 pb-0 h-px bg-white/10" />
      </div>

      {/* Middle grid */}
      <div className="px-6 md:px-16 lg:px-24 py-16 md:py-20 grid md:grid-cols-12 gap-12 md:gap-10">
        {/* Epigraph */}
        <div className="md:col-span-6">
          <div className="font-meta !text-[10px] tracking-[0.28em] text-white/40 mb-5 uppercase">
            Epigraph
          </div>
          <blockquote className="font-degular italic text-[clamp(18px,2.4vw,24px)] leading-[1.4] text-white/85 max-w-md m-0">
            "Not everything is meant to be, but everything is worth trying."
          </blockquote>
          <div className="font-meta !text-[10px] tracking-[0.22em] text-white/35 mt-4 uppercase">
            Pranav Dhiran
          </div>
        </div>

        {/* Navigation */}
        <div className="md:col-span-3">
          <div className="font-meta !text-[10px] tracking-[0.28em] text-white/40 mb-5 uppercase">
            Navigate
          </div>
          <ul className="space-y-2.5">
            {navLinks.map((link) => (
              <li key={link.id}>
                <button
                  onClick={() => scrollToSection(link.id)}
                  className="font-blanco text-[13px] text-white/55 hover:text-white/90 transition-colors duration-200 bg-transparent border-none cursor-pointer p-0 text-left"
                  type="button"
                >
                  {link.label}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Social + back to top */}
        <div className="md:col-span-3 flex flex-col justify-between">
          <div>
            <div className="font-meta !text-[10px] tracking-[0.28em] text-white/40 mb-5 uppercase">
              Connect
            </div>
            <ul className="space-y-2.5">
              {socialLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-blanco text-[13px] text-white/55 hover:text-white/90 transition-colors duration-200 !no-underline inline-flex items-center gap-1.5 group"
                  >
                    {link.label}
                    <svg
                      width="10"
                      height="10"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="opacity-0 group-hover:opacity-60 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-200"
                      aria-hidden="true"
                    >
                      <path d="M7 7h10v10"/><path d="M7 17 17 7"/>
                    </svg>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <button
            onClick={scrollToTop}
            className="mt-10 md:mt-0 group inline-flex items-center gap-2.5 font-meta !text-[10px] tracking-[0.22em] text-white/45 hover:text-white/80 bg-transparent border-none cursor-pointer p-0 uppercase transition-colors duration-200"
            type="button"
          >
            <span className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center group-hover:border-white/50 transition-colors duration-200">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="m5 12 7-7 7 7"/><path d="M12 19V5"/>
              </svg>
            </span>
            Back to top
          </button>
        </div>
      </div>

      {/* Bottom strip */}
      <div className="px-6 md:px-16 lg:px-24 py-6 border-t border-white/10 flex flex-wrap justify-between items-center gap-3">
        <span className="font-meta !text-[10px] tracking-[0.22em] text-white/30 uppercase">
          © {new Date().getFullYear()} Pranav Dhiran
        </span>
        <span className="font-meta !text-[10px] tracking-[0.18em] text-white/25 uppercase">
          Built with care
        </span>
      </div>
    </footer>
  );
}
