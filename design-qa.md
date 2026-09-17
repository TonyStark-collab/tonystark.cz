# Spatial background passage

final result: passed

Scope: user approved the first spatial passage across hardware and AI, with equal emphasis on mobile and desktop. Added decorative vector drawings of a generic processor and circuit board (not photographs of a specific product). Archive and FX rig use layered perspective, scale, translation, lighting and copper traces. AI progressively flattens the board, straightens curved traces, fades hardware and introduces background words. Existing archive photographs and all factual content remain. Wedding remains a quiet text-only break.

Browser checks: desktop 1363 × 936, mobile iframe 390/360/320 px. Inspected archive at CPU and reconstructed-PC phases, AI at tilted-board, straightening and final words phases, and FX rig on desktop and 360 px mobile. Fixed overly tall archive reading panels, moved decorative words above the scroll cue, retained readable small-screen text. No desktop or 320 px horizontal overflow; no application console errors. Toggling motion off hides the new layers and restores natural reading. Scripting only schedules frames after scroll/resize/visibility events; there is no continuous background loop.

New JavaScript syntax, security policy check for 12 HTML pages, whitespace check and 15 pre-existing regression tests pass. Those legacy tests do not test the new spatial drawing; new behavior was checked in browser. Decorative layers are aria-hidden and do not capture pointer events. No new dependencies or CSP relaxation. OS reduced-motion and short landscape viewports retain static fallback by code inspection. Physical-device performance and Safari were not tested.

---

# Reading contrast revision

final result: passed

User requested lighter backgrounds and clearer text rather than heavier font weight. AI scene now uses a flat cream surface, dark ink, distinct white question and pale green answer. Paper and creation surfaces are lighter; secondary text is darker and small mobile body text has a 14 px minimum in animated scenes. Festival scene retains its dark photographic setting. Scroll behavior and wording unchanged.

Browser verified desktop and 320 px mobile AI scene with complete answer visible; 360/390 px opening layouts inspected. Security checker passes for 12 pages and whitespace check passes. Physical Android not tested.

---

# Scroll narrative revision — 17 September 2026

final result: passed

User rejected the previous weak mobile scrollytelling and unrelated CPU/concert ending collage. This revision removes that collage and replaces the mobile static chapters with scroll-driven pinned stages, retaining the approved original imagery and warm paper / graphite visual identity.

Browser review: desktop 1363 × 936 and mobile iframe widths 390, 360, 320 px. Observed archive CPU → PC reconstruction on mobile and desktop; reverse scrolling restored CPU. Confirmed only the appropriate desktop image has opacity 1. Creation was observed at blank paper, heading and fully assembled homepage stages. AI prompt and answer reveal was observed at 320 px; changed clipping to vertical reveal for readable complete lines. Festival day → night observed on mobile, then enlarged photographic crop verified. Ending contains no photographic images. Motion toggle removes inert/aria-hidden from all archive steps and restores full natural content.

Fixed during review: animated rig specifications caused horizontal overflow (now clipped locally); old desktop active-image rule interfered with new timeline (removed); overlapping concert captions (now mutually exclusive); mobile concert image was too small (now fills scene width with centered crop). Final desktop and 390 px layouts show no horizontal overflow. No site console errors. New script syntax, security checker for 12 pages and 15 existing unrelated regression tests pass. No dependencies or CSP changes. Disclosures and links remain outside pinned stages except the currently active archive link.

Limits: mobile tested in browser iframe, not physical Android; OS reduced-motion preference is handled in code but not emulated. Viewports below 560 px height retain natural flow for readable landscape/zoom use. The previous QA entries below describe earlier iterations, not this current animation behavior.

---

# Personal scrollytelling QA — 17 September 2026

final result: passed

## Source and visual comparison

Approved storyboard images: exec-92758b50-9977-43bd-96b3-b0a18d6743af.png (scenes 1–4) and exec-c558ba6b-f6c1-4f21-be66-5654fa4e95a6.png (scenes 5–8). Both were opened alongside browser implementation captures. Existing repository photographs and collage are used; no hardware photo has been invented for the FX rig.

Desktop browser viewport: 1363 × 936. Mobile browser iframe viewports: 390 × 844, 360 × 780, 320 × 720. Final review route: /?review=3. Review captures include qa-desktop-rig-fixed.jpg, qa-desktop-wedding.jpg, qa-desktop-ai.jpg, qa-desktop-creation-start.jpg, qa-desktop-creation-end.jpg, qa-desktop-music.jpg, qa-desktop-ending.jpg, qa-mobile-opening.jpg, qa-mobile-scenes.jpg and qa-mobile-music.jpg. These are internal review artifacts, not deployed assets.

## Fidelity and corrections

- Typography: local Special Elite, Inter and Caveat. Oversized desktop heading corrected to two readable lines; mobile personal note restored to handwritten styling. Czech text remains selectable.
- Layout: eight linked scenes, sticky archive on desktop, natural stacked archive on mobile. No measured horizontal overflow at desktop or the narrow mobile widths.
- Color and materials: warm paper, rust accents, faint PCB, graphite AI scene, original festival photography. PCB contrast reduced after browser review to keep rig specifications readable.
- Motion: archive images change with scroll; miniature homepage expands over the creation scene on desktop. Mobile uses restrained transforms and normal document flow. Copy fades only in the desktop visual transition.
- Content: exact requested FX-6300, DDR3, GTX 960, Corsair case and PSU; text-only 2023 wedding before AI; prepared prompt example clearly labeled. Original longer homepage text retained in expandable details and existing subpages preserved.
- Imagery: actual existing assets; AI reconstruction labeled. Explicit dimensions added to lazy archive images. No broken loaded images in browser checks.

## Interaction and technical checks

Desktop and mobile chapter navigation checked. Archive scroll transition observed. AI explanation expands. Festival video control is reachable, does not autoplay and stays paused after its disclosure is closed. Motion toggle disables animations and restores natural archive flow. OS reduced-motion handling reviewed in CSS and JavaScript; not manually emulated. Browser logs contain no application errors (unrelated extension messages excluded).

Security checker passed for all 12 HTML pages with existing CSP retained. New JavaScript syntax check passed. Existing regression suite passed 15/15 tests. npm audit reported zero vulnerabilities. Same-page anchor targets verified. No actionable P0/P1/P2 visual findings remain.

## Limits

Mobile tested in browser iframe sizes, not on physical phones. Full video playback and OS-level reduced-motion emulation were not manually exercised. Copy is provisional as requested. No new animation library or runtime dependency was added.

---

# Daily overview visual QA — 7 September 2026

final result: passed

## Visual evidence

- Source visual truth: `/workspace/scratch/ff24d952cdc6/generated_images/exec-98a7f7ce-b3bf-494a-aa5e-8574a4ee8764.png` (941 × 1670 px).
- Browser implementation capture: `/tmp/daily-scene-reference-viewport.png` in browser runtime, 1363 × 1670 px with centered 941 × 1670 CSS-pixel iframe. Compare its central content at 1:1 density, excluding the gray browser stage.
- Additional desktop viewport: 1363 × 936 CSS px. Mobile: 390 × 844 CSS px iframe (375 px content plus scrollbar), `/tmp/daily-scene-mobile.png` in browser runtime.
- Route: `/info-panel/`, Monday 7 September 2026, loaded current weather. The reference contains sunbeams despite its overcast label; production correctly shows the overcast image for the observed conditions. The clock reflects actual capture time instead of the mock's fixed time.
- Source and final browser capture were opened together in the same comparison tool call. The full page and readable desktop/mobile views show the real assets, clock markings, calendar, weather controls, and footer.

## Intentional refinements approved for implementation

Smaller analog clock, discreet live digital time with subdued seconds, weather closer to the date, existing Anton/RobotoCondensed fonts instead of the mock's mixed serif fonts, responsive three-column desktop and two-column intermediate layouts. The selected visual direction is preserved with photographic landscape, evergreen paper dial, torn ivory calendar, cream header/footer, and red date/name accents. Backgrounds are illustrative, explicitly labeled, and switch between day, overcast, and night based on weather data.

## Comparison history and findings

1. P2: inherited paragraph margins stretched the calendar and displaced its date. Scoped paragraph rules now remove those inherited margins. Recaptured desktop and mobile show all calendar text inside the torn paper.
2. P2: the first calendar asset had an opaque rectangular exterior. Regenerated with genuine alpha transparency; WebP preserves it. Final capture shows landscape around irregular edges without a white rectangle.
3. P2: repeated edge-mask tiles created visible vertical seams. Replaced with one continuous raster mask; final capture shows a continuous paper transition.
4. P2: intermediate clock alignment left unnecessary space above the clock. Aligned near the calendar's top; final 941 px capture shows the intended grouping.

No actionable P0/P1/P2 findings remain.

## Required fidelity surfaces

- Typography: actual local Anton and RobotoCondensed loaded; Czech accents and two-line mobile title render correctly. Accurate numeric dial, live digital time, prominent red day number. Text remains selectable except the intentionally decorative analog clock canvas.
- Spacing/layout: compact scene replaces rectangular cards. Date/weather cluster stays beside the clock at intermediate widths. Mobile controls and footer remain reachable; measured body width and scroll width both 375 px. Desktop has no horizontal overflow.
- Colors/tokens: existing ivory, red, near-black, and evergreen retained. White weather copy has a dark photographic backing and text shadow. Keyboard focus is visible; controls have 44 px minimum height.
- Images: generated landscape variants and paper assets are compressed WebP. Clock and calendar preserve actual transparency. Stock Phosphor icons are used with the existing license; no emoji substitutes. Canvas marks/hands are live time visualization over the raster dial.
- Copy/content: live Czech date, day, nameday and existing fixed holiday data preserved. Existing navigation and project link preserved. Weather source, timestamp, retry/loading states and illustration label are explicit.

## Functional checks

- Browser city switch Praha → Brno returned 23 °C and Brno timestamp.
- Refresh displayed loading then restored Brno weather and enabled the control.
- Mobile city switch to Ostrava returned its weather and timestamp.
- Live digital seconds and analog hands advance across captures.
- Node validation checked exact clock-hand positions at 03:15:30, day/night/storm scene and icon mapping, and successful weather data rendering.
- JavaScript syntax and git diff whitespace checks passed.
- Browser console checked: no application errors. Unrelated browser-extension metadata errors excluded.

## Follow-up polish / limits

- Background landscapes are illustrative generated assets, not local live camera images. Three atmosphere variants intentionally do not depict every precipitation subtype.
- A physical mobile-device check was not performed; mobile was verified in a browser iframe.
- Existing nameday calendar remains indicative and excludes movable Easter holidays.
