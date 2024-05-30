import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, StatusBar, SafeAreaView, Alert } from 'react-native';
import Button from '@components/Button';
import { StackProps } from '@navigator/stack';
import { colors } from '@theme';
import { DataPersistKeys, useDataPersist } from '@hooks';
import { IUser } from '@modules/app';
import FormInput from '@components/FormInput';
import axios from 'axios';
import config from '@utils/config';
import { useIdentitasService, useIdentitasSlice } from '@modules/Identitas';

const styles = StyleSheet.create({
  root: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f0f0f0',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    justifyContent: 'center',
  },
  buttonTitle: {
    fontSize: 14,
    color: colors.black,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  logoButton: {
    width: 40,
    height: 40,
  },
  button: {
    backgroundColor: '#B0B0B0',
    padding: 10,
    borderRadius: 20,
    width: 50,
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
    borderRadius: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 3,
  },
  buttonContainer: {
    marginTop: 5,
  },
});

export default function Identitas({ navigation, route }: StackProps) {
  const { getPersistData, setPersistData } = useDataPersist();
  const { getIdentitas } = useIdentitasService();
  const { dispatch, setIdentitas } = useIdentitasSlice();
  const [Identitas, setInputIdentitas] = useState('');
  const [IdentitasError, setIdentitasError] = useState('');
  const [isReady, setReady] = useState(false);
  const [DataIdentitas, setDataIdentitas] = useState('');
  const [tokenIdentitas, setTokenIdentitas] = useState('');
  const [loading, setLoading] = useState(false);

  const PreloadingLokasi = async () => {
    try {
      const token = await getPersistData<IUser>(DataPersistKeys.TOKEN);
      if (token) {
        console.log('User Token found:', token);
        const identitias = await getIdentitas(token.access_token);
        console.log('data lokasi', identitias?.data.nama);
        if (identitias) {
          const SimpanToken = await setPersistData(DataPersistKeys.TOKEN, identitias);
          if (SimpanToken) {
            console.log('data identitias berhasil disimpan');
            setInputIdentitas(identitias?.data.nama);
            setDataIdentitas(identitias?.data.nama);
            setTokenIdentitas(identitias?.access_token);
            dispatch(setIdentitas(identitias));
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

  const handleUpdateIdentitas = async () => {
    setLoading(true);
    let valid = true;
    if (!Identitas) {
      setIdentitasError('Nama Identitas Tidak Boleh Kosong');
      valid = false;
    } else {
      setIdentitasError('');
    }
    if (valid) {
      try {
        const UpdateDataIdentitas = await axios.post(
          `${config.API_URL}/api/identitas/update`,
          {
            nama: `${Identitas}`,
          },
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${tokenIdentitas}`,
            },
          },
        );
        const success = UpdateDataIdentitas.data;
        if (success.status == 'success') {
          const SimpanToken = await setPersistData(DataPersistKeys.TOKEN, success);
          if (SimpanToken) {
            console.log('data Identitas berhasil disimpan');
            Alert.alert('Update Data Sukes', `Data Berhasil Diubah`, [
              { text: 'OK', onPress: () => navigation.goBack() },
            ]);
          }
        } else {
        }
      } catch (error) {
        console.log('Logout error:', error);
      }
    }
    setLoading(false);
  };

  if (!isReady) {
    return null; // or a loading indicator
  }
  return (
    <SafeAreaView style={styles.root}>
      <StatusBar barStyle="light-content" />
      <View style={{ alignItems: 'center', marginTop: 20 }}>
        <Text style={styles.title}>Edit Identitas</Text>
      </View>
      <View style={styles.form}>
        <FormInput
          label="Unit Kerja"
          defaultValue={DataIdentitas}
          onChangeText={setInputIdentitas}
          error={IdentitasError}
        />
        <View style={styles.buttonContainer}>
          <Button
            style={styles.button}
            titleStyle={styles.buttonTitle}
            isLoading={loading}
            loaderColor={colors.white}
            title="Edit"
            onPress={handleUpdateIdentitas}
          />
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
