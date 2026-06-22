# 07_Project_Structure (Frontend)

## Suggested structure (example)

```
src/
├── app/
├── components/
│ ├──__test__/
│ ├── ShortenHero.tsx
│ ├── ShortenForm.tsx
│ └── ShortenedResult.tsx
├── services/
├── hooks/
├── styles/
└── utils/
```

## Conventions

- Components: PascalCase
- Utilities: camelCase
- Co-locate tests with components (or /**tests**)

## Benefits

- Easy navigation
- Scalable structure
- Reusable components