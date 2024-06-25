import React, { useState } from 'react';
import { StyleSheet, View, Text, Alert } from 'react-native';
import GradientButton from '@components/GradientButton';
import { colors, fonts } from '@theme';
import { windowWidth } from '@utils/deviceInfo';
import FormInput from '@components/FormInput';
import DatePicker from '@components/DatePicker';
import axios from 'axios';
import config from '@utils/config';
import { DataPersistKeys, useDataPersist } from '@hooks';
import { IUser } from '@modules/app';

const styles = StyleSheet.create({
  root: {
    flex: 1,
    display: 'flex',
  },
  title: {
    fontSize: 16,
    fontFamily: fonts.openSan.bold,
    color: colors.black,
    width: '100%',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    fontFamily: fonts.openSan.regular,
    width: '100%',
  },
  buttonTitle: {
    fontSize: 16,
    color: colors.white,
    textAlign: 'center',
  },
  button: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 22,
    height: 44,
    width: windowWidth / 5,
    backgroundColor: colors.pink,
    marginBottom: 40,
    marginRight: 10,
  },
  envContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  envTitle: {
    fontSize: 14,
    fontFamily: fonts.openSan.bold,
    color: colors.black,
  },
  envValue: {
    fontSize: 14,
    fontFamily: fonts.openSan.regular,
    color: colors.black,
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
  selectedDateText: {
    marginBottom: 5,
    fontSize: 14,
  },
});

type AddPangkatGajiProps = {
  onClose: () => void;
};

export function AddPangkatGaji({ onClose }: AddPangkatGajiProps) {
  const { getPersistData, setPersistData } = useDataPersist();
  const [formData, setFormData] = useState({
    id: '',
    nik: 0,
    ditetapkan: '',
    nomor_sk: '',
    tgl_sk: '',
    tmt_pangkat: '',
    golongan_ruang: '',
    masa_kerja_tahun: '',
    masa_kerja_bulan: '',
    tmt_gaji_berkala: '',
    masa_kerja_gaji_tahun: '',
    masa_kerja_gaji_bulan: '',
    gaji_pokok: '',
  });

  const [TanggalSkDate, setSelectedTanggalSkDate] = useState<Date | null>(null);
  const [TmtPangkatDate, setSelectedTmtPangkatDate] = useState<Date | null>(null);
  const [TmtGajiBerkalaDate, setSelectedTmtGajiBerkalaDate] = useState<Date | null>(null);

  const [DitetapkanError, setDitetapkanError] = useState('');
  const [NomorSkError, setNomorSkError] = useState('');
  const [TglSkError, setTglSkError] = useState('');
  const [TmtPangkatError, setTmtPangkatError] = useState('');
  const [GolonganRuangError, setGolonganRuangError] = useState('');
  const [MasaKerjaTahunError, setMasaKerjaTahunError] = useState('');
  const [MasaKerjaBulanError, setMasaKerjaBulanError] = useState('');
  const [TmtGajiBerkalaError, setTmtGajiBerkalaError] = useState('');
  const [MasaKerjaGajiTahunError, setMasaKerjaGajiTahunError] = useState('');
  const [MasaKerjaGajiBulanError, setMasaKerjaGajiBulanError] = useState('');
  const [GajiError, setGajiError] = useState('');

  const handleDateTanggalSKChange = (date: Date) => {
    setSelectedTanggalSkDate(date);
  };

  const handleDateTmtPangkatChange = (date: Date) => {
    setSelectedTmtPangkatDate(date);
  };

  const handleDateTmtGajiBerkalaChange = (date: Date) => {
    setSelectedTmtGajiBerkalaDate(date);
  };

  const handleInputChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async () => {
    let valid = true;
    if (!formData.ditetapkan || formData.ditetapkan === '') {
      setDitetapkanError('Ditetapkan Harus Diisi');
      valid = false;
    } else if (!formData.nomor_sk || formData.nomor_sk === '') {
      setNomorSkError('Nomor SK Harus Diisi');
      valid = false;
    } else if (!TanggalSkDate) {
      setTglSkError('Tanggal SK harus diisi');
      valid = false;
    } else if (!TmtPangkatDate) {
      setTmtPangkatError('TMT Pangkat harus diisi');
      valid = false;
    } else if (!formData.golongan_ruang || formData.golongan_ruang === '') {
      setGolonganRuangError('Golongan Ruang harus diisi');
      valid = false;
    } else if (!formData.masa_kerja_tahun || formData.masa_kerja_tahun === '') {
      setMasaKerjaTahunError('Masa Kerja Tahun harus diisi');
      valid = false;
    } else if (!/^\d+$/.test(formData.masa_kerja_tahun)) {
      setMasaKerjaTahunError('Masa Kerja Tahun Harus Angka');
      valid = false;
    } else if (!formData.masa_kerja_bulan || formData.masa_kerja_bulan === '') {
      setMasaKerjaBulanError('Masa Kerja Bulan harus diisi');
      valid = false;
    } else if (!/^\d+$/.test(formData.masa_kerja_bulan)) {
      setMasaKerjaBulanError('Masa Kerja Bulan Harus Angka');
      valid = false;
    } else if (!TmtGajiBerkalaDate) {
      setTmtGajiBerkalaError('TMT Gaji Berkala harus diisi');
      valid = false;
    } else if (!formData.masa_kerja_gaji_tahun || formData.masa_kerja_gaji_tahun === '') {
      setMasaKerjaGajiTahunError('Masa Kerja Gaji Tahun harus diisi');
      valid = false;
    } else if (!/^\d+$/.test(formData.masa_kerja_gaji_tahun)) {
      setMasaKerjaGajiTahunError('Masa Kerja Gaji Tahun Harus Angka');
      valid = false;
    } else if (!formData.masa_kerja_gaji_bulan || formData.masa_kerja_gaji_bulan === '') {
      setMasaKerjaGajiBulanError('Masa Kerja Gaji Bulan harus diisi');
      valid = false;
    } else if (!/^\d+$/.test(formData.masa_kerja_gaji_bulan)) {
      setMasaKerjaGajiBulanError('Masa Kerja Gaji Bulan Harus Angka');
      valid = false;
    } else if (!formData.gaji_pokok || formData.gaji_pokok === '') {
      setGajiError('Gaji Pokok harus diisi');
      valid = false;
    } else if (!/^\d+$/.test(formData.gaji_pokok)) {
      setGajiError('Gaji Pokok Harus Angka');
      valid = false;
    } else {
      if (valid) {
        try {
          const token = await getPersistData<IUser>(DataPersistKeys.TOKEN);
          if (token) {
            const addPangkatGaji = await axios.post(
              `${config.API_URL}/api/pangkat-gaji/create`,
              {
                ditetapkan: formData.ditetapkan,
                nomor_sk: formData.nomor_sk,
                tgl_sk: TanggalSkDate,
                tmt_pangkat: TmtPangkatDate,
                golongan_ruang: formData.golongan_ruang,
                masa_kerja_tahun: formData.masa_kerja_tahun,
                masa_kerja_bulan: formData.masa_kerja_bulan,
                tmt_gaji_berkala: TmtGajiBerkalaDate,
                masa_kerja_gaji_tahun: formData.masa_kerja_gaji_tahun,
                masa_kerja_gaji_bulan: formData.masa_kerja_gaji_bulan,
                gaji_pokok: formData.gaji_pokok,
              },
              {
                headers: {
                  Authorization: `Bearer ${token.access_token}`,
                },
              },
            );
            const resAddPangkatGaji = addPangkatGaji.data;
            if (resAddPangkatGaji.status === 'success') {
              const SimpanToken = await setPersistData(DataPersistKeys.TOKEN, resAddPangkatGaji);
              if (SimpanToken) {
                console.log('data Pangkat Gaji berhasil disimpan');
                Alert.alert('Tambah Data Sukes', `Data Berhasil Disimpan`, [
                  { text: 'OK', onPress: onClose },
                ]);
              }
            }
          }
        } catch (error) {
          console.log('## post Gaji Pangkat', error);
        }
      }
    }
  };

  return (
    <View style={styles.root}>
      <Text style={styles.title}>Tambah Data Gaji Pangkat </Text>
      <View style={styles.form}>
        <FormInput
          label="Ditetapkan"
          defaultValue={formData.ditetapkan}
          onChangeText={text => handleInputChange('ditetapkan', text)}
          error={DitetapkanError}
        />

        <FormInput
          label="Nomor SK"
          defaultValue={formData.nomor_sk}
          onChangeText={text => handleInputChange('nomor_sk', text)}
          error={NomorSkError}
        />

        <Text style={styles.selectedDateText}>Tanggal SK : </Text>
        <DatePicker onDateChange={handleDateTanggalSKChange} error={TglSkError} />

        <Text style={[styles.selectedDateText, { marginVertical: 15 }]}>TMT Pangkat : </Text>
        <DatePicker onDateChange={handleDateTmtPangkatChange} error={TmtPangkatError} />

        <FormInput
          label="Golongan Ruang"
          defaultValue={formData.golongan_ruang}
          onChangeText={text => handleInputChange('golongan_ruang', text)}
          error={GolonganRuangError}
          style={{ marginTop: 15 }}
        />

        <FormInput
          label="Masa Kerja Tahun"
          defaultValue={formData.masa_kerja_tahun}
          onChangeText={text => handleInputChange('masa_kerja_tahun', text)}
          error={MasaKerjaTahunError}
          keyboardType="numeric"
        />

        <FormInput
          label="Masa Kerja Bulan"
          defaultValue={formData.masa_kerja_bulan}
          onChangeText={text => handleInputChange('masa_kerja_bulan', text)}
          error={MasaKerjaBulanError}
          keyboardType="numeric"
        />

        <Text style={[styles.selectedDateText]}>TMT Gaji Berkala : </Text>
        <DatePicker onDateChange={handleDateTmtGajiBerkalaChange} error={TmtGajiBerkalaError} />

        <FormInput
          label="Masa Kerja Gaji Tahun"
          defaultValue={formData.masa_kerja_gaji_tahun}
          onChangeText={text => handleInputChange('masa_kerja_gaji_tahun', text)}
          error={MasaKerjaGajiTahunError}
          style={{ marginTop: 15 }}
          keyboardType="numeric"
        />

        <FormInput
          label="Masa Kerja Gaji Bulan"
          defaultValue={formData.masa_kerja_gaji_bulan}
          onChangeText={text => handleInputChange('masa_kerja_gaji_bulan', text)}
          error={MasaKerjaGajiBulanError}
          keyboardType="numeric"
        />

        <FormInput
          label="Gaji Pokok"
          defaultValue={formData.gaji_pokok}
          onChangeText={text => handleInputChange('gaji_pokok', text)}
          error={GajiError}
          keyboardType="numeric"
        />

        <View style={{ flexDirection: 'row' }}>
          <GradientButton
            title="OK"
            titleStyle={styles.buttonTitle}
            style={styles.button}
            gradientBackgroundProps={{
              colors: [colors.purple, colors.pink],
              start: { x: 0, y: 1 },
              end: { x: 0.8, y: 0 },
            }}
            onPress={handleSubmit}
          />
          <GradientButton
            title="Batal"
            titleStyle={styles.buttonTitle}
            style={styles.button}
            gradientBackgroundProps={{
              colors: [colors.purple, colors.pink],
              start: { x: 0, y: 1 },
              end: { x: 0.8, y: 0 },
            }}
            onPress={onClose}
          />
        </View>
      </View>
    </View>
  );
}
