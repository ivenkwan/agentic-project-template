---
name: frontend-scaffold
description: >
  Scaffold a frontend page, feature module, or component for Next.js, SvelteKit,
  or Vite+React. Use when adding a new page, feature, or shared UI component.
  Includes API client wiring and Tailwind styling conventions.
metadata:
  version: "1.0"
  author: agentic-project-template
---

# Frontend Scaffold Skill

## Next.js (Stack 1 & 2) Page Template

```
apps/frontend-nextjs/src/
├── app/
│   └── {feature}/
│       ├── page.tsx          # Server Component (default)
│       ├── _components/      # Feature-local components
│       └── actions.ts        # Server Actions
├── components/               # Shared components
└── lib/
    └── api.ts                # Typed API client
```

**Page template:**
```tsx
// app/{feature}/page.tsx
import { fetchData } from "@/lib/api";
export default async function FeaturePage() {
  const data = await fetchData("/api/v1/{resource}");
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold">{/* title */}</h1>
    </main>
  );
}
```

## SvelteKit (Stack 3) Route Template

```
apps/frontend-sveltekit/src/routes/{feature}/
├── +page.svelte
├── +page.server.ts    # Server-side data loading
└── +layout.svelte     # Optional layout
```

## Vite + React (Stack 4) Feature Template

```
apps/frontend-vite-react/src/features/{feature}/
├── index.tsx          # Feature entry
├── components/
├── hooks/
│   └── use{Feature}.ts
└── api.ts             # React Query / fetch wrapper
```

## API Client Pattern (All Stacks)

```typescript
// lib/api.ts — typed fetch wrapper
const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export async function fetchData<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`);
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json() as Promise<T>;
}
```

## Rules
1. Use Tailwind utility classes — no custom CSS files
2. Server Components by default in Next.js; add `"use client"` only when needed
3. All API calls go through `lib/api.ts` — no direct fetch in components
4. Shared types must come from `packages/shared-types`
