# select

2026-07-04, transformation engine (legacy style `new-york`; stock wrapper). The most
restructured mapping: Content split into Portal > Positioner > Popup, Viewport → List,
ScrollButtons → ScrollArrows, `position` → `alignItemWithTrigger`. Typecheck clean.

## Changed

- `src/components/ui/select.tsx` — import → `@base-ui/react/select`.
  - `Select` is now a plain alias of `SelectPrimitive.Root` (the Root is generic
    over the value type and renders no element, so the data-slot wrapper had to go —
    keeping it broke generic inference at every call site).
  - Trigger: Icon `asChild` → `render={<Icons.chevronDown/>}`; classes unchanged
    (`data-[placeholder]:` still matches Base UI's presence attribute).
  - Content: user's `position='popper'` default → `alignItemWithTrigger={false}`
    default (preserves the dropdown-below-trigger look; radix `item-aligned` maps to
    `true`). The popper-only translate classes and List `scroll-my-1` stay
    conditional on that flag; `min-w-(--anchor-width)` replaces the viewport's
    `min-w-[--radix-select-trigger-width]`; vars → `--available-height` /
    `--transform-origin`; `data-[state=*]` → presence attrs.
  - Viewport → `List` (keeps `p-1`); ScrollUp/DownButton → ScrollUp/DownArrow with
    the required `top-0/bottom-0 z-10 w-full bg-popover` positioning (Base UI arrows
    are absolutely positioned; radix laid them out in-flow).
  - `Label` → `GroupLabel`; Item gains `data-highlighted:*` variants alongside
    `focus:*` (highlight without DOM focus, as with menus).
- Consumer fixes for the widened `onValueChange(value: string | null, details)`:
  `src/components/themes/theme-selector.tsx` (null-guard around `setActiveTheme`),
  `src/features/forms/components/sheet-product-form.tsx`
  (`field.handleChange(value ?? '')`).

## Left alone

- `select-field.tsx`, `data-table-pagination.tsx`, `conversation-select.tsx` —
  handlers type-check as-is.
- `[&[data-size]]:h-8` trigger override in pagination — our own attribute, intact.

## Behavior changes

- `SelectValue` now renders the RAW value string when no selected-item content is
  available (radix rendered the selected Item's text). All current usages have
  item labels equal to simple strings or pass `placeholder`, so nothing visibly
  changes; if labels ever diverge from values, pass `items` to the Root.
- Scroll arrows don't render on touch devices (Base UI design).
- Typeahead prop is `label` (was `textValue`); no call sites used it.

## Verify by hand

1. Table pagination "Rows per page": opens below the trigger at trigger width,
   check mark on the current size, selection updates the table.
2. Theme selector in the header: switch themes; the value text follows.
3. Sheet product form category select: keyboard navigation + typeahead ("be" jumps
   to Beauty), form receives the value.
