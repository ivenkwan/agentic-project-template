---
trigger: slash_command
command: /review
---

# /review — Code Review Workflow

When `/review` is run, activate the `code-review` skill and apply it to the
specified files or the current git diff.

## Steps
1. Identify files to review (from argument or `git diff --staged`)
2. Activate `code-review` skill
3. Apply the full checklist from the skill
4. Output the structured review with APPROVE / REQUEST CHANGES verdict
