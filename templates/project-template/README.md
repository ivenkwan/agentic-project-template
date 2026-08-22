# Project Template

A starter template for a new skill project. It ships with a full clone of the
`enterprise-data-architect` skill as the worked example — study it, then replace it
with your own skill.

## Why enterprise-data-architect is the exemplar

It demonstrates every piece of a production-quality skill:

- A **trigger-rich frontmatter description** that fires across many phrasings.
- A **persona + operating mindset** that tells the agent how to think.
- **Core principles** — the non-obvious wisdom the domain requires.
- **Universal heuristics** — reusable rules that survive context changes.
- An **anti-pattern table** — patterns to detect and how to fix them.
- **Task workflows** — numbered, repeatable procedures.
- **Progressive disclosure** — a lean `SKILL.md` that points at `references/`
  deep-dives, so the agent only loads what it needs.

## Structure

```
project-template/
├── README.md                     <-- you are here
└── enterprise-data-architect/    <-- the exemplar skill (replace with your own)
    ├── SKILL.md                  <-- trigger + core instructions
    └── references/               <-- deep-dive docs loaded on demand
        ├── logical-modeling.md
        ├── legacy-systems.md
        ├── relational.md
        ├── nosql.md
        ├── graph.md
        ├── migration.md
        └── review-checklist.md
```

## How to start a new skill project

1. **Copy** this directory to your repository (e.g. `git clone` or copy the folder).
2. **Rename** `enterprise-data-architect/` to your skill name — hyphen-case,
   lowercase letters, digits, and hyphens only (e.g. `api-design-architect`).
3. **Edit the frontmatter** in `SKILL.md`:
   - `name`: your hyphen-case skill name (must match the directory).
   - `description`: what the skill does AND every trigger phrase for when to use
     it. This is the only text the agent sees before deciding to load the skill,
     so make it specific and comprehensive.
4. **Replace the body** — keep the same section anatomy (persona, principles,
   heuristics, anti-patterns, workflows, output standards) adapted to your domain.
5. **Rebuild `references/`** — one deep-dive file per major topic, linked from the
   skill body with a "read this when..." table.
6. **Validate and package**:
   ```bash
   python3 skills/skill-creator/scripts/quick_validate.py ./your-skill
   python3 skills/skill-creator/scripts/package_skill.py ./your-skill ./dist
   ```
7. **Save it** to your account so all conversations can use it.

## Checks before shipping

- [ ] `description` has no angle brackets and is under 1024 characters.
- [ ] `name` is hyphen-case and matches the directory name.
- [ ] Every `references/` file is linked from `SKILL.md`.
- [ ] The skill is validated (`quick_validate.py`) and packaged (`.skill`).
- [ ] You tried it on a real task and iterated.
