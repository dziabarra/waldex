/**
 * PL ↔ EN slug map for non-content routes.
 * Content routes (realizacje/[slug], blog/[slug]) use `canonicalSlug` from
 * frontmatter to pair locales — see src/i18n/utils.ts.
 *
 * Add new pages here whenever a route gets added under src/pages/ AND src/pages/en/.
 */
export const ROUTE_MAP = {
  // PL slug → EN slug (path segment by path segment)
  pl: {
    '': 'en',
    realizacje: 'realizations',
    uslugi: 'services',
    blog: 'blog',
    kontakt: 'contact',
    'polityka-prywatnosci': 'privacy-policy',
    cookies: 'cookies',
  },
  en: {
    '': '',
    realizations: 'realizacje',
    services: 'uslugi',
    blog: 'blog',
    contact: 'kontakt',
    'privacy-policy': 'polityka-prywatnosci',
    cookies: 'cookies',
  },
} as const satisfies {
  pl: Record<string, string>;
  en: Record<string, string>;
};

export type Locale = 'pl' | 'en';
export const LOCALES: readonly Locale[] = ['pl', 'en'] as const;
export const DEFAULT_LOCALE: Locale = 'pl';
