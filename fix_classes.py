import re

with open("src/app/components/HomeClient.tsx", "r") as f:
    content = f.read()

# Replace classes
content = content.replace("text-hero", "type-t1")
content = content.replace("text-section", "type-t2")
content = content.replace("text-body", "type-t4")
content = content.replace("text-label", "type-t5")
content = content.replace("text-tag", "type-t6")
content = content.replace("text-eyebrow", "type-t6")

with open("src/app/components/HomeClient.tsx", "w") as f:
    f.write(content)

