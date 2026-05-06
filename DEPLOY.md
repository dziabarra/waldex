# Deploy Waldex to Cloudflare

**Aktualny stan:** projekt jest podpięty jako **Cloudflare Worker** (nowy "static assets"
format, następca Pages) z git integration do `dziabarra/waldex`. Live URL:
**https://waldex.jtrzupek.workers.dev/**

Każdy `git push origin main` automatycznie triggeruje build + deploy.
Każdy push do innego brancha lub PR daje preview URL `<branch>-waldex.jtrzupek.workers.dev`.

Wrangler CLI nie jest wymagany do regularnych deployów — wszystko leci przez webhook GitHub → Cloudflare.

---

## 1. GitHub repo

Already pushed — see `git remote -v`.

## 2. Cloudflare Pages — pierwsze podpięcie (HISTORIA — już zrobione)

1. Idź na **dash.cloudflare.com** → zaloguj się (lub załóż konto, free tier wystarczy)
2. W lewym menu: **Workers & Pages** → **Create application** → **Pages** → **Connect to Git**
3. Autoryzuj GitHub, wybierz repo **`waldex`**
4. **Build settings:**
   - **Framework preset:** Astro
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
   - **Root directory:** *(leave blank)*
5. **Environment variables:** (rozwiń "Add variable" dla każdej)

   | Klucz | Wartość | Uwagi |
   |---|---|---|
   | `NODE_VERSION` | `22` | Wymagane — domyślnie CF używa Node 18 |
   | `PUBLIC_SITE_URL` | `https://waldex.pages.dev` | Po podpięciu domeny zmień na `https://<domena>.pl` |
   | `PUBLIC_CONTACT_EMAIL` | `Waldemar.sewerynn@gmail.com` | Tymczasowy do wymiany na firmowy |
   | `PUBLIC_GTM_ID` | `(puste lub np. GTM-XXXXXX)` | Pusty = GTM się NIE załaduje (ok dla preview) |
   | `PUBLIC_WEB3FORMS_KEY` | `(puste)` | Pusty = formularz fallback do `mailto:` |

6. **Save and Deploy**. Build trwa ~2-3 minuty, dostajesz URL `https://waldex.<random>.pages.dev`.

## 3. Po pierwszym deployu — sanity check

- Otwórz `https://<URL>/` — strona PL ładuje się, wszystko działa
- `https://<URL>/en` — strona EN
- `https://<URL>/realizacje/master-colors-plastpol-2025` — case study z galerią
- `https://<URL>/sitemap-index.xml` — sitemap zwraca 200 z hreflang
- `https://<URL>/robots.txt` — TODO: zaktualizować po podpięciu domeny
- DevTools → Network: przed kliknięciem cookie banner ZERO requestów do `google-analytics.com` (Consent Mode v2 default=denied OK)

## 4. Konfiguracja produkcyjna (po Waldku)

### 4a. Domena OVH

Po wybraniu nazwy firmy + zarejestrowaniu domeny w OVH:

1. **48h przed zmianą NS** w panelu OVH → DNS → ustaw TTL na **300s** dla wszystkich rekordów
2. Po 48h: w OVH → "Modyfikuj serwery DNS" → wpisz nameservery Cloudflare (dostarczone przez CF gdy dodajesz domenę)
3. W Cloudflare → dashboard → **Add a Site** → wpisz domenę → wybierz Free plan → CF skanuje istniejące rekordy
4. Cloudflare poda 2 nameservery typu `XXX.ns.cloudflare.com` — wpisujesz je w OVH
5. Po propagacji DNS (15min - 24h): w **Workers & Pages → waldex → Settings → Domains & Routes** → **Add** → wpisz domenę
6. Cloudflare auto-issue Universal SSL (~15-60 min)
7. **Update env var** `PUBLIC_SITE_URL` w **Workers & Pages → waldex → Settings → Build → Variables and secrets** na `https://<domena>.pl` → zatwierdź → push pusty commit (`git commit --allow-empty -m "Trigger rebuild for new domain"`) lub w UI **Deployments → Retry deployment**

### 4b. GA4 + GTM

1. Załóż konto **Google Analytics 4** dla Waldka (analytics.google.com)
2. Stwórz Property + Stream Web (URL: `https://<domena>.pl`)
3. Skopiuj Measurement ID `G-XXXXXX`
4. Załóż konto **Google Tag Manager** (tagmanager.google.com)
5. Stwórz container Web → skopiuj GTM ID `GTM-XXXXXX`
6. W GTM:
   - Dodaj GA4 Configuration tag z Measurement ID
   - Trigger: All Pages
   - Publish container
7. W Cloudflare Pages → Settings → Environment variables → ustaw `PUBLIC_GTM_ID=GTM-XXXXXX` → **Trigger redeploy**

### 4c. Web3Forms (formularz kontaktowy)

1. `web3forms.com` → wpisz Waldka maila → dostaniesz access key
2. CF Pages → env → `PUBLIC_WEB3FORMS_KEY=<klucz>` → redeploy
3. Formularz teraz POST-uje na Web3Forms zamiast `mailto:`

### 4d. Search Console

1. `search.google.com/search-console` → dodaj property domenową
2. Weryfikacja przez DNS TXT (Cloudflare DNS → dodaj rekord)
3. Submit sitemap: `https://<domena>.pl/sitemap-index.xml`
4. Powtórz dla Bing Webmaster Tools

## 5. Lighthouse / smoke test

Cele (z planu):
- LCP < 2s
- CLS < 0.05
- Performance score > 95

Test: `npx lighthouse https://<URL> --view` — lub PageSpeed Insights z UI.

## 6. Co później (post-launch)

- [ ] Polityka prywatności + cookies — wymienić `[NAZWA FIRMY]`/`[NIP]` na realne dane
- [ ] Mapa do `/kontakt` (statyczny obraz, NIE iframe)
- [ ] og:default.jpg (1200×630) zamiast pustego
- [ ] Per-locale 404 obsługa (Cloudflare _redirects)
- [ ] Optymalizacja fontów (zostawić tylko 400 + 600, oszczędność ~50 KB)
- [ ] View Transitions na klastrze realizacje (Astro `<ClientRouter />`)
- [ ] Linki social media w stopce gdy Waldek poda
- [ ] Sekcja "Zaufali nam" z logami klientów
