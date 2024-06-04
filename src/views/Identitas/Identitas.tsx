import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, StatusBar, SafeAreaView, Alert, ScrollView } from 'react-native';
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
  const [GelarDepan, setGelarDepan] = useState('');
  const [GelarDepanError, setGelarDepanError] = useState('');
  const [GelarBelakang, setGelarBelakang] = useState('');
  const [GelarBelakangError, setGelarBelakangError] = useState('');
  const [TempatLahir, setTempatLahir] = useState('');
  const [TempatLahirError, setTempatLahirError] = useState('');
  const [TanggalLahir, setTanggalLahir] = useState('');
  const [TanggalLahirError, setTanggalLahirError] = useState('');
  const [JenisKelamin, setJenisKelamin] = useState('');
  const [JenisKelaminError, setJenisKelaminError] = useState('');
  const [Agama, setAgama] = useState('');
  const [AgamaError, setAgamaError] = useState('');
  const [StatusPegawai, setStatusPegawai] = useState('');
  const [StatusPegawaiError, setStatusPegawaiError] = useState('');
  const [StatusKawin, setStatusKawin] = useState('');
  const [StatusKawinError, setStatusKawinError] = useState('');
  const [KedudukanPegawai, setKedudukanPegawai] = useState('');
  const [KedudukanPegawaiError, setKedudukanPegawaiError] = useState('');
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
            setGelarDepan(identitias?.data.gelar_depan);
            setGelarBelakang(identitias?.data.gelar_belakang);
            setTempatLahir(identitias?.data.tempat_lahir);
            setTanggalLahir(identitias?.data.tanggal_lahir);
            setJenisKelamin(identitias?.data.jenis_kelamin);
            setAgama(identitias?.data.agama);
            setStatusPegawai(identitias?.data.status_pegawai);
            setStatusKawin(identitias?.data.status_kawin);
            setKedudukanPegawai(identitias?.data.kedudukan_pegawai);
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
    } else if (!GelarDepan) {
      setGelarDepanError('Gelar Depan Tidak Boleh Kosong');
      valid = false;
    } else if (!GelarBelakang) {
      setGelarBelakangError('Gelar Belakang Tidak Boleh Kosong');
      valid = false;
    } else if (!TempatLahir) {
      setTempatLahirError('Tempat Lahir Tidak Boleh Kosong');
      valid = false;
    } else if (!TanggalLahir) {
      setTanggalLahirError('Tanggal Lahir Tidak Boleh Kosong');
      valid = false;
    } else if (!JenisKelamin) {
      setJenisKelaminError('Jenis Kelamin Tidak Boleh Kosong');
      valid = false;
    } else if (!Agama) {
      setAgamaError('Agama Tidak Boleh Kosong');
      valid = false;
    } else if (!StatusPegawai) {
      setStatusPegawaiError('Status Pegawai Tidak Boleh Kosong');
      valid = false;
    } else if (!StatusKawin) {
      setStatusKawinError('Status Kawin Tidak Boleh Kosong');
      valid = false;
    } else if (!KedudukanPegawai) {
      setKedudukanPegawai('Kedudukan Pegawai Tidak Boleh Kosong');
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
            gelar_depan: `${GelarDepan}`,
            gelar_belakang: `${GelarBelakang}`,
            tempat_lahir: `${TempatLahir}`,
            tanggal_lahir: `${TanggalLahir}`,
            jenis_kelamin: `${JenisKelamin}`,
            agama: `${Agama}`,
            status_pegawai: `${StatusPegawai}`,
            status_kawin: `${StatusKawin}`,
            kedudukan_pegawai: `${KedudukanPegawai}`,
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
      <ScrollView>
        <StatusBar barStyle="light-content" />
        <View style={{ alignItems: 'center', marginTop: 20 }}>
          <Text style={styles.title}>Edit Identitas</Text>
        </View>
        <View style={styles.form}>
          <FormInput
            label="Nama Pegawai"
            defaultValue={DataIdentitas}
            onChangeText={setInputIdentitas}
            error={IdentitasError}
          />
          <FormInput
            label="Gelar Depan"
            defaultValue={GelarDepan}
            onChangeText={setGelarDepan}
            error={GelarDepanError}
          />
          <FormInput
            label="Gelar Belakang"
            defaultValue={GelarBelakang}
            onChangeText={setGelarBelakang}
            error={GelarBelakangError}
          />
          <FormInput
            label="Tempat Lahir"
            defaultValue={TempatLahir}
            onChangeText={setTempatLahir}
            error={TempatLahirError}
          />
          <FormInput
            label="Tanggal Lahir"
            defaultValue={TanggalLahir}
            onChangeText={setTanggalLahir}
            error={TanggalLahirError}
          />
          <FormInput
            label="Jenis Kelamin"
            defaultValue={JenisKelamin}
            onChangeText={setJenisKelamin}
            error={JenisKelaminError}
          />
          <FormInput
            label="Agama"
            defaultValue={Agama}
            onChangeText={setAgama}
            error={AgamaError}
          />
          <FormInput
            label="Status Pegawai"
            defaultValue={StatusPegawai}
            onChangeText={setStatusPegawai}
            error={StatusPegawaiError}
          />
          <FormInput
            label="Status Kawin"
            defaultValue={StatusKawin}
            onChangeText={setStatusKawin}
            error={StatusKawinError}
          />
          <FormInput
            label="Kedudukan Pegawai"
            defaultValue={KedudukanPegawai}
            onChangeText={setKedudukanPegawai}
            error={KedudukanPegawaiError}
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
      </ScrollView>
    </SafeAreaView>
  );
}
