import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, StatusBar, SafeAreaView, Alert } from 'react-native';
import Button from '@components/Button';
import { StackProps } from '@navigator/stack';
import { colors } from '@theme';
import { DataPersistKeys, useDataPersist } from '@hooks';
import { IUser } from '@modules/app';
import FormInput from '@components/FormInput';
import { useUserService, useUserSlice } from '@modules/User';
import axios from 'axios';
import config from '@utils/config';
import ImageUpload from '@components/ImageUpload';

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

export default function User({ navigation, route }: StackProps) {
  const { getPersistData, setPersistData } = useDataPersist();
  const { getUser } = useUserService();
  const { dispatch, setUser } = useUserSlice();
  const [UnitKerja, setUnitKerja] = useState('');
  const [isReady, setReady] = useState(false);
  const [NamaUser, setnamaUser] = useState('');
  const [NamaUserError, setnamaUserError] = useState('');
  const [IdUser, setidUser] = useState('');
  const [NikUser, setNikUser] = useState(0);
  const [NipUser, setNipUser] = useState(0);
  const [EmailUser, setEmailUser] = useState('');
  const [PhotoUser, setPhotoUser] = useState('');
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [tokenLokasi, setTokenuser] = useState('');
  const [loading, setLoading] = useState(false);

  const PreloadingLokasi = async () => {
    try {
      const token = await getPersistData<IUser>(DataPersistKeys.TOKEN);
      if (token) {
        console.log('User Token found:', token);
        const user = await getUser(token.access_token);
        console.log('data user', user?.data.nik);
        if (user) {
          const SimpanToken = await setPersistData(DataPersistKeys.TOKEN, user);
          if (SimpanToken) {
            console.log('data user berhasil disimpan');
            setidUser(user?.data.id);
            setNikUser(user?.data.nik);
            setNipUser(user?.data.nip);
            setEmailUser(user?.data.email);
            setnamaUser(user?.data.nama);
            setPhotoUser(user?.data.photo);
            setTokenuser(user?.access_token);
            dispatch(setUser(user));
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

  const handleImageSelected = (uri: string) => {
    setImageUri(uri);
  };

  const handleEditUser = async () => {
    setLoading(true);
    let valid = true;
    if (!NamaUser) {
      setnamaUserError('Nama User Tidak Boleh Kosong');
      valid = false;
    } else {
      setnamaUserError('');
    }
    if (valid) {
      const formData = new FormData();
      try {
        formData.append('nama', NamaUser);

        if (imageUri) {
          // Mendapatkan nama file dari URI
          const fileName = imageUri.split('/').pop() || 'photo.jpg';
          const response = await fetch(imageUri);
          const blob = await response.blob();
          formData.append('photo', blob, fileName);
        }
        console.log('data upload', formData);
        const UpdateDataLokasi = await axios.post(`${config.API_URL}/api/user/update`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${tokenLokasi}`,
          },
        });
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
        <Text style={styles.title}>Edit User</Text>
      </View>
      <View style={styles.form}>
        <FormInput
          label="Nama"
          defaultValue={NamaUser}
          onChangeText={setnamaUser}
          error={NamaUserError}
        />
        <ImageUpload label="Foto" onImageSelected={handleImageSelected} />
        <View style={styles.buttonContainer}>
          <Button
            style={styles.button}
            titleStyle={styles.buttonTitle}
            isLoading={loading}
            loaderColor={colors.white}
            title="Edit"
            onPress={handleEditUser}
          />
        </View>
      </View>
      <View
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          marginBottom: 20,
          alignItems: 'center',
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
