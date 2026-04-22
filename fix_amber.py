with open("src/app/globals.css", "r") as f:
    text = f.read()

# Replace variables
text = text.replace("--emerald: #10b981;", "--amber: #D97706;")
text = text.replace("--emerald-bg: rgba(16,185,129,0.08);", "--amber-bg: rgba(217,119,6,0.08);")
text = text.replace("--accent: var(--emerald);", "--accent: var(--amber);")

# Replace variable usages
text = text.replace("--emerald", "--amber")
text = text.replace("--emerald-bg", "--amber-bg")

# Replace rgba values
text = text.replace("rgba(16, 185, 129", "rgba(217, 119, 6")
text = text.replace("rgba(16,185,129", "rgba(217,119,6")

# Replace hex fallback
text = text.replace("#10b981", "#D97706")

with open("src/app/globals.css", "w") as f:
    f.write(text)

