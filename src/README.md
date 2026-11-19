# AAMINAHSPACE - personal brand & portfolio site

Editorial-luxury single-file SPA (hash-routed) built for Perchance preview + easy port to GitHub/Vercel.

## Structure
- `index.html` - all pages (home, about, services, experience, 3 case studies, contact) as hash routes (`#/home`, `#/about`, …; experience lives at `#/work`). Home: loader, live clock, rotating word, counters, vibe quiz, FAQ, now list. Copy rule: short lines only, no long paragraphs, no em dashes. Portrait: `figure.arch` in the home hero uses `src/portrait.jpg` (warm brown portrait, compressed).
- `src/styles.css` - design system (dark cocoa palette `#221410 / #F4E8D7 / #C08A5A / #C9A87F / #2D1B13`, Cormorant Garamond + Manrope, film grain, responsive, reveal animations).
- `src/app.js` - router, reveal-on-scroll, filters, mobile menu, contact validation (an inlined copy also lives at the end of `index.html` for reliable preview - keep the two in sync).
- `src/cv/Aaminah-Khan-CV.pdf` - downloadable one-page CV, built only from portfolio facts. No invented dates, employers or metrics. Linked from the Experience page with a Download CV button.
- `main.pjs` - only `$meta` (SEO title/description/tags) + site name.

## Source honesty (important)
All copy is drawn from the 19-page PDF text (`scratch/pdf-text-new.txt`):
- Bio, vision, mission, expertise, "How I can help", email `khanaaminah3@gmail.com`, Instagram `@aaminahspace`, and case-study wording (brand feed pp.6-8, launch pp.9-10, Undercover Sisters p.13).
- About "My promise" pull-quote from the p.5 goal line. Testimonials are real client words from the review screenshots the user sent. No names invented. Image-only PDF insights (pp.8/11/12) and highlights (p.17) stay as placeholders. Do not invent quotes or metrics.
- Project names "Sukhan / Luxury Hair Spa / Calligraphy Artist" come from the commissioning brief, not verifiable PDF text → listed as one "to confirm" card, not as fake case studies.
- No client names invented; launch client stays "private".
- LinkedIn `https://www.linkedin.com/in/aaminah-khan-41b680379/` is linked in Contact and footer per user instruction.

## Contact form
Default: browser validation + `mailto:` compose (no fake backend, no silent failure). Success state confirms and falls back to the direct email link.
To use a real backend, replace the submit handler in `src/app.js` with e.g.:
```js
await fetch("https://formspree.io/f/YOUR_ID",{method:"POST",headers:{"Accept":"application/json","Content-Type":"application/json"},body:JSON.stringify({name,email,brand,type,msg})});
```
(Netlify Forms: add `netlify` attribute + hidden `form-name` input.)

## Porting to React + TS + Tailwind (GitHub/Vercel)
The brief asks for React/TS/Tailwind. The live Perchance build is dependency-free for speed, but maps 1:1:
- Each `.page[data-page]` → `pages/<Name>.tsx`; `.service-detail`, `.p-card`, `.testi`, `.cta-dark`, contact form → `components/*.tsx` (props mirror the current markup).
- `src/styles.css` variables → `tailwind.config` theme (`bg`, `ink`, `brown`, `muted`, `surface`; `font-display`, `font-body`).
- `src/app.js` router → `react-router` (`#/home` → `/`, etc.); filters/reveal become hooks.
- Deploy: `vite build` → Vercel static; keep `public/` assets, add real OG image + favicon, wire the form endpoint above.

## Test
Load preview → visit `#/home #/about #/services #/work #/case-brand #/case-launch #/case-undercover #/contact` at 390×844 and 1440×900; check no horizontal overflow, Lucide icons render, form validates.

Audit notes: header CTA had a real color bug (menu styles overrode the cream pill: pale text, flat shape). Fixed with `.nav-links a.btn` rules. Removed dead CSS (old collage, slider, dots, toast, monogram blocks). Fixed calm-mode bug (quiz and counters now work with reduced motion). Menu button label toggles Open/Close. Body uses overflow-x:clip. Rotating word reserves width so the headline does not jump.
