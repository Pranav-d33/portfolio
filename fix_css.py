import re

with open("src/app/globals.css", "r") as f:
    content = f.read()

# 1. Update Imports
if not "api.fontshare.com" in content:
    content = content.replace("@import 'tailwindcss';", "@import url('https://api.fontshare.com/v2/css?f[]=clash-display@400,500,600&f[]=switzer@400,500,401&display=swap');\n@import 'tailwindcss';")

# 2. Update Colors Dark Mode
dark_vars = """  --bg: #0a0a0f;
  --surface: #111118;
  --surface-2: #1a1a24;
  --raised: #1a1a24;
  --border: #2A2A2A;
  --grid: #2A2A2A;
  --text-1: #f1f5f9;
  --text-2: #94a3b8;
  --text-3: #475569;
  --t1: var(--text-1);
  --t2: var(--text-2);
  --t3: var(--text-3);
  --emerald: #10b981;
  --emerald-bg: rgba(16,185,129,0.08);
  --violet: #8b5cf6;
  --accent: var(--emerald);"""

content = re.sub(r'--bg: #0C0C0C;.*?--accent: #D97706;', dark_vars, content, flags=re.DOTALL)

# 3. Update Light Mode (Optionally mapping equivalents, but keeping it simple for now)
# Light mode wasn't explicitly provided, but we can make adjustments to ensure valid css
light_vars = """  --bg: #fafafa;
  --surface: #f1f5f9;
  --surface-2: #e2e8f0;
  --raised: #ffffff;
  --border: #cbd5e1;
  --grid: #cbd5e1;
  --text-1: #0f172a;
  --text-2: #334155;
  --text-3: #64748b;
  --t1: var(--text-1);
  --t2: var(--text-2);
  --t3: var(--text-3);
  --emerald: #10b981;
  --emerald-bg: rgba(16,185,129,0.08);
  --violet: #8b5cf6;
  --accent: var(--emerald);"""
content = re.sub(r'--bg: #F8F8F8;.*?--accent: #D97706;', light_vars, content, flags=re.DOTALL)

# 4. Typography Scale replace classes
typography_css = """/* ───────────────────── Typography Scale ───────────────────── */
.type-t1 {
  font-family: var(--font-display);
  font-weight: 600;
  font-size: clamp(56px, 8vw, 96px);
  letter-spacing: -0.03em;
  line-height: 0.95;
}

.type-t2 {
  font-family: var(--font-display);
  font-weight: 500;
  font-size: clamp(32px, 4vw, 48px);
  letter-spacing: -0.02em;
  line-height: 1.05;
}

.type-t3 {
  font-family: var(--font-display);
  font-weight: 400;
  font-size: clamp(20px, 2.5vw, 28px);
  letter-spacing: -0.01em;
  line-height: 1.1;
}

.type-t4 {
  font-family: var(--font-body);
  font-weight: 400;
  font-size: clamp(17px, 2vw, 20px);
  line-height: 1.65;
}

.type-t5 {
  font-family: var(--font-body);
  font-weight: 400;
  font-size: 15px;
  line-height: 1.7;
  color: var(--text-2);
}

.type-t6 {
  font-family: var(--font-body);
  font-weight: 500;
  font-size: clamp(11px, 1.5vw, 13px);
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.display-inline {
  font-family: var(--font-display);
}

.section-label {
  font-family: var(--font-body);
  font-weight: 500;
  font-size: 12px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--emerald);
}

.ghost-number {
  position: absolute;
  top: 10px;
  right: 15px;
  font-family: var(--font-display);
  font-weight: 600;
  font-size: clamp(60px, 8vw, 96px);
  color: rgba(255, 255, 255, 0.04);
  z-index: 0;
  pointer-events: none;
}

:root.light .ghost-number {
  color: rgba(0, 0, 0, 0.04);
}

"""

content = re.sub(r'/\* ───────────────────── Typography Scale ───────────────────── \*/.*?/\* ───────────────────── Hero Gradient Text ───────────────────── \*/', typography_css + "\n/* ───────────────────── Hero Gradient Text ───────────────────── */", content, flags=re.DOTALL)

# Fonts Definition in @theme
theme_fonts = """  --font-display: 'Clash Display', sans-serif;
  --font-body: 'Switzer', sans-serif;
}"""
content = re.sub(r"  --font-sans: 'Geist'.*?\}", theme_fonts, content, flags=re.DOTALL)

# Update tag tech tags styles
tag_style = """
.tag {
  display: inline-block;
  background-color: var(--emerald-bg);
  border: 1px solid rgba(16,185,129,0.2);
  border-radius: 3px;
  padding: 2px 7px;
  font-family: var(--font-body);
  font-weight: 500;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--emerald);
  margin-right: 6px;
  margin-bottom: 6px;
  transition: all 0.3s ease;
}

.tag:hover {
  background-color: color-mix(in srgb, var(--emerald-bg) 70%, var(--surface));
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.15);
}"""

content = re.sub(r'\.tag \{.*?\.tag:hover \{.*?\}', tag_style[1:], content, flags=re.DOTALL)


with open("src/app/globals.css", "w") as f:
    f.write(content)

