# Design System: High-End Automotive Editorial

## 1. Overview & Creative North Star
The Creative North Star for this system is **"The Precision Atelier."**

Moving away from the cluttered, utilitarian aesthetic of traditional auto-glass repair, this system treats windshield service as a high-tech craft. We are moving from "fixing a crack" to "restoring structural clarity." The visual language borrows from luxury automotive interfaces and high-end horology: expansive whitespace, intentional asymmetry, and a deep, immersive dark mode that feels like a private showroom at night.

We break the "template" look by using **High-Contrast Layering**. Instead of standard grids, elements should feel like they are floating in a vacuum of deep forest green and obsidian, using overlapping typography and glassmorphism to create a sense of three-dimensional depth and premium precision.

---

## 2. Colors & Surface Architecture
The palette is rooted in the depth of `primary_container` (#0F3D1C) and the void of `surface` (#131313).

### The "No-Line" Rule
To maintain a boutique feel, **1px solid borders are strictly prohibited** for sectioning or containment. Boundaries are defined exclusively through background shifts. For example, a `surface_container_low` section sits directly on a `surface` background. The eye should perceive the change in depth through tonal transition, not a structural line.

### Surface Hierarchy & Nesting
Treat the UI as a physical stack of luxury materials (carbon fiber, tinted glass, brushed metal).
* **Base Level:** `surface` (#131313) – The foundation of the "Showroom."
* **Secondary Level:** `surface_container_low` (#1B1B1B) – Used for large content blocks.
* **Elevated Level:** `surface_container_highest` (#353535) – Reserved for interactive cards and floating menus.

### The "Glass & Gradient" Rule
To achieve a "high-tech" feel, use **Glassmorphism** for floating elements. Apply `surface_variant` at 40% opacity with a `backdrop-filter: blur(20px)`.
* **Signature Texture:** Use a subtle radial gradient transitioning from `primary_container` (#0F3D1C) to `surface` (#131313) in hero sections to mimic the curvature and reflection of automotive glass.

---

## 3. Typography
We use a dual-sans serif approach to balance technical precision with editorial authority.

* **Display & Headlines (Manrope):** Chosen for its geometric purity. `display-lg` (3.5rem) should be used with tight letter-spacing (-0.02em) to create a "bold" automotive statement.
* **Body & Labels (Inter):** The industry standard for legibility. Inter provides the "technical manual" feel that suggests expertise and clarity.
* **Editorial Contrast:** Pair a `display-md` headline in `on_surface` with a `label-md` in `primary` (all-caps, tracked out to 0.1rem) to create a high-fashion boutique hierarchy.

---

## 4. Elevation & Depth
In this system, depth is a functional tool, not a decoration.

* **Tonal Layering:** Avoid shadows for static elements. Place a `surface_container_lowest` card on a `surface_container_low` background to create a "recessed" look, mimicking precision-cut dashboard components.
* **Ambient Shadows:** For "floating" interactive states (like a hovered repair quote), use an extra-diffused shadow: `box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4)`. The shadow must never be pure grey; it should feel like an occlusion of the deep green background.
* **The "Ghost Border" Fallback:** If a container requires definition against a complex background, use `outline_variant` at **15% opacity**. It should be felt, not seen.
* **Glass Depth:** When using glassmorphism, use a `1px` top-border in `outline` at 20% opacity to simulate the "edge" of a pane of glass.

---

## 5. Components

### Buttons (The "Control" Set)
* **Primary:** Solid `primary` (#A1D3A5) with `on_primary` text. Use `rounded-sm` (0.125rem) for a sharp, machined look.
* **Secondary:** `surface_container_highest` background with `on_surface` text. No border.
* **Tertiary:** Transparent background, `on_surface` text, with a `primary` 2px underline that only spans 50% of the text width.

### Cards & Lists (The "Chassis")
* **No Dividers:** Forbid the use of horizontal lines. Use spacing `8` (2.75rem) to separate list items.
* **Interactive Cards:** Use `surface_container_low`. On hover, transition to `surface_container_high` and apply a `primary` glow to the left edge (2px width).

### Input Fields
* **Style:** Minimalist. Only a bottom border using `outline_variant`.
* **Focus State:** The bottom border transforms into a `primary` 2px line. The label moves from `body-md` to `label-sm` and changes color to `primary`.

### Specialized Boutique Components
* **The "Clarity" Slider:** A custom UI component for comparing "Before" and "After" repair shots. Uses a `primary` vertical line with a glassmorphic handle.
* **Precision Chips:** Used for glass types (OEM, OEE). Small `label-sm` text inside a `surface_container_highest` capsule with `primary_fixed` icons.

---

## 6. Do’s and Don’ts

### Do
* **DO** use extreme whitespace (Spacing `16` and `24`) to make the service feel exclusive and unhurried.
* **DO** use "Manrope" for all numerical data (prices, repair times) to emphasize the high-tech, digital-gauge aesthetic.
* **DO** use `surface_bright` (#393939) sparingly for subtle highlights on "active" states.

### Don’t
* **DON'T** use `rounded-full` for anything other than icons or status chips. The "Boutique" feel requires the structural integrity of `rounded-sm` or `none`.
* **DON'T** use pure #000000 for backgrounds. Use the specified `surface` (#131313) to allow for subtle depth and shadow interaction.
* **DON'T** use standard "Success" greens. Always use the `primary` (#A1D3A5) or `primary_fixed_dim` to maintain the sophisticated forest-green tonal range.