import type { Locale } from './routes';

/**
 * Flat UI dictionary — small, no runtime i18n lib.
 * Keys are dotted strings; missing EN falls back to PL.
 *
 * Convention: keep strings semantic, not positional.
 *  GOOD:  'cta.brief'
 *  BAD:   'home.section3.button1'
 */
export const UI = {
  pl: {
    'site.name': 'Strefa Expo',
    'site.tagline': 'Stoiska targowe szyte na miarę',

    'nav.realizations': 'Realizacje',
    'nav.services': 'Usługi',
    'nav.blog': 'Blog',
    'nav.contact': 'Kontakt',

    'cta.brief': 'Zamów wycenę',
    'cta.brief.short': 'Wycena',
    'cta.contact': 'Skontaktuj się',
    'cta.see_realizations': 'Zobacz realizacje',
    'cta.read_more': 'Czytaj dalej',

    'lang.switch_to': 'EN',
    'lang.switch_aria': 'Zmień język na angielski',

    'footer.company': 'Firma',
    'footer.legal': 'Informacje prawne',
    'footer.privacy': 'Polityka prywatności',
    'footer.cookies': 'Polityka cookies',
    'footer.copyright': '© {year} Strefa Expo. Wszelkie prawa zastrzeżone.',

    'meta.home.title': 'Strefa Expo — stoiska targowe szyte na miarę',
    'meta.home.description':
      'Projekt, produkcja, transport, montaż i demontaż stoisk targowych w Polsce i UE. 5-stopniowy proces, terminy bez kompromisów.',

    'process.step.1.title': 'Projekt',
    'process.step.1.desc':
      'Brief, koncepcja 3D, dobór materiałów. Otrzymujesz wizualizację przed produkcją.',
    'process.step.2.title': 'Produkcja',
    'process.step.2.desc':
      'CNC, druk wielkoformatowy, aluminium modułowe, meble custom — wszystko we własnej hali.',
    'process.step.3.title': 'Transport',
    'process.step.3.desc':
      'Logistyka pod targi w Polsce i UE. Pełna odpowiedzialność za czas dostawy.',
    'process.step.4.title': 'Montaż',
    'process.step.4.desc':
      'Ekipa techniczna na miejscu, montaż 24/7 do pełnej gotowości stoiska na otwarcie.',
    'process.step.5.title': 'Demontaż',
    'process.step.5.desc':
      'Po targach — szybki demontaż i magazynowanie elementów wielokrotnego użytku.',

    'realizations.heading': 'Wybrane realizacje',
    'realizations.empty': 'Wkrótce — pierwsze realizacje wkrótce.',
    'realizations.meta.client': 'Klient',
    'realizations.meta.fair': 'Targi',
    'realizations.meta.year': 'Rok',
    'realizations.meta.city': 'Miasto',
    'realizations.meta.area': 'Powierzchnia',

    'contact.heading': 'Powiedz, czego potrzebujesz',
    'contact.subheading':
      'Krótki brief — wracamy z wstępną wyceną w ciągu 1 dnia roboczego.',
    'contact.form.fair': 'Targi (nazwa imprezy)',
    'contact.form.date': 'Termin',
    'contact.form.area': 'Powierzchnia (m²)',
    'contact.form.budget': 'Budżet (od – do)',
    'contact.form.message': 'Opis stoiska / czego potrzebujesz',
    'contact.form.email': 'Twój email',
    'contact.form.phone': 'Telefon',
    'contact.form.consent':
      'Wyrażam zgodę na przetwarzanie danych w celu odpowiedzi na zapytanie.',
    'contact.form.submit': 'Wyślij brief',
    'contact.form.success':
      'Dzięki — wracamy w ciągu 1 dnia roboczego.',
    'contact.form.error':
      'Coś poszło nie tak. Spróbuj ponownie albo napisz mailem.',

    'consent.title': 'Cookies i analytics',
    'consent.message':
      'Używamy plików cookies do analizy ruchu (Google Analytics 4). Bez Twojej zgody nie ładujemy żadnych skryptów śledzących.',
    'consent.accept': 'Akceptuj wszystkie',
    'consent.reject': 'Tylko niezbędne',
    'consent.preferences': 'Ustawienia',
  },

  en: {
    'site.name': 'Strefa Expo',
    'site.tagline': 'Custom-built trade fair stands',

    'nav.realizations': 'Realizations',
    'nav.services': 'Services',
    'nav.blog': 'Blog',
    'nav.contact': 'Contact',

    'cta.brief': 'Get a quote',
    'cta.brief.short': 'Quote',
    'cta.contact': 'Contact us',
    'cta.see_realizations': 'View realizations',
    'cta.read_more': 'Read more',

    'lang.switch_to': 'PL',
    'lang.switch_aria': 'Switch language to Polish',

    'footer.company': 'Company',
    'footer.legal': 'Legal',
    'footer.privacy': 'Privacy policy',
    'footer.cookies': 'Cookie policy',
    'footer.copyright': '© {year} Strefa Expo. All rights reserved.',

    'meta.home.title': 'Strefa Expo — custom-built trade fair stands',
    'meta.home.description':
      'Design, manufacturing, transport, installation and dismantling of trade fair stands in Poland and the EU. 5-step process, no missed deadlines.',

    'process.step.1.title': 'Design',
    'process.step.1.desc':
      'Brief, 3D concept, material selection. You see the visualization before we manufacture.',
    'process.step.2.title': 'Manufacturing',
    'process.step.2.desc':
      'CNC, large-format print, modular aluminum, custom furniture — all in-house.',
    'process.step.3.title': 'Transport',
    'process.step.3.desc':
      'Logistics for fairs across Poland and the EU. Full accountability on delivery time.',
    'process.step.4.title': 'Installation',
    'process.step.4.desc':
      'On-site crew, 24/7 build until the stand is fully ready for opening day.',
    'process.step.5.title': 'Dismantling',
    'process.step.5.desc':
      'After the fair — fast dismantling and warehousing of reusable elements.',

    'realizations.heading': 'Selected realizations',
    'realizations.empty': 'Coming soon — first realizations are landing shortly.',
    'realizations.meta.client': 'Client',
    'realizations.meta.fair': 'Fair',
    'realizations.meta.year': 'Year',
    'realizations.meta.city': 'City',
    'realizations.meta.area': 'Area',

    'contact.heading': 'Tell us what you need',
    'contact.subheading':
      'Short brief — we come back with a preliminary quote within 1 business day.',
    'contact.form.fair': 'Fair (event name)',
    'contact.form.date': 'Date',
    'contact.form.area': 'Area (m²)',
    'contact.form.budget': 'Budget (from – to)',
    'contact.form.message': 'Stand description / what you need',
    'contact.form.email': 'Your email',
    'contact.form.phone': 'Phone',
    'contact.form.consent':
      'I consent to the processing of my data to receive a response.',
    'contact.form.submit': 'Send brief',
    'contact.form.success':
      'Thanks — we will get back to you within 1 business day.',
    'contact.form.error':
      'Something went wrong. Please try again or email us.',

    'consent.title': 'Cookies and analytics',
    'consent.message':
      'We use cookies for traffic analytics (Google Analytics 4). No tracking scripts load without your consent.',
    'consent.accept': 'Accept all',
    'consent.reject': 'Only necessary',
    'consent.preferences': 'Preferences',
  },
} as const satisfies Record<Locale, Record<string, string>>;

export type UIKey = keyof (typeof UI)['pl'];
