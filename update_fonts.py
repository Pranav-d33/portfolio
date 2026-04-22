import re

with open("src/app/globals.css", "r") as f:
    text = f.read()

# 1. Replace Font Import
text = re.sub(
    r"@import url\('https://api\.fontshare\.com/v2/css\?f\[\]=clash-display.*?swap'\);", 
    r"@import url('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,300;0,400;0,500;1,400&family=Poiret+One&display=swap');", 
    text
)

# 2. Variable definitions
text = text.replace("'Clash Display', sans-serif", "'Poiret One', cursive, sans-serif")
text = text.replace("'Switzer', sans-serif", "'Montserrat', sans-serif")

# 3. Typography Scale values
# t1
text = re.sub(
    r"\.type-t1 \{\s*font-family.*?line-height:.*?;",
    r".type-t1 {\n  font-family: var(--font-display);\n  font-weight: 400;\n  font-size: clamp(40px, 5vw, 64px);\n  letter-spacing: 0.02em;\n  line-height: 1.1;",
    text, flags=re.DOTALL
)

# t2
text = re.sub(
    r"\.type-t2 \{\s*font-family.*?line-height:.*?;",
    r".type-t2 {\n  font-family: var(--font-display);\n  font-weight: 400;\n  font-size: clamp(24px, 3.5vw, 36px);\n  letter-spacing: 0.02em;\n  line-height: 1.15;",
    text, flags=re.DOTALL
)

# t3
text = re.sub(
    r"\.type-t3 \{\s*font-family.*?line-height:.*?;",
    r".type-t3 {\n  font-family: var(--font-display);\n  font-weight: 400;\n  font-size: clamp(18px, 2vw, 24px);\n  letter-spacing: 0.01em;\n  line-height: 1.2;",
    text, flags=re.DOTALL
)

# t4
text = re.sub(
    r"\.type-t4 \{\s*font-family.*?line-height:.*?;",
    r".type-t4 {\n  font-family: var(--font-body);\n  font-weight: 400;\n  font-size: clamp(14px, 1.5vw, 16px);\n  line-height: 1.6;",
    text, flags=re.DOTALL
)

# t5
text = re.sub(
    r"\.type-t5 \{\s*font-family.*?color: var\(--text-2\);",
    r".type-t5 {\n  font-family: var(--font-body);\n  font-weight: 400;\n  font-size: 13px;\n  line-height: 1.6;\n  color: var(--text-2);",
    text, flags=re.DOTALL
)

# t6
text = re.sub(
    r"\.type-t6 \{\s*font-family.*?text-transform: uppercase;",
    r".type-t6 {\n  font-family: var(--font-body);\n  font-weight: 500;\n  font-size: clamp(10px, 1.2vw, 11px);\n  letter-spacing: 0.1em;\n  text-transform: uppercase;",
    text, flags=re.DOTALL
)

# Ghost number
text = re.sub(
    r"\.ghost-number \{\s*position.*?pointer-events: none;",
    r".ghost-number {\n  position: absolute;\n  top: 10px;\n  right: 15px;\n  font-family: var(--font-display);\n  font-weight: 400;\n  font-size: clamp(48px, 6vw, 80px);\n  color: rgba(255, 255, 255, 0.04);\n  z-index: 0;\n  pointer-events: none;",
    text, flags=re.DOTALL
)

# section-label font
text = re.sub(
    r"\.section-label \{\s*font-family.*?color: var\(--amber\);",
    r".section-label {\n  font-family: var(--font-body);\n  font-weight: 500;\n  font-size: 11px;\n  letter-spacing: 0.15em;\n  text-transform: uppercase;\n  color: var(--amber);",
    text, flags=re.DOTALL
)

# pulse-pill font size
text = re.sub(r"\.pulse-pill \{\s*font-family: var\(--font-body\);\s*font-weight: 500;\s*font-size: 11px;", r".pulse-pill {\n  font-family: var(--font-body);\n  font-weight: 500;\n  font-size: 10px;", text)


with open("src/app/globals.css", "w") as f:
    f.write(text)

