# Scrollovací příběh — samostatná ukázka

Adresa: `/pribeh/`. Hlavní stránka zůstává beze změn. Ukázka má `noindex`.

Deset kapitol propojuje přírodu, Tonyho počítačovou historii, svatbu v roce 2023, AI, tvorbu webu a osobní fotografie z Masters of Rock. FX-6300, 16 GB DDR3, GTX 960 2 GB, Corsair zdroj a Obsidian 800D jsou uvedeny v samostatné kapitole. Ilustrační PCB není vydávána za fotografii této sestavy.

## Pohyb a dostupnost

Nativní posouvání stránky řídí jediný canvas na pozadí: přiblížení krajiny, optické průchody mezi světy, proměnu listu v PCB, odhalení skutečných archivních fotografií, sestavení miniatury webu a přechod denní festivalové fotografie v noční. Animace neběží při zastaveném scrollování. Nejde o video ani o fyzikální 3D model.

Text je v HTML, nikoli v obrázcích. Mobil má vlastní umístění textu, výřezy obrazů a omezené rozlišení canvasu. Režim „Klidné čtení“, preference omezeného pohybu, nízký viewport a vypnutý JavaScript poskytují běžně čitelnou stránku. Ovládání kapitol funguje klávesnicí i dotykem.

Čtyři nové WebP ilustrace mají dohromady přibližně 395 kB. Ostatní fotografie, textura a fonty jsou již součástí webu. Obrázky se načítají ze stejné domény; stránka nevyžaduje nové externí služby ani závislosti.

## Ověření 2026-09-18

- V prohlížeči ověřen desktop 1363 × 936 a mobilní viewporty 390 × 844 a 320 × 720.
- Ověřeno skutečné posouvání, přechod list–PCB, navigace kapitol, textová svatba, specifikace FX, dlouhé texty o AI a přepínání klidného čtení.
- Mobilní kontrola proběhla v prohlížeči; fyzický Android a iPhone nebyly testovány.
- `node --check assets/story-scroll.js` a bezpečnostní kontrola projektu prošly.
- Stávajících 15 testů projektu prošlo; tyto testy nepokrývají vizuální animaci nové ukázky.

Texty i rytmus přechodů jsou připraveny pro další doladění po Tonyho prohlídce skutečné stránky.
