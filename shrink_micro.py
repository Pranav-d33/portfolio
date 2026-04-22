import re

with open("src/app/globals.css", "r") as f:
    text = f.read()

# t1
text = re.sub(
    r"\.type-t1 \{\s*font-family.*?line-height:.*?;",
    r".type-t1 {\n  font-family: var(--font-display);\n  font-weight: 400;\n  font-size: clamp(24px, 4vw, 40px);\n  letter-spacing: 0.1em;\n  line-height: 1.0;\n  text-transform: uppercase;",
    text, flags=re.DOTALL
)

# t2
text = re.sub(
    r"\.type-t2 \{\s*font-family.*?line-height:.*?;",
    r".type-t2 {\n  font-family: var(--font-display);\n  font-weight: 400;\n  font-size: clamp(16px, 2.5vw, 24px);\n  letter-spacing: 0.1em;\n  line-height: 1.1;\n  text-transform: uppercase;",
    text, flags=re.DOTALL
)

# t3
text = re.sub(
    r"\.type-t3 \{\s*font-family.*?line-height:.*?;",
    r".type-t3 {\n  font-family: var(--font-display);\n  font-weight: 400;\n  font-size: clamp(12px, 1.5vw, 16px);\n  letter-spacing: 0.1em;\n  line-height: 1.2;\n  text-transform: uppercase;",
    text, flags=re.DOTALL
)

# t4
text = re.sub(
    r"\.type-t4 \{\s*font-family.*?line-height:.*?;",
    r".type-t4 {\n  font-family: var(--font-body);\n  font-weight: 400;\n  font-size: clamp(10px, 1.2vw, 11px);\n  line-height: 1.8;\n  letter-spacing: 0.02em;",
    text, flags=re.DOTALL
)

# t5
text = re.sub(
    r"\.type-t5 \{\s*font-family.*?color: var\(--text-2\);",
    r".type-t5 {\n  font-family: var(--font-body);\n  font-weight: 400;\n  font-size: 9.5px;\n  line-height: 1.6;\n  color: var(--text-2);",
    text, flags=re.DOTALL
)

# t6
text = re.sub(
    r"\.type-t6 \{\s*font-family.*?text-transform: uppercase;",
    r".type-t6 {\n  font-family: var(--font-body);\n  font-weight: 400;\n  font-size: 8px;\n  letter-spacing: 0.15em;\n  text-transform: uppercase;",
    text, flags=re.DOTALL
)

# Ghost number
text = re.sub(
    r"\.ghost-number \{\s*position.*?pointer-events: none;",
    r".ghost-number {\n  position: absolute;\n  top: 10px;\n  right: 15px;\n  font-family: var(--font-display);\n  font-weight: 400;\n  font-size: clamp(32px, 5vw, 56px);\n  color: rgba(255, 255, 255, 0.03);\n  z-index: 0;\n  pointer-events: none;",
    text, flags=re.DOTALL
)

with open("src/app/globals.css", "w") as f:
    f.write(text)

