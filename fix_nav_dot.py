with open("src/app/components/HomeClient.tsx", "r") as f:
    text = f.read()

text = text.replace("'h-6 bg-accent'", "'h-6 bg-violet'")
text = text.replace("'text-accent opacity-100 translate-x-0'", "'text-violet opacity-100 translate-x-0'")

with open("src/app/components/HomeClient.tsx", "w") as f:
    f.write(text)

with open("src/app/globals.css", "a") as f:
    f.write("\n.bg-violet { background-color: var(--violet); }\n")
