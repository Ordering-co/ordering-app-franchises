import UIKit
import React
import React_RCTAppDelegate
import ReactAppDependencyProvider
import GoogleMaps
import AuthenticationServices
import SafariServices
import FBSDKCoreKit
import FirebaseCore

@main
class AppDelegate: UIResponder, UIApplicationDelegate {
  var window: UIWindow?

  var reactNativeDelegate: ReactNativeDelegate?
  var reactNativeFactory: RCTReactNativeFactory?
  private var initialLaunchOptions: [UIApplication.LaunchOptionsKey: Any]?

  func application(
    _ application: UIApplication,
    didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]? = nil
  ) -> Bool {
    initialLaunchOptions = launchOptions
    // Explicit local onboarding is available only in a Debug simulator build.
    // Normal and Release launches still initialize their own Firebase registration.
#if DEBUG && targetEnvironment(simulator)
    let orderingLocalSimulator = ProcessInfo.processInfo.environment["ORDERING_LOCAL_SIMULATOR"] == "1"
#else
    let orderingLocalSimulator = false
#endif
    UserDefaults.standard.set(orderingLocalSimulator, forKey: "OrderingLocalSimulatorMode")
    UserDefaults.standard.removeObject(forKey: "OrderingLocalSimulatorConfig")
    if orderingLocalSimulator,
       let encoded = ProcessInfo.processInfo.environment["ORDERING_LOCAL_CONFIG"],
       let data = encoded.data(using: .utf8),
       let configuration = try? JSONSerialization.jsonObject(with: data) as? [String: Any] {
      UserDefaults.standard.set(configuration, forKey: "OrderingLocalSimulatorConfig")
    }
    if !orderingLocalSimulator {
      FirebaseApp.configure()
    }


    let delegate = ReactNativeDelegate()
    let factory = RCTReactNativeFactory(delegate: delegate)
    delegate.dependencyProvider = RCTAppDependencyProvider()

    reactNativeDelegate = delegate
    reactNativeFactory = factory

    // Initialize Facebook SDK
    if !orderingLocalSimulator {
      ApplicationDelegate.shared.application(
        application,
        didFinishLaunchingWithOptions: launchOptions
      )
    }

    // Configurar Google Maps API Key
    if !orderingLocalSimulator {
      GMSServices.provideAPIKey("_GOOGLE_MAPS_API_KEY_")
    }

    // Configurar Intercom
    let intercomApiKey = "_INTERCOM_API_KEY_"
    let intercomAppId = "_INTERCOM_APP_ID_"

    // Skip init when the builder left the placeholders unreplaced.
    // Real iOS keys start with "ios_sdk-", so never filter on that prefix.
    if !orderingLocalSimulator && !intercomApiKey.isEmpty &&
       intercomApiKey != "none" &&
       !intercomApiKey.hasPrefix("_INTERCOM") &&
       !intercomAppId.isEmpty &&
       intercomAppId != "none" &&
       !intercomAppId.hasPrefix("_INTERCOM") {
      IntercomModule.initialize(intercomApiKey, withAppId: intercomAppId)
    }

    return true
  }

  func startReactNative(in window: UIWindow, connectionOptions: UIScene.ConnectionOptions) {
    guard let factory = reactNativeFactory else {
      preconditionFailure("React Native factory must be initialized before connecting a scene")
    }
    self.window = window
    var launchOptions = initialLaunchOptions ?? [:]
    if let context = connectionOptions.urlContexts.first {
      if ApplicationDelegate.shared.application(
        UIApplication.shared,
        open: context.url,
        options: Self.openURLOptions(for: context)
      ) {
        launchOptions.removeValue(forKey: .url)
        launchOptions.removeValue(forKey: .sourceApplication)
        launchOptions.removeValue(forKey: .annotation)
      } else {
        launchOptions[.url] = context.url
      }
      if let sourceApplication = context.options.sourceApplication {
        launchOptions[.sourceApplication] = sourceApplication
      }
      if let annotation = context.options.annotation {
        launchOptions[.annotation] = annotation
      }
    }
    if let activity = connectionOptions.userActivities.first(where: {
      $0.activityType == NSUserActivityTypeBrowsingWeb && $0.webpageURL != nil
    }) {
      if ApplicationDelegate.shared.application(UIApplication.shared, continue: activity) {
        launchOptions.removeValue(forKey: .userActivityDictionary)
      } else {
        // RCTLinkingManager reads this dictionary for the initial universal link.
        launchOptions[.userActivityDictionary] = [
          "UIApplicationLaunchOptionsUserActivityTypeKey": activity.activityType,
          "UIApplicationLaunchOptionsUserActivityKey": activity
        ]
      }
    }

    factory.startReactNative(
      withModuleName: "AppFranchises",
      in: window,
      launchOptions: launchOptions
    )
    initialLaunchOptions = nil
    RNSplashScreen.show()
  }

  static func openURLOptions(for context: UIOpenURLContext) -> [UIApplication.OpenURLOptionsKey: Any] {
    var options: [UIApplication.OpenURLOptionsKey: Any] = [
      .openInPlace: context.options.openInPlace
    ]
    if let sourceApplication = context.options.sourceApplication {
      options[.sourceApplication] = sourceApplication
    }
    if let annotation = context.options.annotation {
      options[.annotation] = annotation
    }
    return options
  }

  func application(
    _ application: UIApplication,
    continue userActivity: NSUserActivity,
    restorationHandler: @escaping ([UIUserActivityRestoring]?) -> Void
  ) -> Bool {
    if userActivity.activityType == NSUserActivityTypeBrowsingWeb,
       ApplicationDelegate.shared.application(application, continue: userActivity) {
      return true
    }
    return RCTLinkingManager.application(
      application,
      continue: userActivity,
      restorationHandler: restorationHandler
    )
  }

  // Manejo de URLs para deep linking y Facebook
  func application(
    _ app: UIApplication,
    open url: URL,
    options: [UIApplication.OpenURLOptionsKey : Any] = [:]
  ) -> Bool {
    // Handle Facebook SDK URLs
    if ApplicationDelegate.shared.application(app, open: url, options: options) {
      return true
    }

    // Manejar URLs con React Native Linking
    if RCTLinkingManager.application(app, open: url, options: options) {
      return true
    }

    return false
  }
}

class ReactNativeDelegate: RCTDefaultReactNativeFactoryDelegate {
  override func sourceURL(for bridge: RCTBridge) -> URL? {
    self.bundleURL()
  }

  override func bundleURL() -> URL? {
#if DEBUG
    if UserDefaults.standard.bool(forKey: "OrderingLocalSimulatorMode"),
       let port = ProcessInfo.processInfo.environment["ORDERING_LOCAL_METRO_PORT"],
       let number = Int(port), (1024...65535).contains(number) {
      return URL(string: "http://127.0.0.1:\(number)/index.bundle?platform=ios&dev=true&minify=false")
    }
    return RCTBundleURLProvider.sharedSettings().jsBundleURL(forBundleRoot: "index")
#else
    Bundle.main.url(forResource: "main", withExtension: "jsbundle")
#endif
  }
}
