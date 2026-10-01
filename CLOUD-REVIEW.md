# Cloud review — 1. října 2026

Základ: GitHub `main`, commit `8da65c178bdfc64ad345a45f0f274ee3ce7b93f2`.
Větev: `review/cloud-story-20261001`. Bez push, merge a veřejného nasazení.

## Výsledné chování

Úvodní stránka má patnáct plynule navazujících scén včetně úvodu. Delší původní texty jsou samostatně na `/vzpominky/`: počítačové začátky, taktování, internet, sestava, servis, síť, všech pět přehrávačů, AI a vznik webu. Číselné vzpomínky a původní nejistoty zůstaly v dlouhé verzi zachované. Hlavní cesta místo obecné definice promptu uvádí titulky vlastních videí, tento web a denní přehled.

GeForce používá SVG výřez skutečné karty z nezměněného rastru. Stín a odraz vznikají při vykreslení. Procesory v dlani, X96, síť, svatba a festival mají vlastní kompozice; neopakují se CPU pozadí, karty ani rámečky. Všechny původní rastrové soubory zůstaly beze změny. Ilustrační první PC je označené jako AI rekonstrukce.

Text není součástí scrollovací animace a neztrácí opacity. Přepínač pohybu nemění rozměry nebo pořadí kapitol. Systémová preference reduced-motion má přednost; ruční preference se ukládá a synchronizuje mezi kartami. Menu přesouvá fokus do cíle, Escape jej vrací na ovládání menu. Bez JavaScriptu zůstávají scény a nativní navigace čitelné.

## Ověření

- Chromium: 1440 × 1000, 390 × 844, 320 × 720 a 844 × 390.
- V každé velikosti všech 15 scén: čitelnost, chybějící obrázky, horizontální overflow; všechny menu kotvy, přímý vstup `#svatba`, šest skutečných kliknutí přepínače, dva přepínače mezerníkem, změna systémové preference, uložení preference po reloadu, Enter/Escape v menu.
- Výška dokumentu i pozice svatební kapitoly při přepnutí zůstaly shodné. Žádné chyby konzole nebo JavaScriptu při těchto kontrolách.
- 320px varianta bez JavaScriptu: viditelný svatební text a skryté nepoužitelné tlačítko pohybu.
- Vzpomínky: všech pět přehrávačů, celý dlouhý text a žádný horizontální overflow ve čtyřech velikostech.
- 60 interních odkazů a jejich kotvy: existují.
- Všech 15 dosavadních Node testů prošlo. Bezpečnostní kontrola prošla pro 14 HTML stránek; syntaxe všech JS souborů v assets prošla. `npm audit --audit-level=low`: 0 zranitelností.
- `npx vite build` doběhl. Existující Vite konfigurace je však pouze pro jednu vstupní stránku a hlásí nebundlovaný klasický script. Výstup `dist` není ověřený kompletní distribuční balík; testován byl statický web přímo z repozitáře, který zachovává cesty podstránek a assets.

Pro reprodukci prohlížečových regresí spusť statický server z kořene repozitáře (`python3 -m http.server 4173`) a v prostředí s Playwrightem:

```sh
CHROMIUM_PATH=/usr/bin/chromium node .github/scripts/journey.browser.cjs
```

`CHROMIUM_PATH` lze vynechat pro prohlížeč nainstalovaný Playwrightem; `STORY_BASE_URL` mění adresu testovaného webu. Playwright 1.62.1 byl v cloudovém runtime dostupný, není novou závislostí webu.

## Vizuální kontrola a limity

Ručně prohlédnuty skutečné screenshoty úvodu, procesorů, her, GeForce, sítě, X96, svatby, AI, tvorby a festivalu. Dále úzký 320px GeForce a Vzpomínky a svatba na šířku. Ověření proběhlo v desktopovém Chromium s různými viewporty, nikoli na fyzickém Androidu/iPhonu; Safari a Firefox nebyly ověřeny.

Schválenou Library referenci `libfile_5fbea45589688191b2602167f66064bc` nešlo materializovat ani po jednom podporovaném opakování. Implementace vychází z popsaného principu a skutečně prohlédnutých originálních fotografií repozitáře, nikoli z tvrzení o shodě s nedostupným obrázkem. Upload tří screenshotů přes aktuální Library helper skončil síťovou chybou již při získávání nástrojů, rovněž po povoleném opakování. Nevzniklo žádné potvrzené Library ID výsledku.

Screenshoty a protokol jsou uloženy v cloudovém executorovi v `/workspace/review/`; jde o cestu tohoto prostředí, nikoli Tony-PC. Není k dispozici veřejný náhled, protože publikování nebylo schváleno. Návrh vyžaduje uživatelovu vizuální review před případným pushováním nebo nasazením.
