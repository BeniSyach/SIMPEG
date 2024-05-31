import React from 'react';
import {
  Text,
  View,
  StyleSheet,
  StatusBar,
  Image,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from 'react-native';
import Button from '@components/Button';
import { StackProps } from '@navigator/stack';
import { colors, images } from '@theme';
import { useDataPersist } from '@hooks';
import { useAppSlice } from '@modules/app';

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#F2F2FF',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  buttonTitle: {
    fontSize: 16,
    color: colors.black,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  logoButton: {
    width: 25,
    height: 25,
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 22,
    height: 44,
    width: '50%',
    backgroundColor: colors.red,
    marginTop: 30,
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
    marginBottom: 20,
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

export default function Profile({ navigation }: StackProps) {
  const { removeAllPersistData } = useDataPersist();
  const { dispatch, reset } = useAppSlice();

  const confirmLogout = () => {
    Alert.alert(
      'Konfirmasi Logout',
      'Apakah Anda Yakin Keluar Akun',
      [
        {
          text: 'Batal',
          onPress: () => console.log('Logout canceled'),
          style: 'cancel',
        },
        { text: 'OK', onPress: handleLogout },
      ],
      { cancelable: false },
    );
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

  return (
    <SafeAreaView style={styles.root}>
      <StatusBar barStyle="light-content" />
      <View style={styles.menu}>
        <Text style={styles.menuTitle}>Profile</Text>
        <View style={styles.menuItems}>
          <View style={{ alignItems: 'center', marginHorizontal: 10 }}>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                navigation.navigate('LokasiStack', { from: 'Lokasi' });
              }}>
              <Image source={images.lokasi} style={styles.menuItemIcon} />
            </TouchableOpacity>
            <Text style={styles.menuItemText}>Lokasi</Text>
          </View>
          <View style={{ alignItems: 'center', marginHorizontal: 10 }}>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                navigation.navigate('IdentitasStack', { from: 'Identitas' });
              }}>
              <Image source={images.identitas} style={styles.menuItemIcon} />
            </TouchableOpacity>
            <Text style={styles.menuItemText}>Identitas</Text>
          </View>
          <View style={{ alignItems: 'center', marginHorizontal: 10 }}>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                navigation.navigate('CpnsStack', { from: 'CPNS' });
              }}>
              <Image source={images.cpns} style={styles.menuItemIcon} />
            </TouchableOpacity>
            <Text style={styles.menuItemText}>CPNS</Text>
          </View>
        </View>
        <View style={styles.menuItems}>
          <View style={{ alignItems: 'center', marginHorizontal: 10 }}>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                navigation.navigate('PnsStack', { from: 'PNS' });
              }}>
              <Image source={images.pns} style={styles.menuItemIcon} />
            </TouchableOpacity>
            <Text style={styles.menuItemText}>PNS</Text>
          </View>
          <View style={{ alignItems: 'center', marginHorizontal: 10 }}>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                navigation.navigate('PangkatGajiStack', { from: 'Pangkat Gaji' });
              }}>
              <Image source={images.pangkatGaji} style={styles.menuItemIcon} />
            </TouchableOpacity>
            <Text style={styles.menuItemText}>Pangkat Gaji</Text>
          </View>
          <View style={{ alignItems: 'center', marginHorizontal: 10 }}>
            <TouchableOpacity style={styles.menuItem}>
              <Image source={images.user} style={styles.menuItemIcon} />
            </TouchableOpacity>
            <Text style={styles.menuItemText}>User</Text>
          </View>
        </View>
        <Button
          image={images.logout}
          imageStyle={styles.logoButton}
          title="Keluar"
          titleStyle={styles.buttonTitle}
          style={styles.button}
          onPress={confirmLogout}
        />
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
