import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, StatusBar, SafeAreaView, Alert, ScrollView } from 'react-native';
import Button from '@components/Button';
import { StackProps } from '@navigator/stack';
import { colors } from '@theme';
import { DataPersistKeys, useDataPersist } from '@hooks';
import { IUser } from '@modules/app';
import FormInput from '@components/FormInput';
import { useLokasiService, useLokasiSlice } from '@modules/lokasi';
import axios from 'axios';
import config from '@utils/config';

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

export default function Lokasi({ navigation, route }: StackProps) {
  const { getPersistData, setPersistData } = useDataPersist();
  const { getlokasi } = useLokasiService();
  const { dispatch, setLokasi } = useLokasiSlice();
  const [UnitKerja, setUnitKerja] = useState('');
  const [unitKerjaError, setunitKerjaError] = useState('');
  const [SubUnitKerja, setSubUnitKerja] = useState('');
  const [SubUnitKerjaError, setSubUnitKerjaError] = useState('');
  const [JenisJabatan, setJenisJabatan] = useState('');
  const [JenisJabatanError, setJenisJabatanError] = useState('');
  const [jabatan, setJabatan] = useState('');
  const [JabatanError, setJabatanError] = useState('');
  const [KdUnitKerja, setKdUnitKerja] = useState('');
  const [KdUnitKerjaError, setKdUnitKerjaError] = useState('');
  const [KdSubUnitKerja, setKdSubUnitKerja] = useState('');
  const [KdSubUnitKerjaError, setKdSubUnitKerjaError] = useState('');
  const [KdJenisJabatan, setKdJenisJabatan] = useState('');
  const [KdJenisJabatanError, setKdJenisJabatanError] = useState('');
  const [KdJabatan, setKdJabatan] = useState('');
  const [KdJabatanError, setKdJabatanError] = useState('');

  const [isReady, setReady] = useState(false);
  const [DataLokasi, setDataLokasi] = useState('');
  const [tokenLokasi, setTokenLokasi] = useState('');
  const [loading, setLoading] = useState(false);

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
            setSubUnitKerja(lokasi?.data.sub_unit_kerja);
            setJenisJabatan(lokasi?.data.jenis_jabatan);
            setJabatan(lokasi?.data.jabatan);
            setKdUnitKerja(lokasi?.data.kd_unit_kerja);
            setKdSubUnitKerja(lokasi?.data.kd_sub_unit_kerja);
            setKdJenisJabatan(lokasi?.data.kd_jenis_jabatan);
            setKdJabatan(lokasi?.data.kd_jabatan);
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
    setLoading(true);
    let valid = true;
    if (!UnitKerja) {
      setunitKerjaError('Unit Kerja Tidak Boleh Kosong');
      valid = false;
    } else if (!SubUnitKerja) {
      setSubUnitKerjaError('Sub Unit Kerja Tidak Boleh Kosong');
      valid = false;
    } else if (!JenisJabatan) {
      setJenisJabatanError('Jenis Jabatan Tidak Boleh Kosong');
      valid = false;
    } else if (!jabatan) {
      setJabatanError('Jabatan Tidak Boleh Kosong');
      valid = false;
    } else if (!KdUnitKerja) {
      setKdUnitKerjaError('Kode Unit Kerja Tidak Boleh Kosong');
      valid = false;
    } else if (!KdSubUnitKerja) {
      setKdSubUnitKerjaError('Kode Sub Unit Kerja Tidak Boleh Kosong');
      valid = false;
    } else if (!KdJenisJabatan) {
      setKdJenisJabatanError('Kode Jenis Jabatan Tidak Boleh Kosong');
      valid = false;
    } else if (!KdJabatan) {
      setKdJabatanError('Kode Jabatan Tidak Boleh Kosong');
      valid = false;
    } else {
      setunitKerjaError('');
    }
    if (valid) {
      try {
        const UpdateDataLokasi = await axios.post(
          `${config.API_URL}/api/lokasi/update`,
          {
            unit_kerja: `${UnitKerja}`,
            sub_unit_kerja: `${SubUnitKerja}`,
            jenis_jabatan: `${JenisJabatan}`,
            jabatan: `${jabatan}`,
            kd_unit_kerja: `${KdUnitKerja}`,
            kd_sub_unit_kerja: `${KdSubUnitKerja}`,
            kd_jenis_jabatan: `${KdJenisJabatan}`,
            kd_jabatan: `${KdJabatan}`,
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
          <Text style={styles.title}>Edit Lokasi</Text>
        </View>
        <View style={styles.form}>
          <FormInput
            label="Unit Kerja"
            defaultValue={DataLokasi}
            onChangeText={setUnitKerja}
            error={unitKerjaError}
          />
          <FormInput
            label="Sub Unit Kerja"
            defaultValue={SubUnitKerja}
            onChangeText={setSubUnitKerja}
            error={SubUnitKerjaError}
          />
          <FormInput
            label="Jenis Jabatan"
            defaultValue={JenisJabatan}
            onChangeText={setJenisJabatan}
            error={JenisJabatanError}
          />
          <FormInput
            label="Jabatan"
            defaultValue={jabatan}
            onChangeText={setJabatan}
            error={JabatanError}
          />
          <FormInput
            label="Kode Unit Kerja"
            defaultValue={KdUnitKerja}
            onChangeText={setKdUnitKerja}
            error={KdUnitKerjaError}
          />
          <FormInput
            label="Kode Sub Unit Kerja"
            defaultValue={KdSubUnitKerja}
            onChangeText={setKdUnitKerja}
            error={KdSubUnitKerjaError}
          />
          <FormInput
            label="Kode Jenis Jabatan"
            defaultValue={KdJenisJabatan}
            onChangeText={setKdJenisJabatan}
            error={KdJenisJabatanError}
          />
          <FormInput
            label="Kode Jabatan"
            defaultValue={KdJabatan}
            onChangeText={setKdJabatan}
            error={KdJabatanError}
          />
          <View style={styles.buttonContainer}>
            <Button
              style={styles.button}
              titleStyle={styles.buttonTitle}
              isLoading={loading}
              loaderColor={colors.white}
              title="Edit"
              onPress={handleUpdateLokasi}
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
