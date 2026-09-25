# Zombyte Games — zombytegames.com

The personal site of Zombyte Games: one engineer building weird, interesting games.
A single page: what's being built (**BLOODCAST**, **Domino Dancing**), who's building it, and how to get in touch.

Built with React + TypeScript + Vite and pre-rendered to static HTML, then hydrated for the interactive bits.
Hosted on GitHub Pages; **every push to `main` deploys automatically.**

```bash
npm install       # once
npm run dev       # local dev server → http://localhost:5173
npm run build     # production build into dist/ (typecheck + client + prerender)
npm run preview   # serve the production build locally
```

---

## Everyday tasks

### Edit a game's overview
Everything a game panel shows lives in `src/data/games.ts`: title, tagline, status, genre, tech, a short summary.
Keep it short — the panel is an overview, not a full page.

### Replace the placeholder art
Drop `cover.png` (or `.jpg` / `.webp`) into `src/games/<slug>/assets/` — e.g. `src/games/bloodcast/assets/cover.png`.
It replaces the placeholder in that game's panel and is resized + converted to WebP automatically. 16:10, ~1920px wide works best.

### Add store / community links to a game
Fill in a `url` in that game's `links` in `src/data/games.ts` (e.g. Steam, itch.io, Discord). Links without a URL aren't shown.

### Add a new game
Add an entry to `GAMES` in `src/data/games.ts` (copy Domino Dancing's entry). It gets its own panel in the Games section,
with an anchor at `zombytegames.com/#<slug>`. Optionally add `src/games/<slug>/assets/cover.png`.
To change which game shows the "Currently building" badge and nav pill, edit `CURRENTLY_BUILDING` in `src/data/site.ts`.

### Add social / contact links
`src/data/site.ts` → `CONTACT_LINKS`. Paste a URL and the "coming soon" slot becomes a real link.

### Replace the logo
The logo is Byte, the mascot (`src/components/mascot/Mascot.tsx`). To use your own file, put it in `public/`
and swap the `<Mascot />` inside `src/components/Logo.tsx` for `<img src="/logo.svg" alt="" />`.
Also replace `public/favicon.svg`, the icons (`public/*.png`, `public/favicon.ico`) and `public/og/og-default.jpg` (1200×630 social preview).

---

## Project map

```
src/
  data/            site settings, games, journey, skills   ← most edits happen here
  games/           per-game art (placeholder illustrations + assets/ drop-in folders)
  components/home/ Hero, Games, About (+ terminal), Timeline, Skills, Contact
  components/      Navbar, Footer, mascot, pixel sprites, easter eggs, …
  pages/           HomePage, 404
  lib/             router, SEO/meta, images, secrets, motion preference
  styles/          design tokens + global CSS
scripts/prerender.mjs   renders the page to static HTML + writes sitemap.xml and 404.html
public/                 fonts, icons, og image, CNAME, robots.txt (copied as-is)
.github/workflows/deploy.yml   build + deploy to GitHub Pages on every push to main
```

## Secrets hidden on the site (spoilers)
Logo ×5 (zombie mode, Esc cures it) · the Konami code · the terminal in About (`help`) · pushing the dominoes ·
poking Byte 5 times. Progress is tracked in the footer under "Secrets". Also: open the browser console.

## Accessibility & motion
Keyboard navigable, visible focus states, skip link, semantic landmarks, native `<dialog>`s, alt text.
`prefers-reduced-motion` is respected, and there's a "Reduce motion" toggle in the footer.

## Deployment
GitHub Actions (`.github/workflows/deploy.yml`) builds and publishes `dist/` to GitHub Pages on every push to `main`.
The custom domain `zombytegames.com` is set in the repository's Pages settings; DNS is at Hostinger
(4 A + 4 AAAA records on `@` pointing to GitHub Pages, `www` CNAME → `danielmonge25.github.io`).
