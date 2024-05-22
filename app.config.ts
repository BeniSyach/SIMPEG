import { ExpoConfig, ConfigContext } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => {
  const envConfig: ExpoConfig = {
    ...config,
    slug: process.env.EXPO_PUBLIC_SLUG ?? 'react-native-simpeg-k60reyh-azkd356htzgla',
    name: process.env.EXPO_PUBLIC_NAME ?? 'SIMPEG',
    ios: {
      ...config.ios,
      bundleIdentifier: 'com.RSUD-HAT.SIMPEG',
      buildNumber: '1',
    },
    android: {
      ...config.android,
      package: 'com.RSUD_HAT.SIMPEG',
      versionCode: 1,
    },
    updates: {
      url: `https://u.expo.dev/45fa858b-00ae-497b-b627-eb7f82e6cfde`,
    },
    extra: {
      ...config.extra,
      eas: { projectId: '45fa858b-00ae-497b-b627-eb7f82e6cfde' },
      ENV: 'production',
      API_URL: 'http://103.109.172.90:3000',
    },
  };
  return envConfig;
};
