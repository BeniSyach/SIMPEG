import React, { useEffect, useState } from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Image as ImageReact,
  Alert,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { StackProps } from '@navigator/stack';
import { images } from '@theme';
import { DataPersistKeys, useDataPersist } from '@hooks';
import { IUser, useAppSlice } from '@modules/app';
import axios from 'axios';
import config from '@utils/config';
import Image from '@components/Image';
import * as FileSystem from 'expo-file-system';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2FF',
  },
  header: {
    backgroundColor: '#a8e063',
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
    color: 'black',
    marginLeft: 20,
  },
  welcome: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 10,
    backgroundColor: '#56ab2f',
  },
  foto_profile: {
    borderRadius: 50,
    marginRight: 3,
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
    fontSize: 14,
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
    backgroundColor: '#56ab2f',
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
  const { getPersistData, setPersistData, removeAllPersistData } = useDataPersist();
  const { dispatch, reset, user } = useAppSlice();
  const [isReady, setReady] = useState(false);
  const [fotoUri, setFotoUri] = useState<string | null>(null);
  const [statusCode, setStatusCode] = useState<number | null>(null);

  const preloadHome = async () => {
    try {
      const token = await getPersistData<IUser>(DataPersistKeys.TOKEN);
      console.log('User Token found 0:', token);
      if (token) {
        console.log('User Token found:', token);
        try {
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
          const reader = new FileReader();
          reader.readAsDataURL(foto.data);
          reader.onloadend = () => {
            const base64data = reader.result as string;

            // Save base64 data to a file
            const fileUri = `${FileSystem.documentDirectory}downloaded_image_${Date.now()}.jpg`;
            FileSystem.writeAsStringAsync(fileUri, base64data.split(',')[1], {
              encoding: FileSystem.EncodingType.Base64,
            }).then(() => {
              setFotoUri(fileUri);
            });
          };
          // const ImageUrl = URL.createObjectURL(foto.data);
          // setFotoUri(ImageUrl);

          const accessToken = foto.headers['access-token'];
          foto.headers.access_token = accessToken;
          delete foto.headers['access-token'];

          setStatusCode(foto.status);
          console.log('data foto', foto.headers);
          // console.log('header foto', headers);
          // console.log('headera asli foto', foto.headers);

          if (foto.status === 200) {
            const SimpanToken = await setPersistData(DataPersistKeys.TOKEN, foto.headers);
            if (SimpanToken) {
              console.log('Token Dari Foto berhasil disimpan');
            }
          } else {
            Alert.alert('Error Internet 1', `Silahkan Login Kembali`, [
              { text: 'OK', onPress: handleLogout },
            ]);
          }
        } catch (err) {
          if (axios.isAxiosError(err) && err.response?.status === 404) {
            // Menangani khusus untuk status 404
            console.log('Status 404 ditemukan, tidak masalah.');
            setStatusCode(404);

            // Mengambil data dari respons 404
            const responseBlob = err.response?.data;
            if (responseBlob) {
              const responseText = await new Response(responseBlob).text();
              const responseData = JSON.parse(responseText);
              console.log('Data dari respons 404:', responseData);

              // Menyimpan token baru dari data respons
              if (responseData?.access_token) {
                const newToken = { access_token: responseData.access_token };
                const simpanToken = await setPersistData(DataPersistKeys.TOKEN, newToken);
                if (simpanToken) {
                  console.log('Token baru dari respons 404 berhasil disimpan', newToken);
                }
              }
            }
          } else {
            // Menangani error lainnya
            console.log('[##] preload error Home:', err);
            Alert.alert('Error Server 1', 'Silahkan login kembali', [
              { text: 'OK', onPress: handleLogout },
            ]);
          }
        }
      } else {
        Alert.alert('Error Internet 2', 'Silahkan login kembali', [
          { text: 'OK', onPress: handleLogout },
        ]);
      }
    } catch (err) {
      // Menangani error yang terjadi saat mengambil token
      console.log('[##] preload error Home:', err);
      Alert.alert('Error Server 2', 'Silahkan login kembali', [
        { text: 'OK', onPress: handleLogout },
      ]);
    } finally {
      setReady(true);
    }
  };

  const handleLogout = async () => {
    try {
      // Hapus data pengguna dari penyimpanan persisten
      const hapusDataLogin = await removeAllPersistData();
      if (hapusDataLogin) {
        console.log('Berhasil menghapus data pengguna.');
        // Reset status login dan hapus data pengguna dari store Redux
        dispatch(reset());
        Alert.alert('Logout Berhasil', `Berhasil Keluar akun`);
      } else {
        console.error('Gagal megnhapus data pengguna.');
      }
    } catch (error) {
      console.log('Logout error:', error);
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
      <StatusBar barStyle="light-content" backgroundColor="#6a51ae" />
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
              <ImageReact source={{ uri: fotoUri }} style={styles.profile} />
            ) : (
              <Image source={images.profile} style={styles.profile} />
            )}
          </TouchableOpacity>
        </View>
        <View style={{ flex: 1, marginHorizontal: 5 }}>
          <Text style={styles.welcomeText}>Halo, Selamat Datang</Text>
          <Text numberOfLines={1} style={styles.userName}>
            {user?.data.nama}
          </Text>
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
