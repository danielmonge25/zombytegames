/// <reference types="vite/client" />

/** Short git commit hash of the deployed build. */
declare const __BUILD_ID__: string;
/** Year of the build, used for the footer copyright. */
declare const __BUILD_YEAR__: string;

declare module '*.md' {
  export const meta: Record<string, string | number | boolean | null | string[]>;
  export const html: string;
  const post: { meta: typeof meta; html: string };
  export default post;
}
