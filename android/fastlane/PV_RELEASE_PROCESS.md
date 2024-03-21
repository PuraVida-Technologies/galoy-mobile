Note: This is for after you have `fastlane` and all dependencies installed.

1. Ensure you have the `fastlane-supply-service-account-key.json` file from the
   service account via GCP. You can generate one there and download it. Save
   this file in the `android/app` directory where `build.gradle` resides.
2. Increment `versionCode` and `versionName` in `build.gradle` as necessary.
3. Build the bundle via `fastlane android build_bundle`
4. Release as necessary via:

- `fastlane android play_store_upload`
- `fastlane android promote_to_beta` promotes from "Internal Testing" to "Closed
  Testing"
- `fastlane android promote_to_public` promotes from "Closed Testing" to "Open
  Testing" / "Public Testing"
- `fastlane android public_phased_percent` promotes fro "Open Testing" / "Public
  Testing" to "Production"

Once the last process has been executed, it will be `In Review` for some time
until it's not. There's no notification of this, sadly.
