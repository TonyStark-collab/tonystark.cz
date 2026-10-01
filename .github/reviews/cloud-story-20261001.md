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
- Produkční cesta je potvrzená z úspěšného běhu [pages build and deployment 36652748863](https://github.com/TonyStark-collab/tonystark.cz/actions/runs/36652748863), commit `8da65c1` na `main`: Checkout → `actions/jekyll-build-pages@v1`, source `.`, destination `./_site` → upload `github-pages` z `./_site` → Deploy to GitHub Pages. Log uvádí Jekyll 3.10.0, žádný konfigurační soubor a skutečné zahrnutí HTML podstránek i adresáře assets do archivu.
- Vite slouží pouze jako vývojový server (`package.json` má jen script `dev`). `npx vite build` sice doběhl s upozorněním na klasický script, ale **není produkční distribuční mechanismus**. Změna Vite konfigurace není potřeba. Nové soubory jsou obyčejné statické HTML/CSS/JS bez front matter a zachovávají stejný mechanismus jako existující stránky.
- Kompletní graf 618 lokálních odkazů a assetů přes všech 14 HTML stránek, CSS a SVG: žádný chybějící či nesledovaný soubor nebo neexistující HTML kotva. Zahrnuje `/vzpominky/`, nové styly, SVG vložený rastrový obrázek a fonty.
- Tento review protokol je v `.github/reviews/`, aby se z něj při budoucím Jekyll nasazení nestala veřejná stránka. Produkční workflow nebylo spuštěno ani změněno.

Pro reprodukci prohlížečových regresí spusť statický server z kořene repozitáře (`python3 -m http.server 4173`) a v prostředí s Playwrightem:

```sh
CHROMIUM_PATH=/usr/bin/chromium node .github/scripts/journey.browser.cjs
```

`CHROMIUM_PATH` lze vynechat pro prohlížeč nainstalovaný Playwrightem; `STORY_BASE_URL` mění adresu testovaného webu. Playwright 1.62.1 byl v cloudovém runtime dostupný, není novou závislostí webu.

## Vizuální kontrola a limity

Ručně prohlédnuty skutečné screenshoty úvodu, procesorů, her, GeForce, sítě, X96, svatby, AI, tvorby a festivalu. Dále úzký 320px GeForce a Vzpomínky a svatba na šířku. Ověření proběhlo v desktopovém Chromium s různými viewporty, nikoli na fyzickém Androidu/iPhonu; Safari a Firefox nebyly ověřeny.

Schválenou Library referenci `libfile_5fbea45589688191b2602167f66064bc` nešlo materializovat ani po jednom podporovaném opakování. Implementace vychází z popsaného principu a skutečně prohlédnutých originálních fotografií repozitáře, nikoli z tvrzení o shodě s nedostupným obrázkem. Upload tří screenshotů přes aktuální Library helper skončil síťovou chybou již při získávání nástrojů, rovněž po povoleném opakování. Nevzniklo žádné potvrzené Library ID výsledku.

Screenshoty a protokol jsou uloženy v cloudovém executorovi v `/workspace/review/`; jde o cestu tohoto prostředí, nikoli Tony-PC. Není k dispozici veřejný náhled, protože publikování nebylo schváleno. Návrh vyžaduje uživatelovu vizuální review před případným pushováním nebo nasazením.

## Konkrétní vizuální QA

- GeForce: SVG obrys odstraňuje rušivé původní okolí, karta má kontaktní stín a odraz ve stejné ploše jako text. Mobil 390 px ukazuje kartu i hlavní text najednou. Na 320 × 720 už karta pokračuje pod přehybem; nic se neořezává pevným kontejnerem, ale vizuální pointa přichází později.
- Svatba: původní ruce a prsteny přecházejí do modrošedé atmosféry, bez samostatného rámečku. Obří rok dává kapitole jasnou pauzu. Na landscape 844 × 390 zabere datum většinu prvního pohledu a věta ANO následuje při scrollu; je to čitelné, ale ne tak vyvážené jako portrait.
- Festival: fotografie skutečně tvoří celé prostředí a po opravě se při vstupu nezobrazují dvě překrytá pódia. Obloha dává prostor textu. Noční varianta vyžaduje další posun; při vypnutém pohybu se používá statická noční fotografie.
- Procesory a X96: zůstává originální barevnost, zrno a nedokonalost vlastních fotek. Jemná maska pomáhá spojení s okolím; není to přesný fyzický výřez jako u GeForce. Na mobilu X96 ještě převažuje text nad fotografií. To jsou konkrétní body pro uživatelovu vizuální review, ne tvrzení o dokonalém finálním designu.

## Přesná příčina zablokovaného předání

Použit aktuální `library_upload.py` s celým batch requestem pro tři screenshoty. Selhal před `prepare_uploads`, při JSON-RPC `tools/list` na výchozím endpointu `https://chatgpt.com/backend-api/wham/apps`: `library upload failed: hosted apps tools/list request failed: network`. Neautentizovaný diagnostický HEAD na stejný origin doložil příčinu: `URLError: <urlopen error Tunnel connection failed: 403 Forbidden>`. Blokaci vrací proxy při CONNECT, tedy před odpovědí Library. Standardní i povolený eskalovaný pokus měly stejný výsledek. Další retry bez změny sítě by opakoval známou doménovou restrikci.

Minimální požadavek pro dokončení: ve vybraném cloudovém executorovi povolit HTTPS egress na `chatgpt.com:443` pro autorizovaný Library helper; po přípravě musí být dostupné také konkrétní podepsané upload cíle vrácené Library. Žádné tokeny nemá uživatel posílat. Alternativou je podporovaný přenos souborů z tohoto executorového prostředí do Work workspace s dostupným Library workflow. Samotné předání lokálních cest jinému prostředí soubory nezpřístupní. Nevzniklo žádné potvrzené ID screenshotu ani ZIPu.
