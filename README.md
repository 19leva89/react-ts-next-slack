Core Technologies:
- React 19
- TypeScript
- Next 15 (framework)

Data Fetching and State Management:
- Jotai (state management)

Database Management:
- Convex (reactive NoSQL database)

Styling and UI Frameworks:
- Lucide React (stylization)
- React Icons (stylization)
- shadcn/ui (stylization)
- Tailwind CSS (stylization)

Utilities and Libraries:
- PostCSS (transforms CSS code to AST)


To run the client and server via concurrently:
npm run all
npm run lint (loading ESLint checker)

npx convex dev
npx @convex-dev/auth (sets up your project for authenticating via the library)
npx convex env set AUTH_GITHUB_ID <yourGithubClientId>
npx convex env set AUTH_GITHUB_SECRET <yourGithubSecret>
npx convex env set AUTH_GOOGLE_ID <yourGoogleClientId>
npx convex env set AUTH_GOOGLE_SECRET <yourGoogleSecret>