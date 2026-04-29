# Contextual Chat System — Execution Plan
### Text Selection + Ambient Chat · pranavdhiran.me

---

## The Mental Model

Two entry points. One system underneath.

```
Entry A — Ambient pill (bottom-right)
  Always there, nearly invisible
  For: "I have a question about this person"

Entry B — Text selection popup
  Appears only when user selects text
  For: "I'm reading this and want to go deeper"
```

Both open the same chat drawer. Both pass context to the same agent.
One system, two natural triggers.

---

## Entry A — The Pill (Redesigned)

### Default State
```
Position: fixed, bottom: 24px, right: 24px
Shape: small circle, ~40px diameter (not a pill)
Background: rgba(10,10,10,0.9), backdrop-blur
Border: 1px solid rgba(255,255,255,0.08)
Content: ✦  (just the icon, no text)
Animation: very slow rotation, 8s loop, subtle — like a compass needle settling
```

### Hover State
```
Border brightens to rgba(13,148,136,0.5)
Text fades in to the LEFT of the circle (not inside):
  "wonder anything?"  ← this is the copy
Font: 12px, muted, tracking wide
Animation: opacity 0→1, translateX(4px)→0, 200ms ease
```

**Why "wonder anything?"**
- Not a CTA, not a label — it's an invitation
- Signals curiosity, not support
- Sounds like a person, not a product
- Nobody reads it unless they hover, so it can be a little unexpected

### Clicked State
```
Circle morphs into drawer (Framer Motion layoutId)
Same origin point, expands up and left
```

---

## Entry B — Text Selection Popup

### The Interaction
```
1. User selects any text on the page
2. Small popup appears above the selection, centered on it
3. Popup: [ ✦  Ask about this ]
4. User clicks → drawer opens, selected text becomes context
5. Suggested input pre-fills: "You selected: [text]" as context
   Input placeholder: "What do you want to know about this?"
6. If user ignores → popup disappears on next click/scroll
```

### Popup Design
```
Width: auto, ~160px
Height: 32px
Background: #0a0a0a
Border: 1px solid rgba(13,148,136,0.5)
Border-radius: 8px
Content: [✦] [Ask about this]
Font: 11px, off-white, tracking: 0.04em
Arrow: small 6px triangle pointing down, same bg color

Position: 
  Top: selection.top - 44px (8px gap above selection)
  Left: selection.left + (selection.width / 2) - 80px (centered)
  
Animation:
  In:  opacity 0→1, translateY(4px)→0, 150ms ease
  Out: opacity 1→0, 100ms ease
  
Dismiss triggers:
  - Click anywhere else
  - Scroll > 40px
  - Selection is cleared
  - Drawer opens (popup is no longer needed)
```

### What Counts as Selectable
Everything. Project descriptions, paper titles, hook lines, "How I Work" prose, education details, certification names. The whole page is a surface.

### Edge Cases
```
Selection < 3 chars → no popup (accidental clicks)
Selection > 300 chars → truncate context to 300 chars, pass full to agent
User selects across card boundary → still works, treat as single context
Mobile long-press → same popup, positioned above selection handles
```

---

## How Context Passes to the Agent

When text selection triggers the chat:

```typescript
// The message sent to the agent is constructed like this:

const contextMessage = `
The user selected this text from your portfolio:
"${selectedText}"

Their question: ${userInput}

Answer in context of what they selected. 
Be specific to that excerpt, not generic.
`;
```

This means the agent answers about *exactly* what the user was reading — not a generic response about the whole portfolio.

**Example:**
```
User selects: "ChromaDB RAG for drug interaction retrieval"
Popup appears → user clicks "Ask about this"
Drawer opens
Placeholder: "What do you want to know?"
User types: "why ChromaDB specifically?"

Agent receives context: the selected text + the question
Agent responds: "I needed a lightweight embedded vector DB — 
ChromaDB runs in-process, no separate server, perfect for a 
Vercel deployment where I couldn't manage infra..."
```

---

## Unified Chat Drawer

Both entry points open the same drawer. The only difference is whether it opens with a pre-filled context or blank.

### Blank state (pill trigger)
```
Suggested prompts visible:
  "What's your strongest project?"
  "What are you looking for?"
  "How do you approach building?"
  "Tell me about your research interests"
```

### Context state (selection trigger)
```
Selected text shown at top of drawer as a quote block:
  ┌─────────────────────────────────┐
  │ ❝ ChromaDB RAG for drug         │
  │   interaction retrieval         │ ← quoted, teal left border, italic
  └─────────────────────────────────┘
  [ What do you want to know?    → ]  ← input pre-focused, ready
```

No suggested prompts in context state — the user already knows what they want.

---

## Implementation

### Step 1 — Text Selection Detection

```typescript
// hooks/useTextSelection.ts
import { useState, useEffect } from "react";

export type SelectionState = {
  text: string;
  rect: DOMRect;
} | null;

export function useTextSelection() {
  const [selection, setSelection] = useState<SelectionState>(null);

  useEffect(() => {
    const handleSelectionChange = () => {
      const sel = window.getSelection();
      const text = sel?.toString().trim() || "";

      if (text.length < 3) {
        setSelection(null);
        return;
      }

      const range = sel!.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      setSelection({ text, rect });
    };

    const handleClear = (e: MouseEvent) => {
      // Only clear if click is outside the popup
      const popup = document.getElementById("selection-popup");
      if (popup && popup.contains(e.target as Node)) return;
      setTimeout(() => {
        const sel = window.getSelection();
        if (!sel?.toString().trim()) setSelection(null);
      }, 100);
    };

    document.addEventListener("selectionchange", handleSelectionChange);
    document.addEventListener("mousedown", handleClear);

    return () => {
      document.removeEventListener("selectionchange", handleSelectionChange);
      document.removeEventListener("mousedown", handleClear);
    };
  }, []);

  return selection;
}
```

### Step 2 — Selection Popup Component

```typescript
// components/chatbot/SelectionPopup.tsx
import { motion, AnimatePresence } from "framer-motion";
import { SelectionState } from "@/hooks/useTextSelection";

type Props = {
  selection: SelectionState;
  onAsk: (text: string) => void;
};

export function SelectionPopup({ selection, onAsk }: Props) {
  if (!selection) return null;

  const { text, rect } = selection;

  // Position relative to viewport
  const top = rect.top + window.scrollY - 44;
  const left = rect.left + rect.width / 2 - 80;

  return (
    <AnimatePresence>
      <motion.div
        id="selection-popup"
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 2 }}
        transition={{ duration: 0.15 }}
        style={{ top, left, position: "absolute" }}
        className="z-[60] w-40 h-8 flex items-center justify-center
                   gap-1.5 bg-[#0a0a0a] border border-teal-500/50 
                   rounded-lg cursor-pointer select-none
                   text-[11px] text-white/80 tracking-wider"
        onClick={() => onAsk(text)}
      >
        {/* Arrow */}
        <div className="absolute -bottom-[6px] left-1/2 -translate-x-1/2
                        w-0 h-0 border-l-[6px] border-r-[6px] border-t-[6px]
                        border-l-transparent border-r-transparent border-t-[#0a0a0a]" />
        <span className="text-teal-400">✦</span>
        <span>Ask about this</span>
      </motion.div>
    </AnimatePresence>
  );
}
```

### Step 3 — Context State in Drawer

```typescript
// In ChatDrawer.tsx — add context display

type ChatDrawerProps = {
  context?: string;  // selected text, if any
  onClearContext: () => void;
};

// At top of messages area, if context exists:
{context && (
  <div className="mx-4 mt-3 p-3 border-l-2 border-teal-500 
                  bg-white/5 rounded-r-lg">
    <p className="text-xs text-white/40 mb-1 uppercase tracking-wider">
      Selected text
    </p>
    <p className="text-sm text-white/70 italic line-clamp-3">
      "{context}"
    </p>
  </div>
)}
```

### Step 4 — Wire It All Together

```typescript
// In the root layout or page component:

export default function Portfolio() {
  const selection = useTextSelection();
  const [chatOpen, setChatOpen] = useState(false);
  const [chatContext, setChatContext] = useState<string | undefined>();

  const handleAskAbout = (text: string) => {
    setChatContext(text);
    setChatOpen(true);
  };

  const handleChatClose = () => {
    setChatOpen(false);
    setChatContext(undefined);
  };

  return (
    <>
      {/* Portfolio content */}
      <main>...</main>

      {/* Selection popup — renders at absolute position */}
      <SelectionPopup
        selection={selection}
        onAsk={handleAskAbout}
      />

      {/* Chat widget — pill + drawer */}
      <ChatWidget
        isOpen={chatOpen}
        onOpen={() => setChatOpen(true)}
        onClose={handleChatClose}
        context={chatContext}
      />
    </>
  );
}
```

---

## Mobile — Text Selection

Mobile long-press triggers the native selection handles. The popup appears above the selection just like desktop.

**One mobile-specific rule:**
Position the popup to never go above the viewport top. If `top < 60px` (below nav), flip it below the selection instead:

```typescript
const flipBelow = rect.top < 60;
const top = flipBelow
  ? rect.bottom + window.scrollY + 8
  : rect.top + window.scrollY - 44;
```

---

## Build Sequence

```
Day 1
  [ ] Build useTextSelection hook
  [ ] Test selection detection across all page elements
  [ ] Build SelectionPopup component (no wiring yet)
  [ ] Test popup positioning on desktop + mobile

Day 2
  [ ] Add context state to ChatDrawer
  [ ] Build context quote block UI
  [ ] Wire handleAskAbout → opens drawer with context
  [ ] Test full selection → popup → drawer → context flow

Day 3
  [ ] Redesign pill to circle with ✦ icon
  [ ] Add "wonder anything?" hover text animation
  [ ] Framer Motion layoutId for pill → drawer morph
  [ ] QA both entry points together

Day 4
  [ ] Update system prompt to handle context messages
  [ ] Test agent responses with and without context
  [ ] Edge cases: very short selection, very long selection, mobile
  [ ] Deploy + smoke test on live URL
```

---

## The Experience End-to-End

```
Visitor lands on portfolio.
Reads Medaura description.
Pauses on "Langfuse tracing every LLM call".
Selects that phrase.
Popup appears: [✦ Ask about this]
Clicks it.
Drawer opens. Selected text shown as quote.
Types: "why does tracing matter here?"
Agent responds: "Because in a multi-agent system, 
when something breaks, you need to know which agent 
made which decision at what point. Without Langfuse 
I'd be debugging blind..."
Page scrolls to Medaura card and pulses teal.
```

That is the experience nobody else has.
One interaction. Zero UI footprint until needed.
Feels like the portfolio is alive.
