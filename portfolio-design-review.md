# Portfolio Design Review — pranavdhiran.me
### Reviewed as: Senior Product Designer
### Goal: Make this a memorable, skimmable, conversion-optimized experience

---

## Overall Verdict

The bones are strong. The distressed display font is the single best design decision on the page — it's distinctive, memorable, and immediately sets a tone. Everything else needs to catch up to it. Right now the page has a **strong opening and flat execution**. A recruiter lands on the hero, feels intrigued, scrolls into the projects — and hits a wall of floating text with no visual system.

The fixes below are ordered by impact.

---

## 🔴 Remove Entirely — These Are Actively Hurting You

### 1. Random teal word highlights
`working prototype`, `from scratch`, `stateful, auditable`, `instrument everything`

This is the single biggest amateur signal on the page. Teal highlights scattered across random words in body copy look like an unstyled `<mark>` tag, not a design decision. There's no pattern, no grammar to it — so it reads as noise.

**Fix:** Remove all inline word highlights from body copy. If you want to use teal for emphasis, apply it only at the typographic level — headings, labels, links — never mid-sentence in a paragraph.

---

### 2. "shipping research to production | HINDI" in hero
This is cryptic to everyone who isn't you. No recruiter, researcher, or collaborator knows what it means without context. It sits right below your title and immediately introduces confusion as the first thing someone reads after your name.

**Fix:** Remove completely. The bio line below it already does this job better.

---

### 3. Inconsistent pill badges in hero
One pill has a green dot + filled background. The other is an outlined rectangle. These are two completely different components being used as if they're the same thing.

**Fix:** Pick one style — recommended: small outlined pill, 1px teal border, no fill, teal text — and apply it to both. They should look like siblings, not strangers.

---

### 4. "HOW I / WORK" broken nav label
In the navigation bar, "HOW I WORK" wraps to two lines: "HOW I" on one, "WORK" below it. Looks like a broken layout, not intentional design.

**Fix:** Either shorten to "APPROACH" or force it to a single line with `white-space: nowrap`.

---

### 5. Bullet points (•) in Research & Achievements
Plain bullet lists in a portfolio that's trying to be editorial is a jarring downgrade. Every other section has a custom treatment — then this falls back to a `<ul>`.

**Fix:** Replace with clean unstyled list items. Each cert/award on its own line, institution name muted below it. No bullets.

---

## 🟡 Significant Modifications Needed

### 6. Projects — no card treatment
This is the biggest structural UX problem. Projects are floating open text separated by a faint bottom border and massive empty space. There's no visual container, no weight, no sense that each project is a discrete unit.

**What it should feel like:** Each project is a card. You open it, you get the full picture, you move on. Right now it feels like scrolling through a Google Doc.

**Fix:**
- Wrap each project in a card: `background: #111`, `border: 1px solid rgba(255,255,255,0.08)`, `border-radius: 12px`, `padding: 32px`
- Add a very subtle teal glow on hover: `box-shadow: 0 0 0 1px rgba(teal, 0.3)`
- Reduce the empty space between cards from current ~80px to 24px — cards create their own separation

---

### 7. Project order — Medaura must lead
SLM is first. Medaura should be first. Medaura is your strongest proof of systems thinking, multi-agent architecture, and shipping — it has a live URL, Langfuse traces, and a real use case. SLM is impressive but it's a learning project.

**Fix:** Swap order. Medaura → SLM → Hindi BPE → GNU Radio MCP → RF Watch

---

### 8. SLM description — "6L, 6H, 384-dim" in lead paragraph
Architecture dimensions are case study details, not a project hook. Nobody scanning a portfolio cares about layer counts before they understand why the project exists.

**Fix:** Move all dimension references to the case study. Lead paragraph should read:
> "Pre-trained a GPT-style transformer entirely from scratch — no pretrained weights, no borrowed tokenizers. Built to understand every layer of the pipeline before trusting any abstraction above it."

---

### 9. Dead space in hero — below links row
There's approximately 100px of empty dark space between the links row (Resume/Email/GitHub) and the "01 SELECTED WORK" section header. It doesn't feel intentional — it feels like a margin bug.

**Fix:** Either reduce this gap to ~60px, or add a subtle animated scroll indicator (a small bouncing chevron or dot) that signals "keep scrolling." This turns a dead zone into a directional cue.

---

### 10. RF Watch — still a full project card
RF Watch has the same card weight as Medaura and SLM. It shouldn't. It's a supporting credential, not a lead project.

**Fix:** Shrink to a minimal 2-line entry:
```
RF Watch — Open-source RF spectrum monitor · HackRF One + GNU Radio
[GitHub]
```
No hook line. No description paragraph. No case study link. One line, one link.

---

### 11. Contact CTA — low contrast, low energy
The CTA statement "Open to AI/ML internships and research collaborations..." is rendered in a muted grey that makes it the hardest text to read on the page. This is the most important copy — it's why the page exists.

**Fix:**
- CTA statement: full off-white, larger size (1.2rem or 1.3rem), generous line height
- Email address: large, teal, no underline (underline on hover only)
- GitHub/LinkedIn/X: icon + label, slightly muted but legible

---

### 12. Profile photo — circular crop feels generic
The circular photo crop is the most common pattern on every developer portfolio on the internet. It works fine but it's forgettable.

**Fix (two options):**
- **Option A (minimal effort):** Keep circular but add a subtle teal ring on hover that pulses once
- **Option B (editorial):** Switch to a square crop with slight tilt (-2deg rotation) and a teal border offset. More distinctive, matches the distressed font energy

---

### 13. Section numbers — inconsistent use
"01", "02", "03" appear in some sections but not all. They start as a design system (numbered sections) but don't complete the system consistently through the page.

**Fix:** Either number every section consistently — small, muted, top-left of each section header — or remove them entirely. Don't half-commit.

---

### 14. Reading Room — paper cards have no container
Same problem as projects. Papers are open floating text. On a dark background with small type, they blur together.

**Fix:**
- Two-column grid on desktop, single column on mobile
- Each paper: minimal card with left teal border accent (3px), `padding: 16px 20px`
- Title bold, synthesis line muted italic below, Paper link small teal at bottom

---

### 15. Awards — UWA and SIH have no visual prominence
"Global Finalist (Top 6 Internationally) — UWA Hack For Impact 2026" and both SIH entries are your strongest credentials. They're listed identically to "Regional Qualifier — Nxt Wave x OpenAI Buildathon."

**Fix:** Add a 3px teal left-border accent on UWA and SIH lines only. No other changes needed — just that single visual signal says "these are different."

---

## 🟢 Micro-Interactions — Make It Memorable

These are the details that separate a portfolio people remember from one they forget.

---

### M1. Project card hover — teal border glow
On hovering a project card:
- Border transitions from `rgba(255,255,255,0.08)` to `rgba(teal, 0.4)`
- Timing: `transition: border-color 200ms ease, box-shadow 200ms ease`
- Add: `box-shadow: 0 0 20px rgba(teal, 0.08)`
- The card should feel like it's being selected, not clicked

---

### M2. "View case study →" arrow nudge
The `→` arrow should move 4px right on hover:
```css
.case-study-link:hover .arrow {
  transform: translateX(4px);
  transition: transform 150ms ease;
}
```
Small, physical, satisfying. Current arrow is static and easy to miss.

---

### M3. Nav link active state
Current nav has no clear active state as you scroll. Add a teal underline that slides to the active section using IntersectionObserver. This makes the page feel alive and tells the visitor where they are.

---

### M4. Stack pills — subtle hover
Each stack pill on hover should:
- Border: `rgba(teal, 0.6)` from `rgba(teal, 0.2)`
- Very subtle, 150ms ease
- Makes the tech stack feel interactive, not just decorative

---

### M5. Hero name — cursor proximity effect
The distressed font name is the hero's strongest asset. On desktop, add a subtle cursor-proximity effect: as mouse moves near the letters, they very slightly distort or shift (CSS `transform: skewX` on individual spans, driven by mouse distance in JS). Keep it very subtle — 1-2deg max. If this is too much, skip it. But if executed well, it's the one thing visitors will mention.

---

### M6. Page load — staggered fade-in
On load, elements should appear in sequence:
1. Name (0ms)
2. Title + bio (150ms)
3. Pills (300ms)
4. Links (450ms)

Use `opacity: 0 → 1` with `translateY(8px) → 0`. Nothing dramatic — just enough to feel intentional rather than a hard paint.

---

### M7. Reading Room — paper card hover
On hover, the 3px teal left border should grow to 4px and the card background lifts slightly. Very subtle. Signals interactivity.

---

### M8. "VENI VIDI VICI" easter egg — keep but improve
Currently appears as plain text overlay. Consider: when triggered, it fades in with a slight glitch/flicker animation matching the distressed font aesthetic. 2 seconds, then fades out. Earns its place as a memorable moment.

---

## 🔵 Typography System — Establish Rules and Follow Them

Right now every section has slightly different type choices. This needs a rigid system:

```
Display (Name):       Distressed font, 48–64px, tracking normal
Section heading:      Same distressed font OR all-caps with wide tracking, 24px
Project title:        Bold, 18–20px, off-white
Hook line:            Italic, 15px, muted teal or muted white — NOT same as body
Body:                 Regular, 15px, off-white #e8e8e8, line-height 1.75
Labels/pills:         10–11px, uppercase, tracked wide
Muted text:           #888 or similar — institutions, dates, synthesis lines
Links:                Teal, no underline by default, underline on hover
```

**Critical:** Body copy should never have teal. Teal is reserved for links, labels, accents, and borders only.

---

## 🔵 Spacing System — Fix the Vertical Rhythm

Current spacing is inconsistent and causes the "floating text" problem.

```
Between major sections:     96px
Between project cards:      24px
Inside project card:        32px padding
Between card elements:      12px (hook → title → body → pills → links)
Section heading → content:  32px
```

Pick these values and use them everywhere. Consistency is what makes a layout feel designed versus assembled.

---

## Summary — Priority Order

| Priority | Fix | Effort |
|---|---|---|
| 1 | Remove all random teal word highlights | 15 min |
| 2 | Remove "shipping research to production \| HINDI" | 2 min |
| 3 | Fix hero pill badge consistency | 20 min |
| 4 | Add card treatment to projects | 1 hour |
| 5 | Fix "HOW I / WORK" nav wrap | 5 min |
| 6 | Swap project order — Medaura first | 5 min |
| 7 | Fix contact CTA contrast | 10 min |
| 8 | Shrink RF Watch to 2-line entry | 10 min |
| 9 | Fix awards visual prominence (teal left border) | 20 min |
| 10 | Fix SLM description — remove dimensions from lead | 10 min |
| 11 | Add staggered page load animation | 45 min |
| 12 | Add project card hover micro-interaction | 30 min |
| 13 | Add case study arrow nudge | 15 min |
| 14 | Add nav active state on scroll | 45 min |
| 15 | Reading Room card treatment + two-column grid | 1 hour |
| 16 | Proof artifacts (Langfuse screenshot, loss curve) | 2 hours |
