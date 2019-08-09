import Constants from 'expo-constants';
import { Platform } from 'react-native';

export default function SimpleAnalyticsTracker(screenName) {
  const iosBundleIdentifier = (
    Constants && Constants.manifest
    && Constants.manifest.ios
    && Constants.manifest.ios.bundleIdentifier)
    ? Constants.manifest.ios.bundleIdentifier
    : null

  const androidBundleIdentifier = (
    Constants && Constants.manifest
    && Constants.manifest.android
    && Constants.manifest.android.package)
    ? Constants.manifest.android.package
    : null

  Constants.getWebViewUserAgentAsync().then(userAgent => {
    const options = {
      screen: screenName,
      hostname: iosBundleIdentifier || androidBundleIdentifier || null,
      ua: userAgent,
      platform: Platform.OS
    }

    // Send this data to Simple Analytics endpoint
    console.log(options)
  }).catch(console.error)
}
