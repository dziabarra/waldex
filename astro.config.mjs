// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// Site URL — used by sitemap, rss, canonical tags, og:url, hreflang.
// Override via PUBLIC_SITE_URL env var if needed. Default: production custom domain.
// Until DNS propagation completes, the site is also reachable at the workers.dev
// alias, but canonical tags here point search engines to the final URL.
const SITE = process.env.PUBLIC_SITE_URL ?? 'https://strefaexpo.pl';

export default defineConfig({
  site: SITE,
  output: 'static',
  trailingSlash: 'never',
  build: {
    inlineStylesheets: 'auto',
    format: 'directory',
  },
  i18n: {
    defaultLocale: 'pl',
    locales: ['pl', 'en'],
    routing: {
      prefixDefaultLocale: false,
      redirectToDefaultLocale: false,
    },
    // No fallback: missing translations should return 404 (or be filtered out
    // of listings), not silently serve PL under /en/. Per-page mirroring is
    // handled explicitly by src/pages/en/*.
  },
  prefetch: {
    prefetchAll: false,
    defaultStrategy: 'hover',
  },
  image: {
    responsiveStyles: true,
    layout: 'constrained',
  },
  vite: {
    // @ts-expect-error @tailwindcss/vite is typed against Vite 8; Astro 5.18 ships with Vite 6.
    // Runtime works correctly; this is a typing-only mismatch caused by two Vite copies in the tree.
    plugins: [tailwindcss()],
  },
  integrations: [
    mdx(),
    sitemap({
      i18n: {
        defaultLocale: 'pl',
        locales: { pl: 'pl-PL', en: 'en' },
      },
      filter: (page) =>
        !page.includes('/draft/') &&
        !page.endsWith('/404') &&
        !page.endsWith('/404/'),
    }),
  ],
});
