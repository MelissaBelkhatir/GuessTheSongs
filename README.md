# Album Recall

A responsive, dark-mode album memory game. Seven built-in Gracie Abrams editions, search the iTunes catalog, guess tracks in any order, timer begins on typing, and save only new personal bests. Share the site or individual albums by URL.

## Local development
Install Node.js 22 or a current LTS release. In this folder run `npm run dev`, then visit http://localhost:3000. No package installation or API keys are required. `npm test` runs the game-logic tests.

## GitHub and Vercel
Create an empty GitHub repository, then run `git init`, `git add .`, `git commit -m "Initial Album Recall website"`, `git branch -M main`, `git remote add origin YOUR_REPOSITORY_URL`, `git push -u origin main`. In Vercel select Add New > Project and import that repository. Use Other as framework preset, leave Build Command empty, use the root directory and output directory `.`. Deploy. The API route is a Vercel function; it does not require secrets. Push changes to GitHub to redeploy.

## Data and limitations
Personal bests and added albums are saved in browser localStorage, not on a server. Friends have independent records, and clearing site data removes them. The desktop Python records do not automatically migrate. Tracklists and IDs are ported from the supplied Python source, not independently verified. The online catalog and cover art depend on Apple's availability; missing artwork has a music-note fallback. You can also provide a public artwork URL in `albums.js` (use art you have permission to publish). No audio is streamed. Track answers are client-side, so this isn't a cheat-proof competitive leaderboard. Online catalog requests are proxied by `/api/catalog` to avoid cross-origin problems.
