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

## Keyboard compositing correction

Removed the CSS photo border and clipped the original photograph to the keyboard's actual outline. A wrapper casts a small contour-following shadow. Original image bytes, displayed image dimensions, position, angle and key lettering are preserved. Desktop screenshot checked; mobile document at 375px client width has no horizontal overflow, image loads at its original 2352px source width, and computed border is zero. No new bitmap asset or generated lettering was introduced.

## Selected-reference detail pass

final result: passed

Compared the attached 18954.png reference and a full rendered homepage together in `tony-detail-comparison.jpg` (session QA). Refined typography with self-hosted Roboto Condensed, heading proportions, bigger layered guide art, exact supplementary copy, hero handwritten note, paper texture, a quieter concert composition and footer navigation. Exact OpenAI SVG and the previously approved real keyboard cutout remain intact.

Iterations corrected visible asset backgrounds with contour clipping, overly strong paper texture, guide heading wrapping, and number spacing at desktop/mobile sizes. Inspected the updated desktop guide section after the initial comparison. The headline and regular-weight concert heading follow the approved user instructions.

Verified 390px mobile frame without horizontal overflow; menu opens and Escape closes; homepage CTA scrolls to guides; Codex link reaches its existing page. Browser logs show only extension metadata errors, no application error. Existing guide contents and secondary routes remain unchanged.

Remaining visual differences are limited to the exact photographic subjects/paper tears and subtle distressed lettering of the raster reference. The real keyboard is deliberately retained as requested.
