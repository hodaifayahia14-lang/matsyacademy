

# Searchable Icon Picker for Category Management

## Problem
The icon field is a plain text input where admins must type exact Lucide icon names from memory. No visual feedback, no discovery.

## Solution
Create a searchable icon picker component using Lucide's `icons` export (which contains all 1400+ icons as a map). The picker will be a Popover with a search input and a scrollable grid of icon previews.

## Implementation

### 1. Create `src/components/IconPicker.tsx`
A reusable component that:
- Uses `icons` from `lucide-react` to get ALL available icons (1400+)
- Renders a Popover trigger showing the currently selected icon (or placeholder)
- Inside the Popover: a search Input at top, then a scrollable grid of icons
- Filters icons by name as user types in search
- Virtualizes/limits visible icons to ~100 at a time for performance (show first 100 matching results)
- On click, sets the icon name and closes the popover
- Each icon rendered using the generic `Icon` component pattern: `const LucideIcon = icons[name]`

### 2. Update `src/pages/dashboard/admin/CategoriesManagement.tsx`
- Replace the icon text `<Input>` (line 107) with the new `<IconPicker value={icon} onChange={setIcon} />`
- In the table, render the actual icon next to the icon name in the Icon column using `icons[cat.icon]`

## Technical Details
- `import { icons } from 'lucide-react'` gives a `Record<string, LucideIcon>` with all ~1400 icons
- Icon names in this map are PascalCase (e.g., "Shield", "BookOpen")
- Search will be case-insensitive against icon names
- Grid: `grid-cols-8` with `h-64 overflow-y-auto` for the scrollable area
- Each cell: 36x36 button with the icon centered, highlight on hover/selected

## Files
- **Create**: `src/components/IconPicker.tsx`
- **Modify**: `src/pages/dashboard/admin/CategoriesManagement.tsx` — swap Input for IconPicker, render icons in table

