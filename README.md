# Ubert

Ubert is a React Native clone of the Uber rider app, built as a target app for [Revyl](https://docs.revyl.ai) mobile tests and demo recordings. It covers rides, food delivery, package courier, grocery shops, reservations, car rental, safety, Uber One, and account screens.

Everything runs on device with **mock data**: there is no backend, no login and no payment processing. The only live network calls are:

- one routing request to the public [OSRM](https://project-osrm.org/) demo server on Ride Selection (it falls back to an offline route preview if that fails)
- images loaded from remote URLs (Unsplash, Wikimedia, pravatar.cc, DiceBear and a CloudFront host)

The native project and bundle are named `UberFrontPageHotReload`. In the UI the app is branded **UBERT**.

## Screens and flows

All screens live in [`src/screens`](src/screens) and are registered in one stack navigator, [`src/navigation/AppNavigator.tsx`](src/navigation/AppNavigator.tsx). Route params are typed in [`src/navigation/types.ts`](src/navigation/types.ts).

**Home** has four top tabs (Rides, Delivery, Courier, Shops), a light/dark theme toggle (`testID="theme-toggle"`) and a bottom tab bar (Home, Services, Activity, Account). Services and Account open bottom sheets. Activity opens the full trip history.

| Flow | Screens |
|---|---|
| Ride | Splash → Home → Search → Ride Selection (map, UberX / Comfort / UberXL / Black, payment) → Finding Driver → Driver Matched (message, call, share, safety sheets) → Trip In Progress → Trip Complete (rating, tip, compliments) → Trip Receipt |
| Delivery | Delivery Browse → Restaurant Detail → Item Detail → Cart → Checkout → Delivery Tracking |
| Package (Courier) | Package Details → Sender → Recipient → Confirm → Package Tracking |
| Shops | Shops Browse → Store Detail → Aisles → Product Detail → Shops Cart |
| Reserve | Reserve Schedule → Ride Type → Confirm |
| Rent | Browse Cars → Rent Details → Rent Confirm |
| Safety (from Settings) | Safety Hub → RideCheck, Trusted Contacts, PIN Verification, Share Trip |
| Uber One | Landing → Benefits → Payment → Success |
| Account | Edit Profile, Settings (Notifications, Privacy → Privacy Checkup, Language), Help → Help Contact / AI help chat (canned replies), Promotions, Wallet → Add Payment Method, Saved Places (add / edit) |
| Other | Activity → Trip Detail, Airline Picker (from Search), Coming Soon placeholder |

The timed steps of the ride flow are driven by timers in the screens. Finding Driver matches a driver after 5 s, Driver Matched animates the driver's approach, and Trip In Progress runs for 10 s.

`RideSelectionScreen.tsx` has a `BROKEN_BOOKING` flag. Set to `true`, it makes "Confirm" show an error alert instead of booking. It is meant for the "broken build" demo variant and should stay `false` on `main`.

## Project layout

```
App.tsx                 providers: gesture handler, safe area, theme, navigation, trip state
src/
  screens/              one folder per flow (delivery/, package/, shops/, safety/, ...)
  components/           shared UI (common/), bottom sheets (sheets/), ride/driver cards
  store/                TripContext (ride, delivery cart, payments, trip history), shopsCart
  data/                 mock places, restaurants, products, stores, cars, drivers, routes
  theme/                light/dark palettes, typography, spacing, shadows
  utils/                currency/time formatting, route generation + OSRM fetch
  assets/icons/         tab and suggestion icons
.revyl/                 Revyl CLI config and test definitions (see below)
uber image/             reference images (not bundled by the app)
```

## Running the app

Requirements: Node `>= 22.11` (see `engines` in `package.json`) and a [React Native development environment](https://reactnative.dev/docs/set-up-your-environment) for the platform you target. iOS also needs Xcode, Ruby/Bundler and CocoaPods.

```sh
npm ci

# iOS (first time, and after native dependency changes)
bundle install
cd ios && bundle exec pod install && cd ..

npm start          # Metro bundler
npm run ios        # in a second terminal
npm run android    # or Android
```

The `.revyl/` tests and the CI build target iOS. The Android project builds with Gradle (`cd android && ./gradlew assembleDebug`). However, `AndroidManifest.xml` sets no Google Maps API key, and react-native-maps needs one on Android for the Ride Selection map.

## Checks

```sh
npx tsc --noEmit   # typecheck
npm run lint       # eslint (@react-native config)
npm test           # jest (__tests__/)
```

## CI

[`.github/workflows/checks.yml`](.github/workflows/checks.yml) runs the three checks above (typecheck, lint, Jest) on Ubuntu for every pull request and every push to `main`.

[`.github/workflows/ubert.yml`](.github/workflows/ubert.yml) runs on pushes to `main` (except Markdown-only and `uber image/` changes) and on manual dispatch. On `macos-latest` it installs pods and builds an unsigned **Release** `.app` for the iOS Simulator (`xcodebuild -workspace ios/UberFrontPageHotReload.xcworkspace -scheme UberFrontPageHotReload`). The JS bundle is embedded, so the app runs without Metro. The build is uploaded as the `Ubert-Simulator.app.zip` artifact.

## Revyl tests

[`.revyl/config.yaml`](.revyl/config.yaml) is the Revyl CLI project config (project `ubert`). It sets:

- **Build commands** for each platform. iOS uses the same `xcodebuild` Release Simulator build as CI and outputs `ios/build/Build/Products/Release-iphonesimulator/UberFrontPageHotReload.app`. Android uses `./gradlew assembleDebug` and outputs `app-debug.apk`.
- **Hot reload**: a `react-native` provider on Metro port `8081`, so tests can run against a dev build that loads JS from your local Metro. See the [Revyl hot-reload docs](https://docs.revyl.ai/cli/hot-reload).

Local credentials and device-session files are git-ignored by `.revyl/.gitignore`.

[`.revyl/tests/`](.revyl/tests) holds the test definitions, which are synced with Revyl (`_meta.remote_id` / `remote_version`). All of them target iOS, and all but one use the `Ubert` build. Each test is a list of blocks:

- `instructions`: a natural-language action, e.g. *Tap the "Where to?" search bar*
- `validation`: a natural-language assertion about what is on screen, e.g. *The Finding Driver screen is visible with ... a "Cancel" button*
- `manual` / `wait`: a pause in seconds, for the timed screens

| Tests | What they cover |
|---|---|
| `ubert-atlas-*.yaml` | One detailed, step-by-step test per feature area: account, activity, airline, delivery, help AI, package, payment, privacy checkup, rent, reserve, safety, saved places, shops & courier, trip receipt, Uber One, plus a full-coverage pass |
| `ubert-trip-cancel-path.yaml`, `ubert-home-services-sheets.yaml` | Cancelling a ride from Finding Driver; the Home bottom sheets |
| `uber-demo.yaml`, `ubert-record-demo.yaml`, `uber-orderer.yaml`, `ubert-full.yaml` | Short, goal-level prompts used for demos (e.g. *Get a trip to work*, then confirm UberX at $12.43 and rate Kofi 5 stars) |
| `uber-demo-chinese.yaml`, `uber-chinese-demo.yaml`, `uber-book-a-ride-japanese.yaml` | Experiments: a goal prompt written in Chinese; a ride flow for a separate `Ubert CN` build (¥ prices, a different driver) that this repo's code doesn't produce; and a test of `{{variables}}` |

Because the steps locate elements by **visible text and layout** (labels, prices, driver name, mock addresses), changing UI copy or mock data can break them even when the code is correct. Grep `.revyl/tests` for a string before you rename or reword it.

[`.claude/agents/humanized-checker.md`](.claude/agents/humanized-checker.md) defines a Claude Code agent that drives the app on a Revyl device, screenshots screens and audits them for UX issues.
