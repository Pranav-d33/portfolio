# Phase 1: Frontend Redesign — Phase Plan

## Phase Goal
Complete redesign of the portfolio frontend using the editorial design system from DESIGN.md

## Waves

### Wave 1: Design Tokens & Global Styles
- **Tasks:**
  1. Replace `globals.css` with new CSS using DESIGN.md tokens (colors, typography, spacing, radii)
  2. Create Tailwind v4 `@theme` block matching DESIGN.md
  3. Set up fonts: Inter (via next/font/google as Degular substitute) and Lora (via next/font/google as Blanco substitute)
  4. Remove all existing dark theme variables, purple accent, AuroraBackground, MarginBlobs, MarginWaves
  5. Add base reset styles and body defaults (bg: #e5e7eb, text: #111827)
  6. Add scrollbar, selection, and focus styles in editorial monochrome

### Wave 2: Layout Shell
- **Tasks:**
  1. Create root layout with fixed left navigation column (desk-bound journal)
  2. Create `NavBar` component — vertical left rail with links: Home, About, Experience, Projects, Contact, System Prompt
  3. Create main content area — scrollable, max-width 1600px, comfortable padding
  4. Responsive: collapse nav to top bar on mobile
  5. Add scroll progress indicator (monochrome)

### Wave 3: Core Components
- **Tasks:**
  1. `Button` — Primary Filled (Midnight Ink #1a202c, 0px radius), Email Button (#222222), Ghost Icon Button (transparent)
  2. `NavLink` — Ebony active, Graphite inactive, underline hover, 3px radius
  3. `ResumeEntryCard` — No card bg, vertical spacing, Ebony title, Graphite description
  4. `ImageWrapper` — 3px border radius container
  5. `Tag` / `Badge` — Monochrome, subtle border
  6. `SectionHeading` — With optional Blanco serif treatment
  7. `Text` components — body, caption, subheading, heading, display variants

### Wave 4: Sections
- **Tasks:**
  1. **Hero section** — Split layout: text + image, "Pranav Dhiran — AI Engineer & Researcher", subtitle typing effect, minimal
  2. **About section** — Bio text, education, focus areas, achievements in clean list
  3. **Experience section** — Timeline/resume entries using ResumeEntryCard
  4. **Projects section** — Clean stacked list of project cards with title, hook, tags, link to case study
  5. **Skills/Research section** — Editorial rows or clean pill grid
  6. **Contact section** — Email button, social links (GitHub, LinkedIn, X), resume download
  7. **Footer** — Copyright, epigraph, "Built with intent" note
  8. **System Prompt callout** — Footer area with link to modal

### Wave 5: Case Studies & Interactivity
- **Tasks:**
  1. Refactor case study page template for editorial style
  2. Architecture diagram component (CSS-based, monochrome)
  3. Related papers section
  4. Chatbot widget — preserve Groq integration, restyle for editorial theme
  5. System Prompt modal — restyle for editorial theme
  6. Custom cursor (simplified monochrome version)
  7. ScrollReveal animations (subtle, no Framer Motion for basic reveals — use CSS)

### Wave 6: Polish & QA
- **Tasks:**
  1. Responsive audit (mobile, tablet, desktop)
  2. Accessibility check (focus styles, contrast ratios, ARIA labels)
  3. Performance — lazy load images, reduce JS bundle, remove unused dependencies
  4. Remove dark mode toggle and all dark theme code
  5. Test all case study routes
  6. Test chatbot flow
  7. Final visual QA against DESIGN.md spec

## Verification Criteria
- Page matches DESIGN.md token values exactly
- No purple accent, no dark mode
- All four case studies render correctly
- Chatbot works
- Responsive at 640px, 768px, 1024px, 1440px
- Lighthouse score >= 90 for Performance, Accessibility, SEO
