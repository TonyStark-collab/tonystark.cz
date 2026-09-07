# Zabezpečení webu

Web je statická stránka na GitHub Pages. Změny zabezpečení nemají měnit obsah ani vzhled.

## Ochrany v kódu

- Každá stránka má před načítáním zdrojů Content-Security-Policy v HTML.
- JavaScript, styly a fonty pocházejí z vlastní domény. Inline skripty, obsluhy událostí, vložené styly, rámce, objekty a formuláře jsou zakázané.
- Pouze denní přehled smí přes JavaScript kontaktovat `https://api.open-meteo.com`. Požadavky neposílají přihlašovací údaje ani referrer a nepřijímají přesměrování.
- Animace nastavují jednotlivé CSS vlastnosti přes DOM; není nutné povolovat `unsafe-inline` ani `unsafe-eval`.
- Referrer pro běžné odkazy je omezen pravidlem `strict-origin-when-cross-origin`.

Kontrola při pull requestu a zápisu do main prověřuje politiky všech stránek, aktivní HTML, zdroje, běžné vzory tajných klíčů, syntaxi JavaScriptu a známé zranitelnosti závislostí. Nenahrazuje ruční kontrolu změn.

Lokálně ze složky projektu spusť `python3 .github/scripts/check_security.py` (Python 3, bez dalších balíčků) a `npm audit` (Node.js a npm, připojení k registru). Syntaxi jednotlivého skriptu ověří například `node --check assets/concert-motion.js`.

Při změně CSP ověř úvodní animace, mobilní nabídku, kopírování zadání a počasí v prohlížeči. Ochranu neoslabuj jen kvůli vývojovému serveru; pro přesný statický náhled lze použít `python3 -m http.server 5173 --bind 127.0.0.1` a otevřít `http://127.0.0.1:5173/`.

## Nastavení mimo zdrojový kód

Následující kroky musí být nastavené a ověřené samostatně; tento soubor je nezapíná:

1. **Vlastnictví domény:** v osobním nastavení GitHubu otevři Pages, přidej `tonystark.cz`, vlož přesný vygenerovaný TXT záznam do DNS u registrátora a dokonči Verify. TXT záznam ponech. Jde o nastavení profilu, nikoli repozitáře. [Postup GitHubu](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/verifying-your-custom-domain-for-github-pages).
2. **Větev main:** zakaž její smazání a force push, vyžaduj pull request a úspěšnou kontrolu `Static site security`. Požadavek schválení druhým člověkem zapínej jen s dostupným dalším správcem. [Ochrana větví](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches).
3. **Účty:** ověř dvoufaktorové přihlášení, obnovu přístupu a oprávnění aplikací u GitHubu, registrátora a obnovovacího e-mailu.
4. **HTTP hlavičky:** HSTS, `X-Content-Type-Options: nosniff`, Permissions-Policy a `frame-ancestors` vyžadují konfiguraci vrstvy skutečně obsluhující web. `frame-ancestors` vložené do HTML meta nemá účinek. Nenasazuj dlouhé HSTS s `includeSubDomains` nebo preload bez kontroly všech relevantních služeb. [MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Content-Security-Policy/frame-ancestors).

Před přidáním další externí služby zvaž, jaké údaje jí budou předávány. Web nepotřebuje tajné API klíče; do veřejného repozitáře nepatří hesla ani `.env` soubory.
