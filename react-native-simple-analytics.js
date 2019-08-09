import Constants from 'expo-constants';
// import { Platform } from 'react-native';

const prefix = 'Simple Analytics:'

let didWarn = false

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
    const namespace = iosBundleIdentifier || androidBundleIdentifier || null

    if (!namespace) {
      if (didWarn) return
      didWarn = true
      return console.warn(`${prefix} Not sending data because BundleID is not set`)
    }

    const body = {
      screen: screenName,
      url: `app://${namespace}/${screenName.replace(/[^a-zA-Z-/_]/gi, '-')}`,
      ua: userAgent,
    }

    // Send this data to Simple Analytics endpoint
    fetch('https://queue.simpleanalytics.io/post', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    })
      .then((res) => res.text())
      .then((...props) => console.log([prefix, ...props].join(' ')))
      .catch((...props) => console.error([prefix, ...props].join(' ')));
  }).catch((...props) => console.error([prefix, ...props].join(' ')))
}
