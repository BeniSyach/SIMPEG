import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import GradientButton from '@components/GradientButton';
import { colors, fonts } from '@theme';
import { windowWidth } from '@utils/deviceInfo';
import config from '@utils/config';
import FormInput from '@components/FormInput';

const styles = StyleSheet.create({
  root: {
    flex: 1,
    display: 'flex',
  },
  title: {
    fontSize: 16,
    fontFamily: fonts.openSan.bold,
    color: colors.black,
    marginTop: 16,
    marginBottom: 10,
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
    // backgroundColor: '#fff',
    padding: 16,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 3,
  },
});

type UpdatePangkatGajiProps = {
  onClose: () => void;
  DataPangkatGaji: {
    id: string;
    nik: number;
    ditetapkan: string;
    nomor_sk: string;
    tgl_sk: string;
    tmt_pangkat: string;
    golongan_ruang: string;
    masa_kerja_tahun: string;
    masa_kerja_bulan: string;
    tmt_gaji_berkala: string;
    masa_kerja_gaji_tahun: string;
    masa_kerja_gaji_bulan: string;
    gaji_pokok: string;
  };
};

export function UpdatePangkatGaji({ onClose, DataPangkatGaji }: UpdatePangkatGajiProps) {
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
  const [unitKerjaError, DitetapkanError] = useState('');

  useEffect(() => {
    setFormData(DataPangkatGaji); // Initialize form data with DataPangkatGaji
  }, [DataPangkatGaji]);

  const handleInputChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  return (
    <View style={styles.root}>
      <Text style={styles.title}>Update Data Pangkat Gaji</Text>
      <View style={styles.form}>
        <FormInput
          label="Ditetapkan"
          defaultValue={formData.ditetapkan}
          onChangeText={text => handleInputChange('ditetapkan', text)}
          error={unitKerjaError}
        />
        <FormInput
          label="Nomor SK"
          defaultValue={formData.nomor_sk}
          onChangeText={text => handleInputChange('nomor_sk', text)}
          error={unitKerjaError}
        />
        <FormInput
          label="Tanggal SK"
          defaultValue={formData.tgl_sk}
          onChangeText={text => handleInputChange('tgl_sk', text)}
          error={unitKerjaError}
        />
        <FormInput
          label="TMT Pangkat"
          defaultValue={formData.tmt_pangkat}
          onChangeText={text => handleInputChange('tmt_pangkat', text)}
          error={unitKerjaError}
        />
        <FormInput
          label="Golongan Ruang"
          defaultValue={formData.golongan_ruang}
          onChangeText={text => handleInputChange('golongan_ruang', text)}
          error={unitKerjaError}
        />
        <FormInput
          label="Masa Kerja Tahun"
          defaultValue={formData.masa_kerja_tahun}
          onChangeText={text => handleInputChange('masa_kerja_tahun', text)}
          error={unitKerjaError}
        />
        <FormInput
          label="Masa Kerja Bulan"
          defaultValue={formData.masa_kerja_bulan}
          onChangeText={text => handleInputChange('masa_kerja_bulan', text)}
          error={unitKerjaError}
        />
        <FormInput
          label="TMT Gaji Berkala"
          defaultValue={formData.tmt_gaji_berkala}
          onChangeText={text => handleInputChange('tmt_gaji_berkala', text)}
          error={unitKerjaError}
        />
        <FormInput
          label="Masa Kerja Gaji Tahun"
          defaultValue={formData.masa_kerja_gaji_tahun}
          onChangeText={text => handleInputChange('masa_kerja_gaji_tahun', text)}
          error={unitKerjaError}
        />
        <FormInput
          label="Masa Kerja Gaji Bulan"
          defaultValue={formData.masa_kerja_gaji_bulan}
          onChangeText={text => handleInputChange('masa_kerja_gaji_bulan', text)}
          error={unitKerjaError}
        />
        <FormInput
          label="Gaji Pokok"
          defaultValue={formData.gaji_pokok}
          onChangeText={text => handleInputChange('gaji_pokok', text)}
          error={unitKerjaError}
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
            onPress={onClose}
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
