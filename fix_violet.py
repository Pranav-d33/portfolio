import re

# Update HomeClient.tsx
with open("src/app/components/HomeClient.tsx", "r") as f:
    text = f.read()

# Hero › symbol
text = text.replace('<span className="text-accent mr-1">›</span>', '<span className="text-violet mr-1">›</span>')

# PD Monogram - apply text-violet class
old_pd = """          <div className="hidden sm:block type-t2 font-medium group cursor-default">
            <span className="inline-block transition-transform duration-300 group-hover:scale-110">
              P
            </span>
            <span className="inline-block transition-transform duration-300 group-hover:scale-110 delay-75">
              D
            </span>
          </div>"""
new_pd = """          <div className="hidden sm:block type-t2 font-medium group cursor-default text-violet">
            <span className="inline-block transition-transform duration-300 group-hover:scale-110">
              P
            </span>
            <span className="inline-block transition-transform duration-300 group-hover:scale-110 delay-75">
              D
            </span>
          </div>"""
text = text.replace(old_pd, new_pd)


with open("src/app/components/HomeClient.tsx", "w") as f:
    f.write(text)

# Update CSS for violet
with open("src/app/globals.css", "r") as f:
    css = f.read()

# Add text-violet class
css += "\n.text-violet { color: var(--violet); }\n"

# Replace nav-link active color
css = css.replace("background: var(--accent);", "background: var(--violet);", 1) 

with open("src/app/globals.css", "w") as f:
    f.write(css)

