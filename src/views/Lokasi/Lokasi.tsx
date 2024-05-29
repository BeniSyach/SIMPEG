import React, { useEffect, useState } from 'react';
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
import { DataPersistKeys, useDataPersist } from '@hooks';
import { IUser, useAppSlice } from '@modules/app';
import FormInput from '@components/FormInput';
import { useLokasiService, useLokasiSlice } from '@modules/lokasi';
import axios from 'axios';
import config from '@utils/config';

const styles = StyleSheet.create({
  root: {
    flex: 1,
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
    width: 40,
    height: 40,
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
  form: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 3,
  },
  buttonContainer: {
    marginTop: 16,
  },
});

export default function Lokasi({ navigation, route }: StackProps) {
  const { getPersistData, setPersistData } = useDataPersist();
  const { getlokasi } = useLokasiService();
  const { dispatch, setLokasi } = useLokasiSlice();
  const [UnitKerja, setUnitKerja] = useState('');
  const [unitKerjaError, setunitKerjaError] = useState('');
  const [isReady, setReady] = useState(false);
  const [DataLokasi, setDataLokasi] = useState('');
  const [tokenLokasi, setTokenLokasi] = useState('');

  const PreloadingLokasi = async () => {
    try {
      const token = await getPersistData<IUser>(DataPersistKeys.TOKEN);
      if (token) {
        console.log('User Token found:', token);
        const lokasi = await getlokasi(token.access_token);
        console.log('data lokasi', lokasi?.data.unit_kerja);
        if (lokasi) {
          const SimpanToken = await setPersistData(DataPersistKeys.TOKEN, lokasi);
          if (SimpanToken) {
            console.log('data lokasi berhasil disimpan');
            setDataLokasi(lokasi?.data.unit_kerja);
            setUnitKerja(lokasi?.data.unit_kerja);
            setTokenLokasi(lokasi?.access_token);
            dispatch(setLokasi(lokasi));
          }
        } else {
          Alert.alert('Error Server', `Gagal Mengambil Data`, [
            { text: 'OK', onPress: () => navigation.goBack() },
          ]);
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
    PreloadingLokasi();
  }, []);

  const handleUpdateLokasi = async () => {
    let valid = true;
    if (!UnitKerja) {
      setunitKerjaError('Unit Kerja Tidak Boleh Kosong');
      valid = false;
    } else {
      setunitKerjaError('');
    }

    try {
      const UpdateDataLokasi = await axios.post(
        `${config.API_URL}/api/lokasi/update`,
        {
          unit_kerja: `${UnitKerja}`,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${tokenLokasi}`,
          },
        },
      );
      const success = UpdateDataLokasi.data;
      if (success.status == 'success') {
        const SimpanToken = await setPersistData(DataPersistKeys.TOKEN, success);
        if (SimpanToken) {
          console.log('data lokasi berhasil disimpan');
          Alert.alert('Update Data Sukes', `Data Berhasil Diubah`, [
            { text: 'OK', onPress: () => navigation.goBack() },
          ]);
        }
      } else {
      }
    } catch (error) {
      console.log('Logout error:', error);
    }
  };

  if (!isReady) {
    return null; // or a loading indicator
  }
  return (
    <SafeAreaView style={styles.root}>
      <StatusBar barStyle="light-content" />
      <Text style={styles.title}>Update Lokasi</Text>
      <View style={styles.form}>
        <FormInput
          label="Unit Kerja"
          defaultValue={DataLokasi}
          onChangeText={setUnitKerja}
          error={unitKerjaError}
        />
        <View style={styles.buttonContainer}>
          <Button title="Edit" onPress={handleUpdateLokasi} />
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
