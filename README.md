# This project contains the following technologies

Core Technologies:
- React 19
- TypeScript
- Next 15 (framework)

Data Fetching and State Management:
- Jotai (state management)
- NUQS (URL State Synchronization)

Database Management:
- Convex (reactive NoSQL database)

Styling and UI Frameworks:
- Lucide React (stylization)
- React Icons (stylization)
- shadcn/ui (stylization)
- Tailwind CSS (stylization)

Text Editing:
- Emoji picker react (emoji picker)
- Quill (text editor)

Utilities and Libraries:
- PostCSS (transforms CSS code to AST)
- React Use (custom React Hooks)


# Project setup commands:
terminal powershell -> `npm i` (install dependencies)
terminal powershell -> `npm run all`
terminal powershell -> `npm run lint` (loading ESLint checker)
terminal powershell -> `npm run knip`

# Convex commands:
terminal powershell -> `npx convex dev`
terminal powershell -> `npx @convex-dev/auth` (sets up your project for authenticating via the library)
terminal powershell -> `npx convex env set AUTH_GITHUB_ID <yourGithubClientId>`
terminal powershell -> `npx convex env set AUTH_GITHUB_SECRET <yourGithubSecret>`
terminal powershell -> `npx convex env set AUTH_GOOGLE_ID <yourGoogleClientId>`
terminal powershell -> `npx convex env set AUTH_GOOGLE_SECRET <yourGoogleSecret>`

# GitHub commands:
terminal powershell -> `git pull origin master` (get latest changes)

terminal powershell -> `git add .` (add all changes)
terminal powershell -> `git commit -m "commit message"` (commit changes)
terminal powershell -> `git checkout -b <branch-name>` (create new branch)

terminal powershell -> `git push origin master` (push changes to master)
terminal powershell -> `git push origin <branch-name>` (push changes to branch)