# Design QA — 2026-09-05

final result: passed

Scope: approved editorial/concert design applied to the homepage and shared styles/navigation on all ten existing pages.

## Visual comparison

Inspected the approved reference and rendered desktop implementation together in a normalized comparison image (`tony-qa-final.jpg`, session QA artifact). Checked typography, spacing, colors, images, and copy.

- Anton display headings and Inter body copy reproduce the condensed editorial hierarchy. The concert heading deliberately uses regular weight.
- Ivory, ink and red establish the main palette; lime highlights Codex 02.
- Approved Czech headline, introduction including family, and concert section copy are present.
- Hero collage, concert strip and paper guide imagery follow the reference composition. A real public-domain keyboard photograph is embedded unchanged, preserving correct lettering. This intentionally differs from the generated keyboard in the reference.
- ChatGPT uses the OpenAI knot. Codex uses a terminal symbol.

First comparison found an overly tall hero and undersized desktop type. Corrected hero height, display sizes, wordmark, guide proportions and CTA sizes. Mobile guide columns were subsequently widened and their body text increased to 14px. Rechecked both corrections visually.

## Functional checks

- Validated local href/src targets and anchor IDs on all ten HTML pages: no missing targets.
- Confirmed both guide main-content texts match the previous committed versions.
- Desktop CTA reaches the guides section; ChatGPT link opens the guide; its contents link reaches #prompty.
- Tested mobile at 390px frame width: menu opens, Escape closes it, CTA reaches guides. Document scroll width equals client width (375px with scrollbar), without horizontal overflow.
- Inspected desktop guide and mobile guide listings for readable type and intact layout.
- All homepage images loaded successfully.
- Info panel shows date/time/name day and successfully loads Prague weather.
- Browser error log contained only a browser-extension metadata message; no application JavaScript error observed.

Existing guide information and external service behavior are outside this visual update's content scope.
