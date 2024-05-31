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
  logout: require('@assets/images/logout.png'),
  cpns: require('@assets/images/cpns.png'),
  user: require('@assets/images/user.png'),
  pns: require('@assets/images/pns.png'),
  pangkatGaji: require('@assets/images/pangkat_gaji.png'),
  identitas: require('@assets/images/identitas.png'),
  lokasi: require('@assets/images/lokasi.png'),
};

// preload images
const preloadImages = () =>
  Object.keys(images).map(key => {
    return Asset.fromModule(images[key]).downloadAsync();
  });

export const loadImages = async () => Promise.all(preloadImages());
