# TruckFixHub iPhone App

A native-feeling Expo Router / React Native companion for [truckfixhub.com](https://truckfixhub.com). This project keeps the app separate from the TruckFixHub website repository. Manus remains the canonical build source; `Blaker74/truckfixhub-ios` is maintained as a separate source copy.

## Features

The app has Home, Diagnose, Garage, Community, and Resources tabs. It reuses TruckFixHub's existing Supabase sign-in and public client-side API. Signed-in private records use the existing `tfh_trucks`, `tfh_saved_parts`, `tfh_call_notes`, `tfh_calendar_events`, and `tfh_warranty_sheets` tables. Community reads/writes use the existing `tfh_community_posts` and `tfh_community_replies` tables and `community-media` bucket. Full repair guides and shop pages open at their official website destinations so the latest source remains authoritative.

The Supabase URL and publishable client key in `lib/supabase.ts` are already browser-visible on the public website and are intended for public clients; they are not service credentials. Never add a Supabase service-role key, private user records, local `.env` files, or account data to this repository. Existing Supabase row-level policies remain responsible for access control, and the app additionally filters each private query/write/delete by the signed-in user ID. Do not point development fixtures or tests at the live data service.

## Development

Use the project's pinned pnpm/Expo dependencies. `pnpm dev` starts the Metro/Web Preview on port 8081 and the starter API on port 3000. In Manus, use the project's Dashboard Preview/Expo connection workflow; the Sandbox is not a release-build environment. A web preview cannot validate every iOS-only capability such as Keychain-backed auth storage or the native photo-library picker.

Do not change the generated iOS bundle ID, Android package ID, or deep-link scheme without an intentional migration. iOS/TestFlight or App Store builds are created through the Manus Dashboard after the accepted app source/configuration is ready and only when requested.

## Main code areas

- `app/(tabs)/` contains the five native destinations.
- `app/symptom/[slug].tsx` opens sourced symptom details and official repair-guide links.
- `app/garage/[tool].tsx` manages the signed-in user's private tool records.
- `components/brand-ui.tsx` defines reusable native TruckFixHub surfaces and controls.
- `constants/truckfixhub.ts` records the brand tokens, safety copy, and source guide destinations.
- `lib/` contains Supabase auth, scoped data access, media handling, and private-tool definitions.
- `assets/images/` contains the official TruckFixHub brand assets used by native app configuration.
