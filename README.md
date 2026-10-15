# Ordering Franchise App

Copy this single prompt into your coding assistant:

```text
Get https://github.com/Ordering-co/ordering-app-franchises.git, preserving any existing checkout. Read setup.md and set up my project. Detect its connection or ask for its slug. Ask me to choose an explicit franchise slug; never pick the first franchise. Install the pinned dependencies and open the app; use the explicit local preview if Firebase files are missing. Verify the displayed project and franchise and one visible edit with Fast Refresh.
```

## Your three steps

1. Paste the prompt above; your assistant follows [setup.md](setup.md).
2. Confirm your Ordering project and explicitly choose a franchise slug. Sign in to the developer connection only if needed; consumer login in the app is separate.
3. Check the destination label in the local preview, then observe one visible edit through Fast Refresh.

## Manual alternative

Follow [setup.md](setup.md) for the pinned toolchains, native setup, the explicit local simulator preview without Firebase and troubleshooting. `configure` deliberately activates development onboarding with the source boolean `localProjectConfigured: true`; a historical project alone does not activate validation or session migration. Normal legacy development and Release keep their original selectors, flags and sessions.

Customers can browse a franchise catalog, choose products, use checkout, track orders, manage their account, and exchange order messages.

This is a bare React Native 0.81.1 application with React 19.1.0 and TypeScript. The headless Ordering SDK is a submodule at `src/@/components`; the app UI is in `src/ui` and screen wiring is in `src/pages` and `src/navigators`.

## Requirements

- Node.js 20.19.4 or newer and Yarn Classic 1.22.
- Android development: JDK 17, Android Studio and the SDK versions declared in `android/build.gradle`.
- iOS development: macOS, Xcode supporting the project's deployment target, the Ruby version in `.ruby-version`, Bundler and CocoaPods.
- Your own Ordering project and backend configuration. SDK source is fetched recursively from its public repository.

## Setup

```sh
git clone --recurse-submodules https://github.com/Ordering-co/ordering-app-franchises.git
cd ordering-app-franchises
yarn install --frozen-lockfile
```

If you cloned without submodules, run `git submodule update --init --recursive`. Keep the SDK revision recorded by the parent repository.

Choose your public destination explicitly:

```sh
node scripts/onboarding/cli.mjs detect
node scripts/onboarding/cli.mjs configure --project YOUR_PROJECT_SLUG --franchise-slug YOUR_FRANCHISE_SLUG
node scripts/onboarding/cli.mjs doctor
```

Detection is separate from consumer login. Public validation confirms the destination, not project ownership or app authentication. If no developer connection is available, provide the exact project code manually. Manual edits must deliberately include `localProjectConfigured: true` as described in [setup.md](setup.md#explicit-development-opt-in).

For manual configuration, edit `src/config.json`: set `project` to your own project. Review the app identifiers, API version/language, API/socket endpoints and existing feature flags for your deployment. Public app IDs and endpoint defaults are included; they do not provide backend access or credentials. `builder.json` describes native project/package identifiers, and `app.json` supplies the registered native component name. Keep native names and bundle/package IDs consistent when configuring your own application.

For ordinary native launches, configure your own registrations below. The explicit Debug Simulator preview in [setup.md](setup.md) can open without Firebase; it does not validate production integrations.

Normal native configuration:

- Register your Android/iOS apps in your own Firebase project. Add `android/app/google-services.json` and `ios/GoogleService-Info.plist`, including the iOS file in the `AppFranchises` target. These registrations are not supplied.
- Replace `_GOOGLE_MAPS_API_KEY_` in the Android manifest and iOS AppDelegate with your restricted keys for the corresponding native bundle/package. Set your own Google credentials in backend configuration where required.
- Configure your own OneSignal application, notification extension app group and push entitlements. Both targets must use the same app group; configure its value explicitly in each entitlement file.
- Select your Apple development team and provisioning profiles in Xcode. Supply your own production Android signing configuration. The included `debug.keystore` is the standard public React Native development template; use it only for local debug builds.
- Configure Facebook App ID/client token and URL scheme, Google sign-in IDs, Intercom app/native SDK keys, Segment settings, and Stripe/Apple merchant registration for the features enabled by your project. Existing placeholder guards for optional integrations are preserved.

Do not commit credentials or private signing files. Generated service registrations are ignored by `.gitignore`. `firebase.json` contains Firebase behavior settings, not a Firebase registration.

For iOS dependencies:

```sh
bundle _2.7.1_ install
cd ios
bundle _2.7.1_ exec pod install --deployment
cd ..
```

Start Metro with `yarn start`, then run `yarn android` or `yarn ios` from another terminal. Android/iOS commands require a configured emulator, simulator or device and native toolchain.

## Local checks

```sh
node --test scripts/onboarding/*.test.mjs
yarn test:onboarding
yarn lint:check
yarn tsc --noEmit
yarn test --runInBand --watchman=false
yarn test:coverage --runInBand --watchman=false
yarn i18n:verify
yarn i18n:check-generated
```

`yarn lint` applies automatic fixes; `lint:check` only reports findings. Type checking and linting may expose existing diagnostics in the app or SDK. Inspect those diagnostics before making changes. `test:coverage` reports the scope declared in `jest/coverage-include.js`; it does not verify every native integration.

Catalog maintenance is documented in [i18n/README.md](i18n/README.md). Existing translated values are retained; any English fallback in another locale should be translated for that locale before production use. The default translation sync command is a dry run; live sync requires explicit credentials for your own backend and writes server data.

To inspect JavaScript bundles without launching a device:

```sh
mkdir -p build
yarn react-native bundle --platform android --dev false --entry-file index.js --bundle-output build/android.jsbundle --assets-dest build/android-assets --max-workers 2
yarn react-native bundle --platform ios --dev false --entry-file index.js --bundle-output build/ios.jsbundle --assets-dest build/ios-assets --max-workers 2
```

JavaScript bundling does not produce or validate an APK/IPA, native signing, provider registrations, or the behavior of your backend tenant. Login, checkout, deliveries, location and notifications require separate testing with your own configured services and devices.

## License

This application is licensed under [license-ordering.txt](license-ordering.txt). Third-party dependencies and bundled notices retain their respective licenses.
