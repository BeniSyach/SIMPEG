import { Asset } from 'expo-asset';

export const images: { [key: string]: ReturnType<typeof require> } = {
  logo: require('@assets/images/logo.svg'),
  logo_sm: require('@assets/images/logo-sm.png'),
  logo_lg: require('@assets/images/logo-lg.png'),
  absensi: require('@assets/images/absensi.png'),
  berkas: require('@assets/images/berkas.png'),
  kinerja: require('@assets/images/kinerja.png'),
  lonceng: require('@assets/images/lonceng.png'),
  profile: require('@assets/images/profile.png'),
  banner: require('@assets/images/banner.png'),
};

// preload images
const preloadImages = () =>
  Object.keys(images).map(key => {
    return Asset.fromModule(images[key]).downloadAsync();
  });

export const loadImages = async () => Promise.all(preloadImages());
