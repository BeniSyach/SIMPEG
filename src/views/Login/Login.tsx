import React, { useState } from 'react';
import { View, StyleSheet, Alert, Text } from 'react-native';
import { useAppService, useAppSlice } from '@modules/app';
import Button from '@components/Button';
import FormInput from '@components/FormInput';
import config from '@utils/config';
import { useDataPersist, DataPersistKeys } from '@hooks';
import { LinearGradient } from 'expo-linear-gradient';
import Image from '@components/Image';
import { images } from '@theme';

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 32,
  },
  posisi_logo: {
    alignItems: 'center',
  },
  logo: {
    width: 100,
    height: 100,
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
  button: {
    marginTop: 5,
    marginBottom: 10,
  },
  Footertitle: {
    marginVertical: 15,
    fontSize: 14,
    color: 'rgba(156, 163, 175, 0.8)',
    textAlign: 'center',
  },
  subTitleFooter: {
    fontSize: 14,
    color: 'rgba(156, 163, 175, 0.8)',
    textAlign: 'center',
  },
});

const Login = () => {
  const [nik, setNik] = useState('');
  const [password, setPassword] = useState('');
  const [nikError, setNikError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const { dispatch, setUser, setLoggedIn, reset } = useAppSlice();
  const { setPersistData } = useDataPersist();

  const { login } = useAppService();

  const handleLogin = async () => {
    let valid = true;
    if (!nik) {
      setNikError('NIK/NIP Tidak Boleh Kosong');
      valid = false;
    } else if (!/^\d+$/.test(nik)) {
      setNikError('NIK/NIP Harus Angka');
      valid = false;
    } else {
      setNikError('');
    }

    if (!password) {
      setPasswordError('Password Tidak Boleh Kosong');
      valid = false;
    } else {
      setPasswordError('');
    }

    if (valid) {
      try {
        const user = await login(nik, password);
        // console.log('data', user);
        if (user) {
          const dataLogin = {
            user,
            nik,
            password,
          };
          const success = await setPersistData(DataPersistKeys.USER, dataLogin);
          if (success) {
            console.log('user', user);
            const SimpanToken = await setPersistData(DataPersistKeys.TOKEN, user);
            if (SimpanToken) {
              console.log('Data pengguna berhasil disimpan.', SimpanToken);
              Alert.alert('Login Sukes', `Selamat Datang, ${user.data.nama}`);
              dispatch(setUser(user));
              dispatch(setLoggedIn(true));
            }
          } else {
            console.error('Gagal menyimpan data pengguna.');
          }
        } else {
          dispatch(reset());
          Alert.alert('Login Failed', 'NIK/NIP atau Password Salah');
        }
      } catch (error) {
        dispatch(reset());
        Alert.alert('Login Failed', 'Kesalahan Server');
        console.log(error);
        console.log('Url ', config.API_URL);
      }
    } else {
      dispatch(reset());
    }
  };

  return (
    <LinearGradient colors={['#a8e063', '#56ab2f']} style={styles.gradient}>
      <View style={styles.container}>
        <View style={styles.form}>
          <View style={styles.posisi_logo}>
            <Image source={images.logo_sm} style={styles.logo} />
          </View>
          <FormInput
            label="NIK/NIP"
            value={nik}
            onChangeText={setNik}
            keyboardType="numeric"
            error={nikError}
          />
          <FormInput
            label="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            error={passwordError}
          />
          <View style={styles.buttonContainer}>
            <Button title="Login" onPress={handleLogin} style={styles.button} />
          </View>
          <Text style={styles.Footertitle}>Version 1.0</Text>
          <Text style={styles.subTitleFooter}>Sistem Informasi Management Pegawai</Text>
          <Text style={styles.subTitleFooter}>Dinas Kesehatan Kabupaten Deli Serdang</Text>
        </View>
      </View>
    </LinearGradient>
  );
};

export default Login;
