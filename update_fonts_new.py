import re

with open("src/app/globals.css", "r") as f:
    text = f.read()

# 1. Replace Font Import
import_str = """@import url('https://fonts.cdnfonts.com/css/eight-one');\n@import url('https://fonts.cdnfonts.com/css/designer');"""
text = re.sub(
    r"@import url\('https://fonts\.googleapis\.com/css2\?family=Montserrat.*?display=swap'\);", 
    import_str, 
    text
)

# 2. Variable definitions
text = text.replace("var(--font-display)", "'DESIGNER', sans-serif")
text = text.replace("var(--font-body)", "'Eight One', sans-serif")
# Also update the theme variables in @theme if they exist
text = text.replace("--font-display: 'Poiret One', cursive, sans-serif;", "--font-display: 'DESIGNER', sans-serif;")
text = text.replace("--font-body: 'Montserrat', sans-serif;", "--font-body: 'Eight One', sans-serif;")

# 3. Fine-tune sizes for these fonts (they might be larger/smaller)
# DESIGNER is often condensed, Eight One is wide/rounded.
# t1 (Eight One)
text = re.sub(
    r"\.type-t1 \{\s*font-family.*?line-height:.*?;",
    r".type-t1 {\n  font-family: var(--font-display);\n  font-weight: 400;\n  font-size: clamp(30px, 4vw, 44px);\n  letter-spacing: 0.05em;\n  line-height: 1.05;",
    text, flags=re.DOTALL
)

# t2
text = re.sub(
    r"\.type-t2 \{\s*font-family.*?line-height:.*?;",
    r".type-t2 {\n  font-family: var(--font-display);\n  font-weight: 400;\n  font-size: clamp(18px, 2vw, 24px);\n  letter-spacing: 0.05em;\n  line-height: 1.1;",
    text, flags=re.DOTALL
)

# t3
text = re.sub(
    r"\.type-t3 \{\s*font-family.*?line-height:.*?;",
    r".type-t3 {\n  font-family: var(--font-display);\n  font-weight: 400;\n  font-size: clamp(14px, 1.5vw, 18px);\n  letter-spacing: 0.03em;\n  line-height: 1.2;",
    text, flags=re.DOTALL
)

# t4 (Eight One) - bit wider, so smaller font size might be needed for elegance
text = re.sub(
    r"\.type-t4 \{\s*font-family.*?line-height:.*?;",
    r".type-t4 {\n  font-family: var(--font-body);\n  font-weight: 400;\n  font-size: clamp(11px, 1vw, 13px);\n  line-height: 1.6;",
    text, flags=re.DOTALL
)

# t5
text = re.sub(
    r"\.type-t5 \{\s*font-family.*?color: var\(--text-2\);",
    r".type-t5 {\n  font-family: var(--font-body);\n  font-weight: 400;\n  font-size: 10px;\n  line-height: 1.6;\n  color: var(--text-2);",
    text, flags=re.DOTALL
)

# t6
text = re.sub(
    r"\.type-t6 \{\s*font-family.*?text-transform: uppercase;",
    r".type-t6 {\n  font-family: var(--font-body);\n  font-weight: 400;\n  font-size: 8px;\n  letter-spacing: 0.1em;\n  text-transform: uppercase;",
    text, flags=re.DOTALL
)

with open("src/app/globals.css", "w") as f:
    f.write(text)

