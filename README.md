# Ryan Cut Tracker

Private local MVP for Ryan's 265 lb to 220 lb cut by October 2026.

## Run

Open `index.html` in a browser, or serve the folder with any static server.

All data is saved locally under `ryan-cut-tracker-v1` as a fallback. When Supabase is configured, FORGED uses Supabase Auth plus the `forged_user_state` table so the same account data can load from any device.

## Supabase setup

1. Create a Supabase project.
2. In Supabase Auth settings, add the live site URL as an allowed redirect/site URL: `http://forged.ryanwortham.com` and later `https://forged.ryanwortham.com` after GitHub Pages SSL is ready.
3. Run `supabase-schema.sql` in the Supabase SQL editor. It creates:
   - `forged_profiles`
   - `forged_user_state`
   - Row Level Security policies so each user can only read/write their own profile/state.
4. Copy the project's public URL and anon key into `supabase-config.js`:

```js
window.FORGED_SUPABASE = {
  url: "https://YOUR-PROJECT.supabase.co",
  anonKey: "YOUR_PUBLIC_ANON_KEY",
};
```

5. For the beta, either disable email confirmation in Supabase Auth or be ready for users to confirm email before their first login.
6. FatSecret nutrition lookup runs through a Supabase Edge Function so the API secret is not exposed in the browser:

```sh
supabase secrets set FATSECRET_CLIENT_ID=your_client_id FATSECRET_CLIENT_SECRET=your_client_secret
supabase functions deploy fatsecret-search
```

The app calls `${window.FORGED_SUPABASE.url}/functions/v1/fatsecret-search` by default and falls back to common estimates / USDA / manual entry when the function is unavailable.
7. Deploy `index.html`, `styles.css`, `app.js`, `supabase-config.js`, `supabase-schema.sql`, `supabase/functions/fatsecret-search`, and docs as needed.

## Scope

- Daily check-in for discipline, Pizza World-specific habits, cardio, recovery, weight, sleep, and steps
- Today's Mission card based on day of week
- Start Today button to jump back to today's check-in
- Today Summary card for weight, steps, cardio minutes, protein, 1st Phorm tracking, violations, and total score
- Polished Check-In flow with clearer hierarchy, selected quick buttons, checked checklist states, score breakdown, and temptation undo states
- Compact global header; full daily action block appears only on the Check-In tab
- Manual Apple Watch fallback fields for active calories, workout duration, heart rate, imported-from-watch status, and quick step/cardio buttons
- Daily main score out of 10, plus optional bonus points for sauna, cold plunge, and higher step targets
- Dashboard with progress, weight trends, scoring breakdown, recovery score, compliance, goal pace, and projected goal date
- Weekly charts for weight, daily score, steps, and cardio minutes
- Dashboard baseline empty states so early data does not look like a failed trend
- Workout tab defaults to the selected date's workout, with a full-week toggle, exercise checkboxes, journal fields, previous bests, notes, and workout history
- Interactive diet tab with meal checklists, calorie targets, macros, 7-day meal plan, Pizza World rules, approved meals, foods to avoid, and grocery list
- Supplements tab for prescribed/personal supplement tracking only
- Progress tab for weekly progress pictures and body measurements
- Temptation log with clean streaks and weekly violation tracking
- Sunday-style weekly review and self-leaderboard for the selected 7-day window
- Settings tab for start weight, goal weight, goal date, protein target, step target, cardio target, and calorie targets
- JSON export/import backup controls and confirmed local data clearing
- Recommendation logic based on two-week average weight-loss trends
- Apple Health is documented as a future native iOS/HealthKit wrapper because a static browser app cannot read HealthKit directly
- Apple Health Ready future plan covers HealthKit entitlement, permissions, steps, workouts, active energy, body weight, heart rate, daily sync, and permanent manual override
- No backend, login, payments, email, notifications, or third-party tracking
