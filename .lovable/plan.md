

# Gamification Settings & Milestone Rewards System

This is a large feature spanning database schema, admin UI, agent UI, and automation logic. Given the scope, I recommend implementing it in phases. Here is the full plan:

---

## Database Changes (Migration)

Create the following new tables:

1. **`gamification_settings`** — Single-row config table for system toggle, points config, leaderboard formula, weights.
2. **`milestone_rules`** — Stores each milestone definition (name in 3 languages, type, target, visibility, repeatable, icon, color, sort_order, active toggle, reward config as JSONB).
3. **`agent_badges`** — Tracks which badges each agent has earned (agent_id, milestone_rule_id, earned_at, metadata).
4. **`agent_titles`** — Current active title per agent.
5. **`agent_points`** — Points ledger (agent_id, points, source, milestone_rule_id, created_at).
6. **`reward_distribution_log`** — Full audit log (agent_id, milestone_rule_id, reward_type, delivery_status, created_at).

RLS: Admin full access on all tables. Agents SELECT on own rows for badges/titles/points.

Enable realtime on `agent_badges` and `reward_distribution_log`.

---

## Admin UI — New Pages & Components

### 1. Route & Navigation
- Add `settings/gamification` route in `AdminDashboard.tsx`.
- Create `GamificationSettings.tsx` page.

### 2. Page Structure (single page with sections)
- **Header**: Title (trilingual), subtitle, system ON/OFF toggle with warning banner.
- **Milestone Rules Builder**: List of milestone rule cards with drag-to-reorder, active toggle, edit/duplicate/delete actions. "+ Add New Milestone" button opens a Sheet (right drawer).
- **Milestone Form Drawer**: Sheet component with all fields — name (language tabs), type pill selector, target value, reward type card selector (badge, gift, points, title, notification), visibility toggles, one-time/repeatable radio, icon/color picker, live preview.
- **Points System Settings**: Card with base points, multiplier, streak bonus, reset period, leaderboard formula with weight sliders.
- **Badge Gallery**: Grid of all badges with earned count, filters, tooltips.
- **Reward History Log**: Table with filters, delivery status toggle, CSV export.

### 3. Pre-built Milestone Seeds
- Insert 8 default milestone rules via the admin UI's "seed defaults" button or on first load if no rules exist.

---

## Agent Dashboard Updates

### 4. "My Achievements" Section
- Add to `AgentRewards.tsx` or create new `AgentAchievements.tsx` component.
- **Earned Badges Row**: Horizontal scroll, locked badges grayed with lock icon, click for detail modal.
- **Next Milestone Progress**: SVG circular progress ring with count, motivational messages (trilingual), confetti on 100%.
- **All Milestones Accordion**: Expandable list with progress bars and status icons.

---

## Automation Logic

### 5. Milestone Detection
- Create a Supabase database function `check_agent_milestones(agent_id)` that runs after order status changes to "confirmed".
- Create a trigger on the `orders` table (on UPDATE when `order_status` changes to 'confirmed') that calls the milestone check function.
- The function checks all active milestone rules against the agent's stats and inserts into `agent_badges`, `agent_points`, `reward_distribution_log`, and `notifications` as needed.

### 6. Real-time Updates
- Subscribe to `agent_badges` changes on the agent dashboard for live badge/confetti updates.

---

## Files to Create/Modify

| Action | File |
|--------|------|
| Create | `src/pages/dashboard/admin/GamificationSettings.tsx` (~800 lines, main page) |
| Create | `src/components/gamification/MilestoneFormDrawer.tsx` |
| Create | `src/components/gamification/MilestoneRuleCard.tsx` |
| Create | `src/components/gamification/BadgeGallery.tsx` |
| Create | `src/components/gamification/RewardHistoryLog.tsx` |
| Create | `src/components/gamification/PointsSystemSettings.tsx` |
| Create | `src/components/gamification/AgentAchievements.tsx` |
| Create | `src/components/gamification/ProgressRing.tsx` |
| Modify | `src/pages/dashboard/admin/AdminDashboard.tsx` — add route |
| Modify | `src/pages/dashboard/agent/AgentDashboard.tsx` — add achievements route |
| Modify | `src/pages/dashboard/agent/AgentRewards.tsx` — integrate achievements |
| Migration | New tables + trigger + function |
| i18n | Add all keys to `ar.json`, `fr.json`, `en.json` |

---

## Technical Details

- **Drag-and-drop**: Use `@dnd-kit/core` (modern alternative to react-beautiful-dnd, already common in React projects).
- **Color picker**: Inline swatch grid with 8 presets + hex input.
- **Icon picker**: Emoji grid component with search.
- **Progress ring**: Custom SVG component with Framer Motion animation.
- **Confetti**: `canvas-confetti` library triggered on milestone completion.
- **CSV export**: Client-side using `Blob` and `URL.createObjectURL`.
- **RTL**: All drawer/sheet components use logical properties; progress ring text mirrors automatically.
- **Framer Motion**: Staggered card animations, drawer slide, ring animation on mount.

---

## Implementation Order

1. Database migration (tables + trigger + function)
2. `GamificationSettings.tsx` with milestone rules CRUD
3. Points system settings card
4. Badge gallery + reward history log
5. Agent achievements section
6. Automation trigger + real-time subscriptions
7. i18n translations
8. Polish (confetti, animations, empty states, skeletons)

This is a substantial feature. Shall I proceed with implementation?

