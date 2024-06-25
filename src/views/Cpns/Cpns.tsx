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
import { useCpnsService, useCpnsSlice } from '@modules/CPNS';

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
    width: 100,
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

export default function Cpns({ navigation, route }: StackProps) {
  const { getPersistData, setPersistData } = useDataPersist();
  const { getCpns } = useCpnsService();
  const { dispatch, setCpns } = useCpnsSlice();
  const [Cpns, setInputCpns] = useState('');
  const [CpnsError, setCpnsError] = useState('');
  const [TglSkCpns, setTglSkCpns] = useState('');
  const [TglSkCpnsError, setTglSkCpnsError] = useState('');
  const [TmtCpns, setTmtCpns] = useState('');
  const [TmtCpnsError, setTmtCpnsError] = useState('');
  const [GolonganRuang, setGolonganRuang] = useState('');
  const [GolonganRuangError, setGolonganRuangError] = useState('');
  const [isReady, setReady] = useState(false);
  const [DataCpns, setDataCpns] = useState('');
  const [tokenCpns, setTokenCpns] = useState('');
  const [loading, setLoading] = useState(false);

  const PreloadingLokasi = async () => {
    try {
      const token = await getPersistData<IUser>(DataPersistKeys.TOKEN);
      if (token) {
        console.log('User Token found:', token);
        const cpns = await getCpns(token.access_token);
        console.log('data lokasi', cpns?.data.nomor_sk_cpns);
        if (cpns) {
          const SimpanToken = await setPersistData(DataPersistKeys.TOKEN, cpns);
          if (SimpanToken) {
            console.log('data cpns berhasil disimpan');
            setInputCpns(cpns?.data.nomor_sk_cpns);
            setDataCpns(cpns?.data.nomor_sk_cpns);
            setTglSkCpns(cpns?.data.tgl_sk_cpns);
            setTmtCpns(cpns?.data.tmt_cpns);
            setGolonganRuang(cpns?.data.golongan_ruang);
            setTokenCpns(cpns?.access_token);
            dispatch(setCpns(cpns));
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

  const handleUpdateCpns = async () => {
    setLoading(true);
    let valid = true;
    if (!Cpns) {
      setCpnsError('nomor SK CPNS Tidak Boleh Kosong');
      valid = false;
    } else if (!TglSkCpns) {
      setTglSkCpnsError('Tanggal SK CPNS Tidak Boleh Kosong');
      valid = false;
    } else if (!TmtCpns) {
      setTmtCpnsError('TMT CPNS Tidak Boleh Kosong');
      valid = false;
    } else if (!GolonganRuang) {
      setGolonganRuang('Golongan Ruang Tidak Boleh Kosong');
      valid = false;
    } else {
      setCpnsError('');
    }
    if (valid) {
      try {
        const UpdateDataCpns = await axios.post(
          `${config.API_URL}/api/cpns/update`,
          {
            nomor_sk_cpns: `${Cpns}`,
            tgl_sk_cpns: `${TglSkCpns}`,
            tmt_cpns: `${TmtCpns}`,
            golongan_ruang: `${GolonganRuang}`,
          },
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${tokenCpns}`,
            },
          },
        );
        const success = UpdateDataCpns.data;
        if (success.status == 'success') {
          const SimpanToken = await setPersistData(DataPersistKeys.TOKEN, success);
          if (SimpanToken) {
            console.log('data Cpns berhasil disimpan');
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
        <Text style={styles.title}>Edit Cpns</Text>
      </View>
      <View style={styles.form}>
        <FormInput
          label="Nomor SK CPNS"
          defaultValue={DataCpns}
          onChangeText={setInputCpns}
          error={CpnsError}
        />
        <FormInput
          label="Tanggal SK CPNS"
          defaultValue={TglSkCpns}
          onChangeText={setTglSkCpns}
          error={TglSkCpnsError}
        />
        <FormInput
          label="TMT CPNS"
          defaultValue={TmtCpns}
          onChangeText={setTmtCpns}
          error={TmtCpnsError}
        />
        <FormInput
          label="Golongan Ruang"
          defaultValue={GolonganRuang}
          onChangeText={setGolonganRuang}
          error={GolonganRuangError}
        />
        <View style={styles.buttonContainer}>
          <Button
            style={styles.button}
            titleStyle={styles.buttonTitle}
            isLoading={loading}
            loaderColor={colors.white}
            title="Edit"
            onPress={handleUpdateCpns}
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
