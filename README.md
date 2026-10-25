# TruckFixHub iPhone App

A native-feeling Expo Router / React Native companion for [truckfixhub.com](https://truckfixhub.com). This project keeps the app separate from the TruckFixHub website repository. `Blaker74/truckfixhub-ios` is the independent app source. Startup uses Expo directly, with no Manus runtime or starter API requirement.

## Features

The app has Home, Diagnose, Garage, Community, and Resources tabs. It reuses TruckFixHub's existing Supabase sign-in and public client-side API. Signed-in private records use the existing `tfh_trucks`, `tfh_saved_parts`, `tfh_call_notes`, `tfh_calendar_events`, and `tfh_warranty_sheets` tables. Community reads/writes use the existing `tfh_community_posts` and `tfh_community_replies` tables and `community-media` bucket. Full repair guides and shop pages open at their official website destinations so the latest source remains authoritative.

The Supabase URL and publishable client key in `lib/supabase.ts` are already browser-visible on the public website and are intended for public clients; they are not service credentials. Never add a Supabase service-role key, private user records, local `.env` files, or account data to this repository. Existing Supabase row-level policies remain responsible for access control, and the app additionally filters each private query/write/delete by the signed-in user ID. Do not point development fixtures or tests at the live data service.

## Development

Install with `pnpm install --frozen-lockfile`, then use `pnpm dev` for Expo or `pnpm web` for the browser. `pnpm check` checks TypeScript, `pnpm export:ios` bundles the iOS JavaScript/assets, and `pnpm export:web` exports the web app. These exports are not signed iPhone installations.

## iPhone installation

`eas.json` contains simulator, internal preview, and production build profiles. Link this repository to the owner's Expo account with EAS before building. Supply the resulting project ID through `EXPO_PUBLIC_EAS_PROJECT_ID`. Do not reuse a guessed or Manus-owned Expo project ID.

A physical iPhone build requires the owner's Apple signing credentials and device registration (internal preview), or TestFlight distribution. No credentials are committed here. Account linking, signing, and on-device validation are still outstanding. No paid build or Apple enrollment has been authorized.

The existing bundle identifier and deep-link scheme are preserved to avoid accidentally changing the application's identity. The legacy Manus OAuth callback now redirects to the Garage sign-in screen; the app uses its existing Supabase email/password authentication.

## Main code areas

- `app/(tabs)/` contains the five native destinations.
- `app/symptom/[slug].tsx` opens sourced symptom details and official repair-guide links.
- `app/garage/[tool].tsx` manages the signed-in user's private tool records.
- `components/brand-ui.tsx` defines reusable native TruckFixHub surfaces and controls.
- `constants/truckfixhub.ts` records the brand tokens, safety copy, and source guide destinations.
- `lib/` contains Supabase auth, scoped data access, media handling, and private-tool definitions.
- `assets/images/` contains the official TruckFixHub brand assets used by native app configuration.
