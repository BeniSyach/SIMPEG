import React, { useEffect, useState } from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { StackProps } from '@navigator/stack';
import { images } from '@theme';
import { DataPersistKeys, useDataPersist } from '@hooks';
import { IUser, useAppSlice } from '@modules/app';
import axios from 'axios';
import config from '@utils/config';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2FF',
  },
  header: {
    backgroundColor: '#2A287A',
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 40,
    height: 40,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    marginLeft: 20,
  },
  welcome: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#39378A',
  },
  foto_profile: {
    borderRadius: 50,
  },
  profile: {
    width: 70,
    height: 70,
    borderRadius: 100,
  },
  welcomeText: {
    fontSize: 12,
    color: 'white',
    fontWeight: 'bold',
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  userPosition: {
    fontSize: 12,
    color: 'white',
    fontWeight: 'bold',
  },
  logo_lonceng: {
    width: 40,
    height: 40,
    marginEnd: 0,
    marginStart: 30,
  },
  banner: {
    flexDirection: 'row',
    marginTop: 10,
  },
  bannerLeft: {
    flex: 1,
    alignItems: 'center',
  },
  bannerRight: {
    flex: 1,
    alignItems: 'center',
  },
  bannerImage: {
    width: '100%',
    height: 140,
  },
  bannerText: {
    fontSize: 14,
    color: 'white',
    marginTop: 10,
  },
  bannerProfile: {
    width: 80,
    height: 80,
    marginTop: 10,
    borderRadius: 50,
  },
  bannerProfileName: {
    fontSize: 12,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 10,
  },
  bannerProfilePosition: {
    fontSize: 10,
    color: 'white',
    marginTop: 5,
  },
  appTitle: {
    alignItems: 'center',
    padding: 20,
  },
  appTitleText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'black',
  },
  appTitleSubtitle: {
    fontSize: 16,
    color: 'white',
    marginTop: 5,
  },
  menu: {
    alignItems: 'center',
    marginTop: 40,
  },
  menuTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 20,
  },
  menuItems: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  menuItem: {
    width: 100,
    alignItems: 'center',
    height: 100,
    borderRadius: 50, // Membuat lingkaran
    backgroundColor: '#39378A',
    justifyContent: 'center',
    marginBottom: 5,
  },
  menuItemIcon: {
    width: 60,
    height: 60,
  },
  menuItemText: {
    fontSize: 14,
    color: 'black',
    marginTop: 10,
  },
});

export default function Home({ navigation }: StackProps) {
  const { getPersistData, setPersistData } = useDataPersist();
  const { user } = useAppSlice();
  const [isReady, setReady] = useState(false);
  const [fotoUri, setFotoUri] = useState<string | null>(null);
  const [statusCode, setStatusCode] = useState<number | null>(null);

  const preloadHome = async () => {
    try {
      const token = await getPersistData<IUser>(DataPersistKeys.TOKEN);
      if (token) {
        console.log('User Token found:', token);
        const foto = await axios.post(
          `${config.API_URL}/api/user/download`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token.access_token}`,
            },
            responseType: 'blob',
          },
        );
        const ImageUrl = URL.createObjectURL(foto.data);
        setFotoUri(ImageUrl);

        const accessToken = foto.headers['access-token'];
        foto.headers.access_token = accessToken;
        delete foto.headers['access-token'];

        setStatusCode(foto.status);
        // console.log('header foto', headers);
        // console.log('headera asli foto', foto.headers);

        if (foto.status == 200) {
          const SimpanToken = await setPersistData(DataPersistKeys.TOKEN, foto.headers);
          if (SimpanToken) {
            console.log('Token Dari Foto berhasil disimpan');
          }
        } else {
        }
      } else {
        console.log('Token not found.');
      }
    } catch (err) {
      console.log('[##] preload error Home:', err);
      // hide splash screen
    } finally {
      setReady(true);
    }
  };

  useEffect(() => {
    preloadHome();
  }, []);

  if (!isReady) {
    return null; // or a loading indicator
  }
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <Image source={images.logo_sm} style={styles.logo} />
        <Text style={styles.headerTitle}>SIMPEG SEHAT</Text>
      </View>
      <View style={styles.welcome}>
        <View style={styles.foto_profile}>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('UserStack', { from: 'User' });
            }}>
            {statusCode === 200 && fotoUri ? (
              <Image source={{ uri: fotoUri }} style={styles.profile} />
            ) : (
              <Image source={images.profile} style={styles.profile} />
            )}
          </TouchableOpacity>
        </View>
        <View style={{ marginHorizontal: 5 }}>
          <Text style={styles.welcomeText}>Halo, Selamat Datang</Text>
          <Text style={styles.userName}>{user?.data.nama}</Text>
          <Text style={styles.userPosition}>{user?.data.nik}</Text>
        </View>

        <View style={{ flexDirection: 'row-reverse' }}>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('UserStack', { from: 'User' });
            }}>
            <Image source={images.lonceng} style={styles.logo_lonceng} />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.banner}>
        <View style={styles.bannerLeft}>
          <Image source={images.banner} style={styles.bannerImage} />
        </View>
      </View>
      <View style={styles.menu}>
        <Text style={styles.menuTitle}>MENU</Text>
        <View style={styles.menuItems}>
          <View style={{ alignItems: 'center', marginHorizontal: 10 }}>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                navigation.navigate('BerkasStack', { from: 'Berkas' });
              }}>
              <Image source={images.berkas} style={styles.menuItemIcon} />
            </TouchableOpacity>
            <Text style={styles.menuItemText}>Berkas</Text>
          </View>
          <View style={{ alignItems: 'center', marginHorizontal: 10 }}>
            <TouchableOpacity style={styles.menuItem}>
              <Image source={images.kinerja} style={styles.menuItemIcon} />
            </TouchableOpacity>
            <Text style={styles.menuItemText}>E-Kinerja</Text>
          </View>
          <View style={{ alignItems: 'center', marginHorizontal: 10 }}>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                navigation.navigate('AbsensiStack', { from: 'Absensi' });
              }}>
              <Image source={images.absensi} style={styles.menuItemIcon} />
            </TouchableOpacity>
            <Text style={styles.menuItemText}>Absensi</Text>
          </View>
        </View>
      </View>
      <View
        style={{
          position: 'absolute', // Mengatur posisi absolut
          bottom: 0, // Menempatkan teks di bagian bawah layar
          left: 0,
          right: 0,
          marginBottom: 20, // Jarak dari bawah layar
          alignItems: 'center', // Menempatkan teks di tengah secara horizontal
        }}>
        <Text
          style={{
            fontSize: 12,
            color: '#000000',
          }}>
          © IT RSUD HAT
        </Text>
      </View>
    </SafeAreaView>
  );
}
