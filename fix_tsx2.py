import re

with open("src/app/components/HomeClient.tsx", "r") as f:
    text = f.read()

text = text.replace(
    '<span className="type-t6 text-accent">Open to residencies &amp; fellowships</span>',
    '<span className="pulse-pill">Open to residencies &amp; fellowships</span>'
)

# Project Hooks
text = re.sub(r'<div className="type-t4 text-t2 mb-4 italic">\s*(Every LLM course.*?)</div>', r'<div className="project-hook">\1</div>', text, flags=re.DOTALL)
text = re.sub(r'<div className="type-t4 text-t2 mb-4 italic">\s*(Medication errors.*?)</div>', r'<div className="project-hook">\1</div>', text, flags=re.DOTALL)
text = re.sub(r'<div className="type-t4 text-t2 mb-4 italic">\s*(LLMs can reason.*?)</div>', r'<div className="project-hook">\1</div>', text, flags=re.DOTALL)
text = re.sub(r'<div className="type-t4 text-t2 mb-4 italic">\s*(The constraint was.*?)</div>', r'<div className="project-hook">\1</div>', text, flags=re.DOTALL)

# Section Numbers
text = re.sub(r'<div className="type-t6 mb-1">(\d{2})</div>', r'<div className="mb-2"><span className="section-label">\1</span></div>', text)

# Ghost numbers for How I Think
text = text.replace(
    '<div className="type-t6 font-mono text-accent mb-1">{step.num}</div>',
    '<div className="ghost-number">{step.num}</div>'
)

# Add relative to thinking-step-content so the absolute ghost-number binds to it
text = text.replace('<div className="thinking-step-content">', '<div className="thinking-step-content overflow-hidden relative">')

# Hybrid typography words replacements
# The prompt says: Within body text (T4), swap select nouns/phrases to font-family: var(--font-display)
# Target: 1-2 hybrid swaps per paragraph. Implementation: wrap with <span className="display-inline">word</span>

hybrids = {
    "autoregressive transformer": '<span className="display-inline">autoregressive transformer</span>',
    "borrowed tokenizers": '<span className="display-inline">borrowed tokenizers</span>',
    "agentic AI systems": '<span className="display-inline">agentic AI systems</span>',
    "full-stack multi-agent": '<span className="display-inline">full-stack multi-agent</span>',
    "orchestration pipeline": '<span className="display-inline">orchestration pipeline</span>',
    "MCP (Model Context Protocol)": '<span className="display-inline">MCP (Model Context Protocol)</span>',
    "software-defined radio": '<span className="display-inline">software-defined radio</span>',
    "anti-drone detection": '<span className="display-inline">anti-drone detection</span>',
    "passive detection": '<span className="display-inline">passive detection</span>',
    "lightweight ML classifier": '<span className="display-inline">lightweight ML classifier</span>',
    "Hardware integration": '<span className="display-inline">Hardware integration</span>',
    "Signal processing fundamentals": '<span className="display-inline">Signal processing fundamentals</span>'
}

for k, v in hybrids.items():
    text = text.replace(k, v)


with open("src/app/components/HomeClient.tsx", "w") as f:
    f.write(text)

with open("src/app/globals.css", "a") as f:
    f.write("\n.pulse-pill {\n  font-family: var(--font-body);\n  font-weight: 500;\n  font-size: 11px;\n  text-transform: uppercase;\n  color: var(--t1);\n  padding: 4px 10px;\n  background-color: var(--surface);\n  border-radius: 4px;\n  border-left: 2px solid var(--emerald);\n  box-shadow: var(--shadow-sm);\n  position: relative;\n  display: inline-flex;\n  align-items: center;\n}\n\n.pulse-pill::before {\n  content: '';\n  position: absolute;\n  left: -2px;\n  top: 0;\n  bottom: 0;\n  width: 2px;\n  background-color: var(--emerald);\n  animation: border-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;\n  border-radius: 2px 0 0 2px;\n}\n\n@keyframes border-pulse {\n  0% { opacity: 1; box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.4); }\n  70% { opacity: 0.5; box-shadow: -4px 0 10px 2px rgba(16, 185, 129, 0); }\n  100% { opacity: 1; box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }\n}\n\n.project-hook {\n  font-family: var(--font-body);\n  font-style: italic;\n  font-size: 17px;\n  color: var(--text-2);\n  margin-top: 10px;\n  margin-bottom: 16px;\n}\n")

