import { execSync } from 'node:child_process';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { imagetools } from 'vite-imagetools';
import { markdown } from './scripts/vite-plugin-markdown.ts';

/** Short commit hash shown in the footer ("build abc1234"). */
function buildId(): string {
  if (process.env.GITHUB_SHA) return process.env.GITHUB_SHA.slice(0, 7);
  try {
    return execSync('git rev-parse --short HEAD', { stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim();
  } catch {
    return 'dev';
  }
}

export default defineConfig({
  plugins: [
    react(),
    // Optimizes every image imported from src/ (resizing + WebP) at build time.
    imagetools({ defaultDirectives: new URLSearchParams({ withoutEnlargement: 'true' }) }),
    markdown(),
  ],
  define: {
    __BUILD_ID__: JSON.stringify(buildId()),
    __BUILD_YEAR__: JSON.stringify(String(new Date().getFullYear())),
  },
  build: {
    target: 'es2022',
    assetsInlineLimit: 2048,
  },
});
