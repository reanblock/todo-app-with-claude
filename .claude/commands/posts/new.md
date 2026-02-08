---
description: Create new markdown blog post
argument-hint: Post title | Post description
allowed-tools: Bash, ReadFile, WriteFile, ListDirectory
---

## Context

Parse $ARGUMENTS to get the following values:

[title]: Blog post name from $ARGUMENTS
[description]: Blog post author from $ARGUMENTS

## Task

1. Generate the proper kebab-case filename with today's date (YYYY-MM-DD-title-slug.md)
2. Update the front matter to include:
   - The title properly formatted
   - Today's date
   - draft: true
   - The description
   - Author: Reanblock
3. Display a preview.

Do not add any content to the file - just keep the front matter for now. 