import React, { useState } from 'react';
import { View, StyleSheet, Alert, Text } from 'react-native';
import { useAppService, useAppSlice } from '@modules/app';
import Button from '@components/Button';
import FormInput from '@components/FormInput';
import config from '@utils/config';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#f0f0f0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 32,
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

const Login = () => {
  const [nik, setNik] = useState('');
  const [password, setPassword] = useState('');
  const [nikError, setNikError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const { dispatch, setUser, setLoggedIn, reset } = useAppSlice();

  const { getUser } = useAppService();

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
        const user = await getUser(nik, password);
        if (user) {
          dispatch(setUser(user));
          dispatch(setLoggedIn(true));
          Alert.alert('Login Successful', `Welcome, ${user.name}`);
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
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <View style={styles.form}>
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
          <Button title="Login" onPress={handleLogin} />
        </View>
      </View>
    </View>
  );
};

export default Login;
