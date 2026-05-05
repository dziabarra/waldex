import { getRelativeLocaleUrl } from 'astro:i18n';
import { UI, type UIKey } from './ui';
import { ROUTE_MAP, type Locale, DEFAULT_LOCALE, LOCALES } from './routes';

/**
 * Translate a UI string. Falls back to PL if missing in target locale.
 * Replaces `{var}` placeholders from `vars`.
 */
export function t(
  locale: Locale,
  key: UIKey,
  vars?: Record<string, string | number>,
): string {
  const dict = UI[locale] ?? UI[DEFAULT_LOCALE];
  let str: string =
    (dict as Record<string, string>)[key] ??
    (UI[DEFAULT_LOCALE] as Record<string, string>)[key] ??
    key;

  if (vars) {
    for (const [k, v] of Object.entries(vars)) {
      str = str.replaceAll(`{${k}}`, String(v));
    }
  }
  return str;
}

/**
 * Translate a path segment (slug) between locales using ROUTE_MAP.
 * Unknown slugs are passed through unchanged (e.g. content slugs from MDX).
 */
export function translateSlug(
  slug: string,
  fromLocale: Locale,
  toLocale: Locale,
): string {
  if (fromLocale === toLocale) return slug;
  const map = ROUTE_MAP[fromLocale] as Record<string, string>;
  return map[slug] ?? slug;
}

/**
 * Build a localized URL for a given path (without leading slash).
 *
 * Examples:
 *   localizedUrl('pl', 'realizacje')     → '/realizacje'
 *   localizedUrl('en', 'realizacje')     → '/en/realizations' (translates known slugs)
 *   localizedUrl('en', 'blog/some-post') → '/en/blog/some-post' (unknown leaf passed through)
 */
export function localizedUrl(locale: Locale, path: string = ''): string {
  // Translate first segment if it has a known mapping in PL→EN.
  const cleaned = path.replace(/^\/+/, '').replace(/\/+$/, '');
  if (!cleaned) return getRelativeLocaleUrl(locale, '');
  const [first, ...rest] = cleaned.split('/');
  const translatedFirst = translateSlug(first, DEFAULT_LOCALE, locale);
  const newPath = [translatedFirst, ...rest].join('/');
  return getRelativeLocaleUrl(locale, newPath);
}

/**
 * Compute alternate-language URL for the current page.
 * Used for hreflang tags and the language switcher.
 *
 * `currentPath` should be the current URL path (e.g. `/en/realizations/cnc-2024`).
 * Returns the equivalent path in the OTHER locale.
 */
export function getAlternateUrl(
  currentLocale: Locale,
  currentPath: string,
): string {
  const otherLocale: Locale = currentLocale === 'pl' ? 'en' : 'pl';

  // Strip locale prefix
  let stripped = currentPath.replace(/^\/+/, '').replace(/\/+$/, '');
  if (stripped.startsWith('en/')) stripped = stripped.slice(3);
  else if (stripped === 'en') stripped = '';

  if (!stripped) return getRelativeLocaleUrl(otherLocale, '');

  const [first, ...rest] = stripped.split('/');
  const translated = translateSlug(first, currentLocale, otherLocale);
  return getRelativeLocaleUrl(otherLocale, [translated, ...rest].join('/'));
}

/**
 * Compute hreflang alternates for a given canonical path (without locale prefix).
 * Returns entries for every supported locale + x-default (= PL).
 */
export function getHreflangAlternates(
  canonicalPath: string = '',
): Array<{ hreflang: string; href: string }> {
  const alternates: Array<{ hreflang: string; href: string }> = [];
  for (const loc of LOCALES) {
    alternates.push({
      hreflang: loc === 'pl' ? 'pl-PL' : 'en',
      href: localizedUrl(loc, canonicalPath),
    });
  }
  alternates.push({
    hreflang: 'x-default',
    href: localizedUrl(DEFAULT_LOCALE, canonicalPath),
  });
  return alternates;
}
