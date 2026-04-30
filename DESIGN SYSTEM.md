DESIGN SYSTEM

# 🧠 WHAT YOU’RE BUILDING

Your site should no longer be:

> pages with styles

It should be:

> **tokens → primitives → components → layout**

That’s how teams at Vercel and Stripe operate.

---

# 1. DESIGN TOKENS (FOUNDATION — NON-NEGOTIABLE)

If this layer is messy, everything above it breaks.

---

## 🎨 Colors

```css
:root {
  /* base */
  --bg: #0A0A0A;
  --surface: #111111;

  /* text */
  --text-primary: #FFFFFF;
  --text-secondary: #A1A1AA;
  --text-tertiary: #71717A;

  /* borders */
  --border-default: #1F1F1F;
  --border-hover: #2A2A2A;

  /* accent */
  --accent: #4F46E5;

  /* states */
  --hover-bg: rgba(255,255,255,0.02);
}
```

👉 Rule: If you ever hardcode a color again, you’ve already broken the system.

---

## 📏 Spacing

```css
:root {
  --space-1: 8px;
  --space-2: 16px;
  --space-3: 24px;
  --space-4: 32px;
  --space-5: 48px;
  --space-6: 64px;
  --space-7: 80px;
  --space-8: 96px;
}
```

👉 No random spacing. Ever.

---

## 🔤 Typography

```css
:root {
  --font-sans: 'Inter', sans-serif;

  --text-xs: 14px;
  --text-sm: 16px;
  --text-md: 18px;
  --text-lg: 24px;
  --text-xl: 36px;
  --text-2xl: 56px;

  --leading-tight: 1.1;
  --leading-normal: 1.6;
}
```

---

## 🎯 Radius + Motion

```css
:root {
  --radius-sm: 8px;
  --radius-md: 12px;

  --transition-fast: 0.18s ease;
  --transition-base: 0.2s ease;
}
```

---

# 2. PRIMITIVES (LOW-LEVEL BUILDING BLOCKS)

These are your “atoms”. Keep them dumb and reusable.

---

## Container

```css
.container {
  max-width: 1120px;
  margin: 0 auto;
  padding: 0 var(--space-2);
}
```

---

## Stack (vertical spacing system — CRITICAL)

```css
.stack > * + * {
  margin-top: var(--space-3);
}
```

👉 This alone removes 50% of spacing bugs.

---

## Text styles

```css
.text-primary { color: var(--text-primary); }
.text-secondary { color: var(--text-secondary); }
.text-tertiary { color: var(--text-tertiary); }
```

---

## Surface

```css
.surface {
  background: var(--surface);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-md);
}
```

---

# 3. COMPONENTS (WHERE YOUR CURRENT SITE BREAKS)

Now we formalize what you already have.

---

## 🔳 Card (your project cards)

```css
.card {
  padding: var(--space-3);
  background: var(--surface);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-md);
  transition: var(--transition-base);
}

.card:hover {
  transform: translateY(-2px);
  border-color: var(--border-hover);
  background: var(--hover-bg);
}
```

---

## 🔘 Button

```css
.button {
  padding: 10px 16px;
  border-radius: var(--radius-sm);
  background: var(--text-primary);
  color: var(--bg);
  transition: var(--transition-base);
}

.button:hover {
  opacity: 0.9;
}
```

---

## 🏷 Tags

```css
.tag {
  font-size: var(--text-xs);
  color: var(--text-secondary);
  border: 1px solid var(--border-default);
  padding: 4px 8px;
  border-radius: 999px;
}
```

---

## 🔗 Links (important for polish)

```css
.link {
  position: relative;
  color: var(--text-primary);
}

.link::after {
  content: "";
  position: absolute;
  width: 0%;
  height: 1px;
  bottom: -2px;
  left: 0;
  background: currentColor;
  transition: width var(--transition-base);
}

.link:hover::after {
  width: 100%;
}
```

---

# 4. LAYOUT SYSTEM (THIS IS WHERE YOU LEVEL UP)

Stop manually spacing sections.

---

## Section wrapper

```css
.section {
  padding: var(--space-8) 0;
}
```

---

## Section header

```css
.section-header {
  margin-bottom: var(--space-4);
}
```

---

## Grid (projects)

```css
.grid {
  display: grid;
  gap: var(--space-3);
}

.grid-2 {
  grid-template-columns: repeat(2, 1fr);
}
```

---

# 5. PAGE STRUCTURE (HOW YOUR SITE SHOULD BE BUILT)

Now everything becomes predictable.

---

## Hero

* `.section`
* `.container`
* `.stack`

---

## Projects

* `.section`
* `.container`
* `.section-header`
* `.grid grid-2`
* `.card`

---

## Contact

* `.section`
* `.container`
* `.stack`

---

👉 No custom styling per section unless absolutely necessary.

---

# 6. WHAT YOU FIX BY DOING THIS

Right now your site:

* repeats styles
* has slight inconsistencies
* depends on manual tuning

After this:

* everything is reusable
* spacing becomes automatic
* UI becomes predictable

------------------------------------------------------------------------------------------------------------------------------------------
pixel level audit

# 🔍 1. GLOBAL GRID — YOU DON’T HAVE TRUE DISCIPLINE YET

## Problem:

Your layout *looks* aligned, but it’s not mathematically tight.

---

## Fix (lock this system):

### Container:

```css
.container {
  max-width: 1120px;
  padding-left: 24px;
  padding-right: 24px;
  margin: 0 auto;
}
```

---

### Grid baseline:

Use **8px system ONLY**

Everything must snap to:

> 8 / 16 / 24 / 32 / 40 / 48 / 64 / 80 / 96 / 120

If anything is 18px, 22px, 27px → you’re leaking quality.

---

# 🔍 2. HERO — PIXEL IMBALANCE

## Problems:

* Headline top spacing slightly tight
* CTA cluster too close to text
* Vertical rhythm not breathing enough

---

## Fix:

```css
.hero {
  padding-top: 120px;
  padding-bottom: 128px;
}

.hero h1 {
  margin-bottom: 24px;
}

.hero p {
  margin-bottom: 32px;
}

.hero .cta {
  gap: 16px;
}
```

---

## Optical adjustment:

Your headline *looks* centered, but visually it sits slightly high.

👉 Add **+8px padding-top** beyond what feels “correct”

---

# 🔍 3. TYPOGRAPHY — SUBPIXEL PROBLEMS

## Problem:

Your typography is correct in scale, but **optically unbalanced**

---

## Fix:

### A. Letter spacing for headings

```css
h1 {
  letter-spacing: -0.02em;
}
```

Without this → headings feel bulky.

---

### B. Paragraph alignment polish

```css
p {
  max-width: 680px;
}
```

Right now some lines overshoot → breaks reading flow.

---

### C. Heading → body spacing inconsistency

Standardize:

```css
h2 {
  margin-bottom: 16px;
}

p + p {
  margin-top: 16px;
}
```

---

# 🔍 4. PROJECT CARDS — MICRO MISALIGNMENTS

## Problems:

* Internal padding slightly inconsistent
* Text + tags spacing not locked
* Hover feels slightly abrupt

---

## Fix:

### Card padding (lock it):

```css
.card {
  padding: 24px;
  border-radius: 12px;
}
```

---

### Internal spacing:

```css
.card h3 {
  margin-bottom: 8px;
}

.card p {
  margin-bottom: 12px;
}

.card .tags {
  gap: 8px;
}
```

---

### Hover tuning:

```css
.card {
  transition: transform 0.18s ease, border-color 0.18s ease;
}

.card:hover {
  transform: translateY(-2px);
}
```

If animation > 0.25s → feels sluggish
If < 0.15s → feels sharp/cheap

---

# 🔍 5. SECTION ALIGNMENT — YOU HAVE DRIFT

## Problem:

Some sections are **not perfectly aligned to the same vertical start line**

This is subtle, but deadly.

---

## Fix:

Every section must follow:

```css
section {
  padding-top: 96px;
  padding-bottom: 96px;
}
```

---

### Then override:

```css
.hero { padding-top: 128px; }
.contact { padding-bottom: 64px; }
```

---

## Critical:

Check left edges:

* headings
* body text
* cards

👉 They must align **pixel-perfect vertically**

No 1–2px drift.

---

# 🔍 6. VISUAL WEIGHT DISTRIBUTION — CURRENTLY OFF

## Problem:

Your page feels slightly **top-heavy**

---

## Fix:

### A. Add more breathing before projects

```css
.projects {
  margin-top: 48px;
}
```

---

### B. Reduce density at bottom

```css
.contact {
  margin-top: 64px;
}
```

---

### C. Footer spacing

```css
footer {
  padding-top: 48px;
  padding-bottom: 48px;
}
```

---

# 🔍 7. COLOR — MICRO CONTRAST ISSUES

## Problem:

Your UI is dark, but not layered enough

Everything sits on same depth plane.

---

## Fix:

### Background layers:

```css
.card {
  background: #111111;
}

body {
  background: #0A0A0A;
}
```

---

### Border system:

```css
.card {
  border: 1px solid #1F1F1F;
}

.card:hover {
  border-color: #2A2A2A;
}
```

---

### Text hierarchy:

```css
.primary { color: #FFFFFF; }
.secondary { color: #A1A1AA; }
.tertiary { color: #71717A; }
```

---

# 🔍 8. INTERACTION TIMING — YOU’RE NOT CONSISTENT

## Problem:

Different elements feel like they belong to different systems

---

## Fix:

### Standardize ALL transitions:

```css
:root {
  --transition: all 0.2s ease;
}

* {
  transition: var(--transition);
}
```

---

Then override only when necessary.

---

# 🔍 9. EDGE ALIGNMENT TEST (YOU PROBABLY FAIL THIS)

Do this:

👉 Zoom to 100%
👉 Scroll slowly

If anything “wiggles” or feels off → alignment is broken.

---

## Common issues you likely still have:

* Text not aligned with cards
* CTA not aligned with grid
* Section titles slightly offset

Fix manually. No shortcuts.

---

# 🔍 10. FINAL MICRO DETAIL (THIS IS ELITE LEVEL)

## Add this:

### Slight optical center correction

```css
.container {
  transform: translateX(-2px);
}
```

Sounds insane.
But this compensates for visual imbalance in many layouts.

Use only if needed after testing.

------------------------------------------------------------------------------------------------------------------------------------------
implementation corrections

---

# 2. TYPOGRAPHY — YOU’RE 70% THERE, BUT STILL LACKING CONTROL

### What you fixed:

* Font choice is cleaner
* Hierarchy exists

### What’s still wrong:

You’re treating typography as **consistent**, not **expressive**.

Right now:

> everything feels equally important → weak hierarchy signal

---

## Exact changes:

### A. Reduce reading width (this is critical)

Your paragraphs are still stretching too wide.

**Fix:**

```css
max-width: 680px;
```

Apply this to:

* all body text blocks
* project descriptions
* “about” / long-form sections

---

### B. Increase vertical separation after headings

Right now headings and text feel glued.

**Fix:**

```css
h2 {
  margin-bottom: 20px; /* increase if needed */
}
```

---

### C. Introduce hierarchy tension

Right now:

* H2 and body feel too close

**Fix:**

* Increase H2 weight OR size slightly
* OR reduce body opacity slightly

Example:

```css
h2 { font-weight: 600; }
p { color: #A1A1AA; }
```

---

### D. Paragraph rhythm

Break long text into tighter chunks:

* Max 2–3 lines per paragraph
* Add spacing between them

---

### What you're aiming for:

![Image](https://images.openai.com/static-rsc-4/jL0PetcOGR209KqCfrP5PjYuEWHy9JZm6Lj1p7KE4GhXJNpd8m0SBezr0RZvBUSTJGGyRQSzFSPNp7_MsL7IT_G7TopHmstBJv8tPQe7pC9yAS0FZLI1BRk2kzaLKxRl9OM2oV35GaDcTlW_ZQBpia1pDPxgE_JnVh-A0esvloXWcPHtn00j6YDIn8VXaoLV?purpose=fullsize)

![Image](https://images.openai.com/static-rsc-4/V-uSlZxZY4_G6f89tTvQcyQGsh0GNGXutituelpBnDgHN4yqnQKJ159grOK-udNzAGkBU1KfBay9H5dDkKzzuPUbG6y3flOMR_gIRvk54FhTvLFcz6byM0uazRWBSjeuhHcqlyZxOSI5pf7iDCTX2_2hZ_CcQwqYSMAmx-NTBwjqZFQgcAX7GUsCRbIl0WAs?purpose=fullsize)

![Image](https://images.openai.com/static-rsc-4/HKppIW1zpq3bYW39SjaVqaSlaKrOWtoJbgkeiE1Hhdfi-7fx69-i3JAX9M0Rby3JR_SW8mel15wT7VYcnt9r639UCH7TFfhiawh6LG6woG6wt4rv-BYJVS5Ch1SCo58DUIM8G-fYuWFXsy2HqH4HkP5wpk7KOlyVbn6SrFzCcAbQ7ALOBgcPXfToka9loBg1?purpose=fullsize)

![Image](https://images.openai.com/static-rsc-4/6aPTUe_0ujEPqr3qsAerxjJPVYXPDcRRAobz3zLfJOCmmQ-pM0GG6h-Ogxg7TK5NxljaovIJnoCDCiReBYNaTKYQ-MIkElUkxjGf79lJ7D2gJfwAgbh7IRr8VfjRe0oSFA6R7vfqDfrijfPLK8miWfcNoE6TkJxLKorisRfFylwJqYIigi7UmVndeir1eZXV?purpose=fullsize)

![Image](https://images.openai.com/static-rsc-4/M22Bopv15MNPAB9q7LfBYzmkR3Cy8cvuILBD4EzolOLOSAdMtjuIeA3apVdBt3LeX2JVfMLKJUuK5uG45ixjWIGAzLAvUPj48zL-L4frDGK9hZxP_CzmisKRgnrjBLAslII9f19PUx0B3in8NV0E5uUSrazqfIhFdaAz4K1djZDEz0nnZ_MqvpxD14w-D8ZV?purpose=fullsize)

![Image](https://images.openai.com/static-rsc-4/Savisd0HQ9j4fvZqGsifu2lrbUBIZ33T6OIob-Mg8dvYYQjSxTo4PiKZFcVOVD39J7dINkFhC0ZpR9l6KHJhlkztwcF_iA-CYOSxAvEoKmOnsVmYSBT6Z0EKrYaiIT0e93uKzzoiyTDOWUqEpi399yUBggGzlcW-SSM2wb3yRtWw4rUt2FDXRxBnJIwlankg?purpose=fullsize)

![Image](https://images.openai.com/static-rsc-4/ZqvJloJRzNU5UU22n96u9WMu9VQtLb9aLcGC0TyJdanj4wtlgIYoLg2EaylmXwiPC-Vp113ZsdOr23WhIczWOileC-uCuw89r8id8XKJ577m8eGJq8x69V9SmVpSVQYmKfWJxzuWq3NSqoK7Bm4HsBrj_8M-n261MnlfGys6YviEmBlg-qRtoBgSQhJ0i_JM?purpose=fullsize)

---

# 3. SPACING — STILL TOO UNIFORM (THIS IS WHY IT FEELS FLAT)

### Current issue:

Spacing is consistent → but **emotionally flat**

You’ve built a grid, not a rhythm.

---

## Exact changes:

### A. Increase hero bottom spacing

Right now it exits too early.

**Fix:**

```css
.hero {
  padding-bottom: 120px;
}
```

---

### B. Reduce spacing inside project grid

Projects should feel tighter than hero.

```css
.projects {
  gap: 24px; /* not too airy */
}
```

---

### C. Increase separation between major sections

```css
section {
  margin-top: 100px;
  margin-bottom: 100px;
}
```

Then override selectively:

* Hero → bigger (120–140px)
* Contact → smaller (60–80px)

---

### D. Add breathing ABOVE section titles

Not just below.

```css
.section-title {
  margin-top: 40px;
  margin-bottom: 16px;
}
```

---

### What you're aiming for:

![Image](https://images.openai.com/static-rsc-4/ZmXtwRo8Hgbj7PoKIJJIJ1U4b0VKHdx1_U8NtC7JiioeUBdf4IdIJEFlnmp-IS38bN3lldadnqAL0yktjhV7a16u-buxWlyEXPHXtM84Ob6AXCvbDXE-iixYJDFjq8XBW2CM74g12aP7W0vupNmW17wyVZRQOcVKnVEc8qUjaEbNa443c1eUZ9puLVXxsGGR?purpose=fullsize)

![Image](https://images.openai.com/static-rsc-4/3GegaVONG9sZxlwzrSqj8lP5g7cxPhdo6tBvKH6BsOlWxhIvOsfTWpxplw-7kW003tr-jt0q7vYnLyEHvPU4CdxJttvTvBnNMPhVP20Q7uWPMjHNn_WxORKqU8nkdg2oIJc15fKuNdyakSnuMYoQpLj2CyahcjvLlZJ3dVlKkH9cXQa0pRicY1dRIsb3WCx6?purpose=fullsize)

![Image](https://images.openai.com/static-rsc-4/lOA0SqiByqFfNkGjyUMEMUuPQ7OW9GbN7zaYiulhU8lSaJaoDaEsnbZItNR17FfAR9ueYg8QjA0UC37XqtWKQkQUokHmgVy0HDgAB5peBY5TCK_aHZNMLnzA2DWVzcZod1x-chJ6AugpLkhkfV9Ewb1LHNyouMIsh0XidxGtYG26kDgEI1YF2CiSBhWh6ckj?purpose=fullsize)

![Image](https://images.openai.com/static-rsc-4/SuI3yqobNRmI25kwVLFnrQHl-UbAnaGIsX9Aor4ehwpu_EZniz_lhDbpiOYGAougGTdUsmbrYbAwCLzDaQ04k8i5SGarxyL1i140hX90gCBFuN4TVB-0Sn2_0fG71RhLx26JWRrIgxZSCjSvyj0u74Yqqu3NGoMlvW-9DT4pa9TzFVVBDA1z1oqD7e9oC9sE?purpose=fullsize)

![Image](https://images.openai.com/static-rsc-4/M9VbGYeGel5yLHjg6kxwsqoxj-P2CS3b0adBvleRi_j94yDNwHTBtesdInLKOhhBaxowqYtOkniMqVwTe3lOKXVKtd_KUx08cFWyf_m-_KK_jeEHgs-lERiBJBINiGLV2Xhp58k8oNJ6L1Gma2N0DtPWOANabeTObbN46YcSXq2aUJ4zt5Zyts3Z8lTMe0io?purpose=fullsize)

![Image](https://images.openai.com/static-rsc-4/IsWVZutwBU3t_tdjxBVa-I5JtsAmbunGKOmm3BGO5gh0RMIWHCecr-f_Jo1iw6bjCMXvzIR1-lXkGUlb67DoIk0dTWuFsq9FXcX4Jnbwb0bPzq9EL-f67qWLGKe5nfa1Ds1BthvhXyd1jWMrez-4d4SPWXkZKssi-ORCLYPkNH-Y8p3MYIgf6losaBsERhT6?purpose=fullsize)

![Image](https://images.openai.com/static-rsc-4/BS5sBoECxPnY44LP7uXeYgL24leZMRTXWi8qKBWUH3IoppqVRZNX1A70H0jmpXoHckxRNzmwVCJoxH3R6VmVgE2wyJ2DY7iKsGa3T94gmPj7ibuIh-dnX-hbPXbAbxIIuNwDi8QHY0ZNJgo36ge82XrhqtN6EyeOjCzuJwM14rhYoLDLLCnS6q4ttkNYrn7T?purpose=fullsize)

![Image](https://images.openai.com/static-rsc-4/WWn90NNsVvbm-J7B3nMrTpspL7XZ9UkYWEWlvUTF_0S31LiWqlGfTYm4NW293TKw9tCgcRdVKiPY4bDANIzy_r0ttN8kFKwuQ7faVcNp4MktsW6yCF9Wm8E55Nt6Ew7fRMNCiNckDufzAHBx25uT29e2YEBqtmY0wWBpULKaTuPpjpQTqRnSceLtDK-Qd92E?purpose=fullsize)

---

# 5. FOOTER — ADD SIGNATURE (THIS IS YOUR PERSONALITY HOOK)

Right now your site ends like a template.

That’s a waste.

---

## Exact change:

### Add this line in footer (small text, low emphasis):

> Built with intent. Iterated with taste.

---

### Styling:

```css
.footer-note {
  font-size: 13px;
  color: #71717A;
  margin-top: 24px;
}
```

---

### Placement:

* Below contact
* OR bottom-most line

---

### Important:

Don’t center it if rest of site is left-aligned.

---

# 7. INTERACTIONS — STILL TOO STATIC

Right now:

> usable, but dead

No feedback → no polish

---

## Exact changes:

### A. Project card hover

```css
.card {
  transition: all 0.2s ease;
}

.card:hover {
  transform: translateY(-2px);
  border-color: #3F3F46;
}
```

---

### B. Add subtle background shift

```css
.card:hover {
  background: rgba(255,255,255,0.02);
}
```

---

### C. Links (very important)

Right now links feel default.

Add:

```css
a {
  position: relative;
}

a::after {
  content: "";
  position: absolute;
  width: 0%;
  height: 1px;
  bottom: -2px;
  left: 0;
  background: currentColor;
  transition: width 0.2s ease;
}

a:hover::after {
  width: 100%;
}
```

---

### D. Button feedback

```css
button:hover {
  opacity: 0.9;
}
```

---

### What you're aiming for:

![Image](https://images.openai.com/static-rsc-4/DJIGJc3ZGI47xHzcYbiRAHKEwOCktDHrYu-T2DFpJGhWfqS6OT1giTbt2qU7baM30hq_6n4xO_RUcXLgT5IZNhfP69iQB7DGw1hIzYQJI0DIhMqQWzQ9nr7Inv1aLYaJMs1rLhYNXWsKdXsFkPOgekhzGaoUt042EHdl4QRRT0bVgWK_fkH1rcBFTGAq4t1V?purpose=fullsize)

![Image](https://images.openai.com/static-rsc-4/CT2G8LO5X6GtTRNyy6Zj_Z2hG1y3rb-I3K_8rjh5LwDSKpiC4eR0jEKErtHW_pNp7mr7OQ7R4_A6GsIdl9Wo649ktd9XYljWpac5HCtFylm2jcgsu9nZUywbJHsjB19NEl_HOFekZnuSdodco-LNgwx8bIHNbygy2V8dxnQW3jP9rYwmbFZY1JMLnFYSZGkU?purpose=fullsize)

![Image](https://images.openai.com/static-rsc-4/2y-VScEcJmjE09juNjUvIH1iYHTcBWt88HG7GgE0st1WrR7H3-jzZVIqkfiRiQrMhj19tF0f5yUt3BclhISVHnctsw_kRDucC_69L15T9zJiHa8p3Paf0kRWGN8DSgKV2P6PDL0u10SJ_87FiPgiEQalXK_hALqhmLYYtuFndAwB6n4gmE91sz2EqdA4MyH0?purpose=fullsize)

![Image](https://images.openai.com/static-rsc-4/R7khQ3LhBrFAvGaUX8EbAfXFGzw6fKfgK7NctHYeRwNxlJHSDBUavWdtRut0P9fTd939_gFLYa-Es8J6Qh8hD0fU-q6OGO4zdIXpRbrNj0zhJIbuXvJD2qXpkjVIXrqLULyqFR64_UoTIuAxWsYCI-6Sip9OxiHZj6BT-bXsMM9IS0kfuBfflJGb3uR_H3C_?purpose=fullsize)

![Image](https://images.openai.com/static-rsc-4/QVpSBeOUKvvmBYlhS_5ZfOL5BIMI25VmuMb9P-YATmpUFQH4C5L-_I9tPEDTUqE7LyfPgRTRLit40SiaGOMe0_Mav77r74GOC7lmdoemR-h6yPDf9zLpFCWrO07gSUd9ZillHbOIo9cVHM8QE488Bju4Gh0ZfkfavXLskJo0w5v5Zqb9dI4Ucu_FHon1c-o5?purpose=fullsize)

![Image](https://images.openai.com/static-rsc-4/ttyLMP1qdQjma0Nrmpk8LQu-73INztSM2vLLS-BRtKP5ZuQEzLhYH9TQS-eeeayGMUcUKPFCu5Pp1vuJXGJ05YgmEBdwaDQzz_41G5_POPvUA8cby_LdGIxDwHtMreKqn_7N5d8tXrnftthOZTpjUA06AU6L6YGt0UbShb8-70nEBvVHQrtgl0RPnGuEd3gk?purpose=fullsize)

---

# 8. COLOR — CONTROL IS STILL SLIGHTLY LOOSE

### Current issue:

You’re close, but:

* Accent usage is slightly inconsistent
* Contrast could be sharper

---

## Exact changes:

### A. Lock color system

```css
:root {
  --bg: #0A0A0A;
  --text: #FFFFFF;
  --muted: #A1A1AA;
  --accent: #4F46E5;
}
```

---

### B. Restrict accent usage

Only use accent for:

* links
* hover states
* active elements

NOT:

* headings
* body text

---

### C. Improve divider clarity

```css
.divider {
  border-color: #1F1F1F;
}
```

---

### D. Subtle hover tint

```css
.card:hover {
  border-color: #27272A;
}
```

---

### What you're aiming for:

![Image](https://images.openai.com/static-rsc-4/zqX8i2k0yxIFVuZ9A79nJf2rtXSefmk1lWipF-U2Sx9b8aTTYBToSYV4QvQe9PNRIBWfJNML0MYZNy-0jcp7NvtNXuv_bat1L6igDGuvMaVXnRBJTUkZ5TTFkYz-i3T7X6oPMmia2H4rHIVr4UVcUBhjRerNQbmOdaLzW6mnrfY2WtozVv6zKmkVc5bDAoYu?purpose=fullsize)

![Image](https://images.openai.com/static-rsc-4/Dv63q_fvR7BopXQkmB1ex3FazUJ70UvvkEdvAYYBkXWlHmv6nLa2zKbtxH_cxh6MpRIrgNOqjALlJU-AvIGuXmhAKwXiyTskKRoXexjovvlgiaZxXq_X_0V9RmjlfMHfk-1NaDax3t0PDbAoFhVDofNcgOa10jbSvciIKVOh2OPs1MRL8n7qV5AYrpF6zdoD?purpose=fullsize)

![Image](https://images.openai.com/static-rsc-4/usazC7aNjPM4kk5J7XIJhmMeU6q2xugVwoLqmKCCcEeMm27rkfF4oH93mmiDSPO_5CfyXkIqK3R30tenKTmo0t-7eUFEcj1k6clta604qUkThqkrL_dxe3PgjpnyCRv-l8JobyIqJ3DEDKmbBr7fQpIGjv7AZB6sFyX6mZSf2bQPhatXXjKvt2cvVF7PRJzn?purpose=fullsize)

![Image](https://images.openai.com/static-rsc-4/CUb4AovHOhByIExkI89ogxe--RcfDxwybIFAV9_Qbg4PmncX63fA0FHhyYKwvdY4SaPGD8x4LyJuaaEd4sEjLj9f51rxaYoKX7LluiNk4ZtUtjx1_dv19EhNNf30RcRaSbMz_6lTFFjjVlyjMTkOcvPxCljLovCEACZ5_G-hjPitMwnZYDXjjaboNHvdyrHX?purpose=fullsize)

![Image](https://images.openai.com/static-rsc-4/iWbjf2XT7y7lJV93D_z65z0Nm9CXCv3QVJX52b3LEm7a8-ihL4wnIbi9SefIxXz1Tf90-H2d803wq19uDxuxwFJylX8rV0yPjH23VagDrxlDWaoD9tXMXnsuvP0yqF3PC9FvoQ0lUG3Y8PjFLHSgDpDXPnqGeDKIGttH34XZasvXCnrW7FDhk6XL__Fhkyzi?purpose=fullsize)

![Image](https://images.openai.com/static-rsc-4/O9O95Rl1dkCgQy1XMBojsphPTUwpi69sKCym0IXD8MQ250ms_FTSf21tVOGaxd8tG7V71doAmNpkMLTZ6gsfzX1wCPSaJs4AGVSjhfg7JDUdms1FlvVhRTop-jse4HM8QW6YG_t7gvytHvIBbGzAc9Lthldx-mEK_MgZEHVcinglsf2pmMwj-h4fjSQS85lM?purpose=fullsize)

![Image](https://images.openai.com/static-rsc-4/NnRyp9LTBxmz0o1Reqfe6t1xFCwzlgPbbSdaoEWG-QRnOiW1Z0-YmOoVLMcjcnTsQnvS7UP0Ii9L8nvpCHHDQkXoSRBeRhi9KWa-ZSMKho8tB3H24_cBR1xc_0-MpfTaes-AUTkZc9uPrvBSet4VO6kzb5MLFFF-LJKY2WWv6AcaTcwFfdWhSiuaklLLKjtP?purpose=fullsize)

---






