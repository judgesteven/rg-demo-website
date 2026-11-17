# Safer Play Rewards

A clickable sales demo for GameLayer: what a responsible-gaming rewards pilot
looks like for a lottery operator. Players earn good-cause points for using
safer-play tools; the operator's team sees the results.

All data is sample data. There is no real GameLayer or operator integration
yet. The UI talks to a `RewardsBackend` interface so a real API can replace
the in-memory mock later.

## Routes

| Route     | What it is                                                    |
| --------- | ------------------------------------------------------------- |
| `/player` | The player's mobile app (in a phone frame above 600px wide)  |
| `/team`   | The operator's responsible-gaming dashboard                   |
| `/`       | Redirects to `/player`                                        |

Brand the demo for each prospect: click the lottery branding slot in the top
bar to set the lottery's name and upload its logo (until then a dashed
placeholder with the initials shows). The name can also be set with
`?operator=Allwyn` in the URL. Both are saved in this browser's localStorage.

Tip for demos: open `/player` and `/team` in two tabs side by side. Completing
an account mission in the player app appears in the team live feed straight
away (tabs sync over BroadcastChannel).

## Run

Requires Node 18+.

```bash
npm install
```

```bash
npm run dev
```

Then open http://localhost:5173.

## Build

```bash
npm run build
```

Outputs a static site to `dist/`, including `dist/404.html` as an SPA
fallback. Preview the build with:

```bash
npm run preview
```

## Deploy (e.g. saferplay.gamelayer.io)

The build is plain static files. Any static host works; deep links like
`/team` need to fall back to `index.html`:

- **Netlify**: `public/_redirects` is included. Build command `npm run build`,
  publish directory `dist`.
- **Vercel**: `vercel.json` rewrites are included. Framework preset: Vite.
- **Cloudflare Pages**: build command `npm run build`, output `dist`. SPA
  fallback is automatic.
- **S3 + CloudFront / GitHub Pages**: upload `dist/`; `404.html` handles deep
  links. On CloudFront, also map 403/404 errors to `/index.html` with status 200.

Then add a CNAME record for the subdomain (e.g. `saferplay`) pointing at the
host. This project changes nothing on gamelayer.co.

## Code layout

```
src/
  backend/
    RewardsBackend.ts    Interface + domain types (missions, events, player state)
    mockBackend.ts       In-memory implementation, synced between tabs
    gameLayerBackend.ts  Stub for the real GameLayer API (TODOs)
    index.ts             Picks the backend (VITE_BACKEND=gamelayer to switch)
  data/                  All sample data: missions, player, comparisons, events, copy
  state/                 Operator name context
  components/            Top bar, footer, bar
  player/                /player: phone frame, app, how-it-works
  team/                  /team: dashboard
  styles/global.css      Design tokens (light + dark) and all styles
reference/prototype.html The approved single-file prototype (the spec)
```

### Events

The operator platform sends one event per tool use, with a pseudonymised
player ID only:

`play_history_viewed`, `limit_reviewed`, `self_assessment_completed`,
`location_checkin`, `player_excluded`

### Connecting the real API

Implement `src/backend/gameLayerBackend.ts` (see its TODOs), then build with:

```bash
VITE_BACKEND=gamelayer VITE_GAMELAYER_URL=https://… npm run build
```

No component changes are needed.
