const path = require('node:path');
const dotenv = require('dotenv');
const pkg = require('./package.json');

const env = process.env.ENV || 'development';
const envPath = env === 'development' ? '.env' : `.env.${env}`;
const envConfig = dotenv.config({
  path: path.resolve(process.cwd(), envPath),
}).parsed;

const VERSION = pkg.version;
const PROJECT_NAME = 'BeStaff';
const IOS_BUNDLE_IDENTIFIER = 'com.bestaff.dev';
const ANDROID_PACKAGE = 'com.bestaff.dev';

const defaultConfig = {
  name: PROJECT_NAME,
  slug: PROJECT_NAME,
  version: VERSION,
  orientation: 'portrait',
  icon: './assets/images/icon.png',
  scheme: 'bestaff',
  userInterfaceStyle: 'automatic',
  newArchEnabled: true,
  splash: {
    image: './assets/images/splash-icon.png',
    resizeMode: 'contain',
    backgroundColor: '#ffffff',
  },
  ios: {
    supportsTablet: true,
    bundleIdentifier: IOS_BUNDLE_IDENTIFIER,
    associatedDomains: ['applinks:bestaff.dev'],
    config: {
      usesNonExemptEncryption: false,
    },
    infoPlist: {
      UIBackgroundModes: ['remote-notification'],
      NSCameraUsageDescription:
        'Used for profile pictures, posts, and other kinds of content.',
      NSPhotoLibraryAddUsageDescription: 'Used to save images to your library.',
      NSPhotoLibraryUsageDescription:
        'Used for profile pictures, posts, and other kinds of content',
    },
  },
  android: {
    adaptiveIcon: {
      backgroundColor: '#E6F4FE',
      foregroundImage: './assets/images/android-icon-foreground.png',
      backgroundImage: './assets/images/android-icon-background.png',
      monochromeImage: './assets/images/android-icon-monochrome.png',
    },
    edgeToEdgeEnabled: true,
    predictiveBackGestureEnabled: false,
    permissions: ['NOTIFICATIONS'],
    package: ANDROID_PACKAGE,
    googleServicesFile: './google-services.json.example', // TODO: add google-services.json
    intentFilters: [
      {
        action: 'VIEW',
        autoVerify: true,
        data: [
          {
            scheme: 'https',
            host: '',
            pathPrefix: '/',
          },
        ],
        category: ['BROWSABLE', 'DEFAULT'],
      },
    ],
  },
  web: {
    bundler: 'metro',
    output: 'static',
    favicon: './assets/images/favicon.png',
  },
  plugins: [
    'expo-router',
    [
      'expo-splash-screen',
      {
        image: './assets/images/splash-icon.png',
        imageWidth: 200,
        resizeMode: 'contain',
        backgroundColor: '#ffffff',
      },
    ],
    [
      'expo-notifications',
      {
        icon: './assets/images/icon.png',
        color: '#1185fe',
      },
    ],
  ],
  experiments: {
    typedRoutes: true,
    reactCompiler: true,
  },
  extra: {
    ...envConfig,
    router: {
      origin: false,
    },
  },
};

module.exports = () => {
  return defaultConfig;
};
