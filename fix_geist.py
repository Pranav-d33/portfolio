import re

with open("src/app/globals.css", "r") as f:
    text = f.read()

text = text.replace("var(--font-body)", "var(--font-geist-sans)")

with open("src/app/globals.css", "w") as f:
    f.write(text)

