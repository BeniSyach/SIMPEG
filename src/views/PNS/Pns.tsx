import React, { useEffect, useState } from 'react';
import {
  Text,
  View,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  Alert,
  NativeSyntheticEvent,
  TextInputChangeEventData,
  ScrollView,
} from 'react-native';
import Button from '@components/Button';
import { StackProps } from '@navigator/stack';
import { colors } from '@theme';
import { DataPersistKeys, useDataPersist } from '@hooks';
import { IUser } from '@modules/app';
import FormInput from '@components/FormInput';
import axios from 'axios';
import config from '@utils/config';
import { usePnsService, usePnsSlice } from '@modules/PNS';

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

export default function Pns({ navigation, route }: StackProps) {
  const { getPersistData, setPersistData } = useDataPersist();
  const { getPns } = usePnsService();
  const { dispatch, setPns } = usePnsSlice();
  const [Pns, setInputPns] = useState('');
  const [PnsError, setPnsError] = useState('');
  const [TglSkPns, setTglSkPns] = useState('');
  const [TglSkPnsError, setTglSkPnsError] = useState('');
  const [TmtPns, setTmtPns] = useState('');
  const [TmtPnsError, setTmtPnsError] = useState('');
  const [GolonganRuang, setGolonganRuang] = useState('');
  const [GolonganRuangError, setGolonganRuangError] = useState('');
  const [Sumpah, setSumpah] = useState('');
  const [SumpahError, setSumpahError] = useState('');
  const [TahunSumpah, setTahunSumpah] = useState(0);
  const [TahunSumpahError, setTahunSumpahError] = useState('');
  const [isReady, setReady] = useState(false);
  const [DataPns, setDataPns] = useState('');
  const [tokenPns, setTokenPns] = useState('');
  const [loading, setLoading] = useState(false);

  const PreloadingLokasi = async () => {
    try {
      const token = await getPersistData<IUser>(DataPersistKeys.TOKEN);
      if (token) {
        console.log('User Token found:', token);
        const pns = await getPns(token.access_token);
        console.log('data lokasi', pns?.data.nomor_sk_pns);
        if (pns) {
          const SimpanToken = await setPersistData(DataPersistKeys.TOKEN, pns);
          if (SimpanToken) {
            console.log('data pns berhasil disimpan');
            setInputPns(pns?.data.nomor_sk_pns);
            setDataPns(pns?.data.nomor_sk_pns);
            setTglSkPns(pns?.data.tgl_sk_pns);
            setTmtPns(pns?.data.tmt_pns);
            setGolonganRuang(pns?.data.golongan_ruang);
            setSumpah(pns?.data.sumpah);
            setTahunSumpah(pns?.data.tahun_sumpah);
            setTokenPns(pns?.access_token);
            dispatch(setPns(pns));
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
    if (!Pns) {
      setPnsError('nomor SK PNS Tidak Boleh Kosong');
      valid = false;
    } else if (!TglSkPns) {
      setTglSkPnsError('Tanggal SK PNS Tidak Boleh Kosong');
      valid = false;
    } else if (!TmtPns) {
      setTmtPnsError('TMT PNS Tidak Boleh Kosong');
      valid = false;
    } else if (!GolonganRuang) {
      setGolonganRuangError('Golongan Ruang Tidak Boleh Kosong');
      valid = false;
    } else if (!Sumpah) {
      setSumpahError('Sumpah Tidak Boleh Kosong');
      valid = false;
    } else if (TahunSumpah < 1000) {
      setTahunSumpahError('Tahun Sumpah Tidak Boleh Kosong');
      valid = false;
    } else {
      setPnsError('');
    }
    if (valid) {
      try {
        const UpdateDataCpns = await axios.post(
          `${config.API_URL}/api/cpns/update`,
          {
            nomor_sk_pns: `${Pns}`,
            tgl_sk_pns: `${TglSkPns}`,
            tmt_pns: `${TmtPns}`,
            golongan_ruang: `${GolonganRuang}`,
            sumpah: `${Sumpah}`,
            tahun_sumpah: `${TahunSumpah}`,
          },
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${tokenPns}`,
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

  const handleChange = (e: NativeSyntheticEvent<TextInputChangeEventData>) => {
    const text = e.nativeEvent.text;
    const numericValue = parseFloat(text);
    if (!isNaN(numericValue)) {
      setTahunSumpah(numericValue);
    } else {
      setTahunSumpah(0); // or handle the invalid input case as needed
    }
  };

  if (!isReady) {
    return null; // or a loading indicator
  }
  return (
    <SafeAreaView style={styles.root}>
      <ScrollView>
        <StatusBar barStyle="light-content" backgroundColor={colors.black} />
        <View style={{ alignItems: 'center', marginTop: 20 }}>
          <Text style={styles.title}>Edit PNS</Text>
        </View>
        <View style={styles.form}>
          <FormInput
            label="Nomor SK PNS"
            defaultValue={DataPns}
            onChangeText={setInputPns}
            error={PnsError}
          />
          <FormInput
            label="Tanggal SK PNS"
            defaultValue={TglSkPns}
            onChangeText={setTglSkPns}
            error={TglSkPnsError}
          />
          <FormInput
            label="TMT PNS"
            defaultValue={TmtPns}
            onChangeText={setTmtPns}
            error={TmtPnsError}
          />
          <FormInput
            label="Golongan Ruang"
            defaultValue={GolonganRuang}
            onChangeText={setGolonganRuang}
            error={GolonganRuangError}
          />
          <FormInput
            label="Sumpah"
            defaultValue={Sumpah}
            onChangeText={setSumpah}
            error={SumpahError}
          />
          <FormInput
            label="Tahun Sumpah"
            keyboardType="numeric"
            defaultValue={TahunSumpah.toString()}
            onChange={handleChange}
            error={TahunSumpahError}
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
      </ScrollView>
    </SafeAreaView>
  );
}
