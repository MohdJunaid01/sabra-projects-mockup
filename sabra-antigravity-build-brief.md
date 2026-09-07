# Sabra Projects — Interactive Digital Project Planner
### Build Brief for Antigravity

## 1. What we're building

A single-page interactive proof-of-concept demo (NOT a full website, NOT a production system) that shows Sabra Projects how their existing website (sabraprojects.com.au) could evolve into a lead-qualifying "Digital Project Planner."

Journey: **Explore → Design → Estimate → Consult**

This is a 60-second demo piece. Everything should feel finished and premium, but no backend, no real pricing engine, no real calendar/CRM integration, no payments.

## 2. Visual identity — brand + reference, combined

**Brand source (must use — this is what makes it feel like "Sabra's" upgrade, not a generic demo):**
- Pull the actual color palette from Sabra's existing site and logo (sabraprojects.com.au) — their signature red (used on CTA buttons and logo mark), black, and white
- Use the Sabra logo in the header/nav, matching their current site's placement style

**Direction/reference (style and UX pattern inspiration ONLY — do not copy layout, text, or assets 1:1):**
- Reference image provided: a dark-theme kitchen/furniture landing page (Cyrillic reference site) — near-black backgrounds, warm accent color, large editorial serif headlines paired with clean sans-serif UI text, generous whitespace, thin borders, minimal rounded corners
- Borrow the *structural ideas*: the step-based cost calculator UI pattern (shape/size/material selection → "Calculate" → result), the free-consultation CTA block styling, the material/finish selection card pattern
- **Replace their terracotta/copper accent with Sabra's actual red** — this is the key fusion: dark editorial theme + Sabra's own brand red instead of a generic accent color

**Resulting palette:**
- Near-black background (~#0B0B0A / #121212 range)
- Sabra red — **exact hex `#EC202B`**, sampled directly from the logo — as the single accent color (CTAs, active states, highlights, hotspot pins, active swatch borders)
- White / warm off-white (`#F5F3EF`-ish) for headline text and cards
- Warm neutral grays for secondary text and borders
- No gradients, no drop shadows beyond subtle depth, no heavily rounded corners — thin borders, generous spacing

**Logo asset:** `1788799373290_image.png` (square red-and-white wordmark, "Sabra" over "PROJECTS") — place in header/nav; on the near-black background, use the white reversed/knockout version if available, otherwise place the logo on a small white or transparent chip so it doesn't collide with the red accent color.

**Typography:**
- Large editorial serif for section headlines ("YOUR KITCHEN. YOUR MATERIALS. YOUR VISION.")
- Clean modern sans-serif for UI labels, buttons, body text
- Small uppercase technical labels under material options (e.g. "01 / NATURAL OAK")

## 3. Tech approach

- Single-page React app, Three.js for the 3D scene (r128-compatible — no OrbitControls import, build custom pointer-drag rotate + scroll zoom)
- 3D kitchen: built from clean primitive geometry (box cabinet fronts, slab benchtop, cylinder/bar hardware) — NOT a photorealistic modeled asset. Soft studio lighting, warm material colors. This stylized-minimal approach is intentional and matches the editorial brand direction, not a placeholder.
- One shared state object carries selections across all sections: `{ cabinetFinish, benchtop, hardware, projectType, size, finishLevel, features, budgetRange, suburb, timeline }`
- Scroll-driven section transitions (fade/slide between Explore → Estimate → Consult), avoid excessive animation

## 4. Sections to build

### A. Hero
Full-bleed dark kitchen-adjacent visual or 3D teaser. Big serif headline + short line ("A smarter way to start your renovation."). Single CTA scrolls into the experience.

### B. Material Lab (Explore + Design)
- 3D kitchen scene, drag to rotate, scroll to zoom
- Swatch panel: Cabinet finish (Natural Oak / Smoked Oak / Matte Black / Warm White), Benchtop (Calacatta / Travertine / Charcoal / Concrete), Hardware (Brushed Brass / Black / Steel) — clicking a swatch updates the 3D material instantly
- 2–3 hotspots on the model (project world position → screen position) with short labels on hover/tap
- Running selection summary chip building as choices are made
- CTA: "Estimate your project" → carries selections forward

### C. Budget Estimator
- Multi-step, one question per screen, large typography (matches reference calculator pattern): project type → size → finish level → optional features (checkboxes: island, stone benchtop, integrated appliances, custom storage)
- Pre-filled/aware of Material Lab selections
- Result: indicative range (e.g. "$40K–$60K AUD"), clearly labeled "Indicative project range — final pricing depends on design, materials and site requirements"
- CTA: "Take the next step" → carries everything forward

### D. Consultation Funnel
- 4 steps: project type (pre-filled) → Sydney suburb → budget confirm (pre-filled) → timeline (Immediately / 1–3 months / 3–6 months / Just exploring)
- Summary card showing everything collected before final step (materials + budget + timeline)
- Preview consultation time-slot picker (clearly labeled "Preview availability" — not real scheduling)
- Final CTA: "Request Consultation"

### E. Close
Short closing screen: "Explore → Estimate → Consult" + Sabra logo + Oelrix concept credit line.

## 5. What NOT to build
No backend, no real pricing engine, no real calendar/CRM, no payments, no dozens of material options (keep to the counts above), no full replacement of Sabra's existing site.

## 6. Tone reminder
This is being pitched as: *"We aren't proposing another website for Sabra. We're proposing an interactive digital project planner that sits on top of their existing website — letting a potential client explore materials, understand an indicative investment, and arrive at a consultation with a much clearer idea of what they want."*
