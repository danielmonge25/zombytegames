# Zombyte Games — zombytegames.com

The personal site of Zombyte Games: one engineer building weird, interesting games.
Home of **BLOODCAST** (in development) and **Domino Dancing** (concept).

Built with React + TypeScript + Vite. Every page is pre-rendered to static HTML, then
hydrated for the interactive parts. Hosted on GitHub Pages; **every push to `main` deploys automatically.**

```bash
npm install       # once
npm run dev       # local dev server → http://localhost:5173
npm run build     # production build into dist/ (typecheck + client + prerender)
npm run preview   # serve the production build locally
```

---

## Everyday tasks

### Add BLOODCAST screenshots
1. Drop images into `src/games/bloodcast/assets/screenshots/`
2. Name them in order: `01-the-castle-at-night.png`, `02-fishing-at-the-pond.png`, …
   The file name becomes the caption + alt text ("The castle at night").
3. Commit and push. That's it.

Any size or format works (`png jpg webp avif`). The build resizes to 480/960/1440/1920px WebP automatically.
As soon as one real screenshot exists, the "coming soon" frames disappear.

### Replace other placeholder art (all optional, all automatic)

| Drop this file | Into | Replaces |
| --- | --- | --- |
| `key-art.png` | `src/games/bloodcast/assets/` | the illustrated night scene (BLOODCAST hero + home page) |
| `cover.png` | `src/games/<game>/assets/` | cartridge art on cards + in the launcher |
| `castle.png` `graveyard.png` `garden.png` `waterways.png` | `src/games/bloodcast/assets/world/` | World map slots |
| `fish-001.png`, `fish-002.png`, … | `src/games/bloodcast/assets/fish/` | fish collection silhouettes |
| `girl.png`, `player.png` | `src/games/bloodcast/assets/characters/` | the mysterious girl / customization mirror |

Every placeholder is clearly labelled on the site ("Placeholder art", "Screenshot slot", …) until the real art arrives.

### Reveal fish in the collection
Edit `FISH` in `src/games/bloodcast/data.ts`: give an entry a `name`, `rarity`, `habitat`, `description`.
Anything left `null` shows as `???`. Rarity colours go in `RARITY_COLORS` in the same file.

### Add the trailer
Set `TRAILER_YOUTUBE_ID` at the top of `src/games/bloodcast/BloodcastPage.tsx`.

### Add social / contact links
`src/data/site.ts` → `CONTACT_LINKS`. Paste a URL and the "coming soon" slot turns into a real link.
Store/community links for a game (Steam, itch.io, Discord, GitHub) live in that game's `links` in `src/data/games.ts`.

### Write a dev log post
Create `src/content/devlog/004-my-post.md`:

```md
---
number: 4
title: My Post Title
date: 2026-10-01
game: bloodcast        # a game slug, or null for general posts
status: published      # or "soon" to list it as "In the works" without a page
excerpt: One or two sentences for the list.
tags: [bloodcast, unity]
---

Write in normal **Markdown**. Images: put them in `public/images/devlog/`
and use ![alt text](/images/devlog/my-image.webp).
```

The file name becomes the URL: `/devlog/004-my-post/`. Posts tagged with a game also show up on that game's page.
Posts #002 and #003 are already waiting as drafts with an outline — fill them in and flip `status` to `published`.

### Add a new game
1. Add an entry to `GAMES` in `src/data/games.ts` (copy Domino Dancing's entry as a template).
2. Done: it gets a cartridge card, a launcher entry, its own page at `/games/<slug>/`,
   a pre-rendered HTML file, and a sitemap entry. Optional: `src/games/<slug>/assets/cover.png`.
3. Want a fully custom page like BLOODCAST? Create a component and register it in
   `CUSTOM_GAME_PAGES` in `src/games/registry.tsx`.

To change the game shown in the nav pill and the "Currently building" section, edit `CURRENTLY_BUILDING` in `src/data/site.ts`.

### Replace the logo
The logo is Byte, the mascot (`src/components/mascot/Mascot.tsx`). To use your own file, put it in `public/`
and swap the `<Mascot />` inside `src/components/Logo.tsx` for `<img src="/logo.svg" alt="" />`.
Also replace `public/favicon.svg`, the icons (`public/*.png`, `public/favicon.ico`) and the social preview images in `public/og/` (1200×630).

---

## Project map

```
src/
  data/            site settings, game registry, journey, skills   ← most edits happen here
  content/devlog/  dev log posts (Markdown)
  games/
    bloodcast/     BLOODCAST page, its sections, data.ts, art, assets/
    domino-dancing/
    registry.tsx   custom pages + cover art per game
  components/      Navbar, Footer, GameCard, ScreenshotGallery, DevLogList, mascot, …
  components/home/ Hero, InteractiveBackground, Timeline, Skills, Terminal, Contact, …
  pages/           Games launcher, generic ProjectPage, dev log pages, 404
  lib/             router, SEO/meta, images, dev log loader, achievements, motion
  styles/          design tokens + global CSS
scripts/
  prerender.mjs    turns each route into static HTML + writes sitemap.xml and 404.html
public/            fonts, icons, og images, CNAME, robots.txt (copied as-is)
.github/workflows/deploy.yml   build + deploy to GitHub Pages on every push to main
```

## Secrets hidden on the site (spoilers)
Logo ×5 (zombie mode, Esc cures it) · the Konami code · the terminal in About (`help`) · catching a fish on the
BLOODCAST page · visiting all four world locations · pushing the dominoes · poking Byte 5 times.
Progress is tracked in the footer under "Secrets". Also: open the browser console.

## Accessibility & motion
Keyboard navigable throughout, visible focus states, skip link, semantic landmarks, native `<dialog>`s,
alt text everywhere. `prefers-reduced-motion` is respected, and there's a "Reduce motion" toggle in the footer.

## Deployment
GitHub Actions (`.github/workflows/deploy.yml`) builds and publishes `dist/` to GitHub Pages on every push to `main`.
The custom domain `zombytegames.com` is configured in the repository's Pages settings (`public/CNAME` is kept for reference).
