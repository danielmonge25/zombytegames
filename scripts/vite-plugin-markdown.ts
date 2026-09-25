import { marked } from 'marked';
import type { Plugin } from 'vite';

/**
 * Turns `*.md` files into JS modules at build time:
 *   export const meta = { ...frontmatter }
 *   export const html = '<p>…</p>'
 * so dev log posts ship as plain HTML with zero runtime markdown cost.
 */
export function markdown(): Plugin {
  return {
    name: 'zombyte-markdown',
    enforce: 'pre',
    transform(code, id) {
      if (!id.split('?')[0].endsWith('.md')) return null;
      const { data, body } = parseFrontmatter(code);
      // Drafts ship without their body, so unfinished writing never ends up in the bundle.
      if (data.status !== 'published') {
        return { code: `export const meta = ${JSON.stringify(data)};\nexport const html = '';\nexport default { meta, html };\n`, map: null };
      }
      let html = marked.parse(body, { async: false, gfm: true });
      // External links open in a new tab.
      html = html.replace(/<a href="(https?:\/\/[^"]+)"/g, '<a href="$1" target="_blank" rel="noopener noreferrer"');
      return {
        code: `export const meta = ${JSON.stringify(data)};\nexport const html = ${JSON.stringify(html)};\nexport default { meta, html };\n`,
        map: null,
      };
    },
  };
}

type FrontmatterValue = string | number | boolean | null | string[];

/** Tiny frontmatter parser: `key: value`, `key: [a, b]`, numbers, booleans, null. */
export function parseFrontmatter(source: string): { data: Record<string, FrontmatterValue>; body: string } {
  const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!match) return { data: {}, body: source };
  const data: Record<string, FrontmatterValue> = {};
  for (const line of match[1].split(/\r?\n/)) {
    const m = line.match(/^([A-Za-z0-9_-]+)\s*:\s*(.*)$/);
    if (!m) continue;
    data[m[1]] = parseValue(m[2].trim());
  }
  return { data, body: match[2] };
}

function parseValue(raw: string): FrontmatterValue {
  if (raw === '' || raw === 'null' || raw === '~') return null;
  if (raw === 'true') return true;
  if (raw === 'false') return false;
  if (/^-?\d+(\.\d+)?$/.test(raw)) return Number(raw);
  if (raw.startsWith('[') && raw.endsWith(']')) {
    return raw
      .slice(1, -1)
      .split(',')
      .map((s) => unquote(s.trim()))
      .filter(Boolean);
  }
  return unquote(raw);
}

function unquote(s: string): string {
  if ((s.startsWith('"') && s.endsWith('"')) || (s.startsWith("'") && s.endsWith("'"))) return s.slice(1, -1);
  return s;
}
