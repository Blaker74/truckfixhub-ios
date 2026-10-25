# TruckFixHub iOS — App Store release checklist

This repository is configured for Expo EAS production builds and Apple App Store submission.

## Current app identity

- App name: TruckFixHub
- Expo project ID: `c42460da-0901-4894-8c21-bd135363bb38`
- iOS bundle identifier: `space.manus.truckfix.t243966620732700`
- Version: `1.0.0`
- Production build profile: `production`
- Encryption declaration: `ITSAppUsesNonExemptEncryption = false`

Do not change the bundle identifier after the App Store Connect record is created unless intentionally migrating to a new app identity.

## Required before first production build

1. Use the Expo account that owns project `c42460da-0901-4894-8c21-bd135363bb38`.
2. Have an active Apple Developer Program membership.
3. Create the App Store Connect app record with bundle ID `space.manus.truckfix.t243966620732700`.
4. Confirm `https://truckfixhub.com/privacy.html` and `https://truckfixhub.com/contact.html` are live.
5. Create a stable App Review demo account with access to the signed-in Garage and Community features.
6. Test Home, Diagnose, Garage, Community, Resources, sign-in, password reset, photo/video selection, community posting/replies, external links, and sign-out on a physical iPhone.
7. Test the phone-layout build on an iPad because Apple can review iPhone apps on iPad hardware.

## Production build

From the repository root:

```sh
npx eas-cli login
npx eas-cli whoami
npx eas-cli build --platform ios --profile production
```

Allow EAS to manage the iOS distribution certificate and provisioning profile unless an existing Apple signing setup must be preserved.

## Submit to TestFlight

After the production build succeeds:

```sh
npx eas-cli submit --platform ios --profile production
```

For the first submission, follow the Apple authentication prompts. Once the App Store Connect Apple ID (`ascAppId`) exists, add it to `eas.json` under `submit.production.ios.ascAppId` so later submissions can be less interactive.

## App Store Connect listing

Suggested listing copy:

**Subtitle:** Practical truck diagnostics & tools

**Promotional text:** Organize truck information, work through common diesel-truck symptoms, and learn from the TruckFixHub community.

**Description:**
TruckFixHub is a practical companion for truck drivers, diesel technicians, parts professionals, and fleet owners. Start with the symptom, follow clear diagnostic paths, organize private truck and service information in My Garage, and learn from real-world community discussions. TruckFixHub is designed to help organize observations and next steps; it does not replace current manufacturer service information or qualified repair judgment.

**Keywords:** truck,diesel,diagnostics,semi,mechanic,fleet,VIN,repair,parts,maintenance

**Support URL:** https://truckfixhub.com/contact.html

**Marketing URL:** https://truckfixhub.com/

**Privacy Policy URL:** https://truckfixhub.com/privacy.html

**Primary category:** Utilities

**Secondary category:** Productivity

## App Review notes

TruckFixHub provides public diagnostic/resource content without requiring sign-in. Account sign-in is used for private Garage records and participation in Community. The app uses Supabase for authentication, private user-scoped records, community posts/replies, and optional community media uploads. The Community contains user-generated content; reviewers should verify the current reporting/blocking/moderation controls before submission. Diagnostic information is educational/organizational and directs users to verify safety-critical repairs and specifications using current manufacturer information.

Provide App Review with a working demo email/password and keep backend services available throughout review.

## Privacy / review gates

Before pressing **Submit for Review**, verify all of these in the exact production build:

- Privacy policy is reachable from the app and App Store listing.
- Account deletion can be initiated from inside the app if account creation remains available.
- Community provides a way to report objectionable content and block abusive users.
- Community posting has a moderation/filtering mechanism and published support contact information.
- App Privacy answers in App Store Connect accurately reflect authentication, user content/media, diagnostics/analytics, and any third-party SDK behavior actually present in the production build.
- No placeholder screens, dead links, debug-only screens, or test credentials are exposed to normal users.
- Screenshots accurately show the shipping app.

## Release sequence

1. Production EAS build
2. Upload to App Store Connect / TestFlight
3. Install the TestFlight build on a physical iPhone
4. Complete a final production smoke test
5. Complete App Store metadata, privacy questionnaire, age rating, screenshots, review contact, and demo credentials
6. Select the tested build
7. Submit for App Review

Do not submit an Expo Go development session itself to Apple; Apple receives the signed production `.ipa` generated by EAS Build.
