# Fit Minds Design System

Phase 7 uses a premium athletic-tech direction: dark-first, spacious, green-led,
and section-driven. These foundations are opt-in. Existing pages should migrate
only during their dedicated redesign phase.

## Color roles

- `--color-primary`: electric green for primary actions, active states, and key
  highlights. Do not use it as a general page fill.
- `--color-forest*`: branded feature surfaces and deep section backgrounds.
- `--color-bg*`: application base and dark elevation levels.
- `--color-surface-light` and `--color-surface-mint`: selective contrast
  sections, reports, and readable information surfaces.
- `--color-accent`: yellow for scarce high-attention actions and meaningful
  status—not general decoration.
- Semantic success, warning, danger, and info colors must be paired with text or
  icons so meaning never relies on color alone.

## Typography

Use the existing Inter/system stack only. Apply `.type-display`,
`.type-page-title`, `.type-section-title`, `.type-card-title`, and body utilities
for future migrations. Display and heading sizes use responsive `clamp()`.
Uppercase is reserved for short `.type-eyebrow` and label text.

## Spacing and layout

Spacing tokens run from `--space-1` (4px) through `--space-24` (96px).
Use `--section-gap` for major section rhythm and `--card-padding` for cards.

- `.app-container`: standard 1400px content width.
- `.app-container-narrow`: 832px reading/form width.
- `.page-shell`: responsive page padding.
- `.section-shell`: standard major-section separation.
- `.full-bleed`: viewport-wide section inside a container.
- `.mobile-nav-safe`: clearance for the fixed mobile navigation.

Avoid nested cards. Prefer spacing, surface changes, and typography for grouping.

## Shape, borders, and elevation

Use `--radius-sm/md/lg/xl`; reserve `--radius-pill` for badges, statuses, and
compact navigation controls. Major cards generally use `lg`, not pill shapes.

Use subtle borders by default. Primary borders and glows are for active or
important interactive elements. Avoid stacking multiple heavy shadows.

## Buttons

Base class: `.ui-button`.

- Variants: `--primary`, `--secondary`, `--accent`, `--ghost`, `--danger`.
- Sizes: `--sm`, default medium, `--lg`.
- Layout: `--full` for full-width actions.

Buttons support icons before or after text. Use native `disabled` for loading or
unavailable actions and expose loading state in visible text or `aria-label`.
Primary actions retain at least a 44px touch height.

## Cards

Base class: `.ui-card`.

- `--feature`: major feature with visual/icon space.
- `--information`: reports, forms, and calculated information.
- `--status`: compact values such as steps, BMI, or hydration.
- `--interactive`: link/button card with focus, hover border, and restrained lift.

Do not put multiple bordered cards inside another bordered card unless the
information hierarchy genuinely requires it.

## Badges

Use `.ui-badge` with primary, accent, success, warning, info, neutral,
recommended, beginner, recovery, S-tier, A-tier, or B-tier variants. Badges are
compact labels, not buttons. Always include readable text.

## Forms

Wrap controls with `.ui-field`, use `.ui-field__label`, and apply `.ui-control`
to inputs, selects, and textareas. Error and success states use `aria-invalid`
or the corresponding modifier. `.ui-check` covers native checkbox/radio sizing;
`.ui-segmented` is available only where segmented controls already fit the
feature.

Do not globally replace existing form classes. Migrate form-by-form later.

## Icons

Continue using the current inline SVG icon approach. Sizes are 16px, 20px, 24px,
and 32–48px feature scale through `.ui-icon` modifiers. Icon containers support
primary, accent, mint, and neutral variants. Decorative icons use
`aria-hidden="true"`; standalone controls require an accessible name.

## Motion and accessibility

Use fast motion for color changes, standard motion for hover/focus, and slow
motion only for meaningful entrances. Hover lift stays within 2–4px. Never add
looping glows or decorative motion.

Global keyboard focus uses a visible green outline, with forced-colors support.
Reduced-motion preferences effectively disable transitions and animations.
Semantic HTML, logical heading order, `aria-current`, and minimum touch sizes
remain required.

## Do / don’t

- Do use green selectively to guide action and establish brand.
- Do use light surfaces to create meaningful contrast.
- Do let whitespace and section rhythm establish hierarchy.
- Don’t make every surface a card or every control a pill.
- Don’t use yellow as a dominant fill.
- Don’t create fake data visualization or admin-dashboard density.
- Don’t migrate unrelated pages outside their scheduled Phase 7 redesign.
