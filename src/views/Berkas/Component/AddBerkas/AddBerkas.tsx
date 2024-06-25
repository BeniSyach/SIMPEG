import React, { useState } from 'react';
import { StyleSheet, View, Text, Alert } from 'react-native';
import GradientButton from '@components/GradientButton';
import { colors, fonts } from '@theme';
import { windowWidth } from '@utils/deviceInfo';
import FormInput from '@components/FormInput';
import DatePicker from '@components/DatePicker';
import DocumentPickerComponent from '@components/DokumentPicker/DokumenPicker';
import axios from 'axios';
import config from '@utils/config';
import { IUser } from '@modules/app';
import { DataPersistKeys, useDataPersist } from '@hooks';

const styles = StyleSheet.create({
  root: {
    flex: 1,
    display: 'flex',
  },
  title: {
    fontSize: 16,
    fontFamily: fonts.openSan.bold,
    color: colors.black,
    marginVertical: 5,
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
  selectedDocumentText: {
    marginTop: 20,
    fontSize: 16,
  },
  customDocumentPickerStyle: {
    marginTop: 20,
    borderColor: 'green',
  },
  customTextStyle: {
    color: 'blue',
    fontSize: 14,
  },
  customErrorTextStyle: {
    color: 'orange',
  },
});

type AddBerkasProps = {
  onClose: () => void;
  onSuccess: () => void;
};

export function AddBerkas({ onClose, onSuccess }: AddBerkasProps) {
  const { getPersistData, setPersistData } = useDataPersist();
  const [formData, setFormData] = useState({
    id: '',
    nik: 0,
    jenis_berkas: '',
    nomor_berkas: '',
    tgl_mulai: '',
    tgl_akhir: '',
    file: '',
  });
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedEndDate, setSelectedEndDate] = useState<Date | null>(null);
  const [selectedDocument, setSelectedDocument] = useState<any | null>(null);
  const [errorJenisBerkas, setErrorJenisBerkas] = useState<string>('');
  const [errorNomorBerkas, setErrorNomorBerkas] = useState<string>('');
  const [errorTglMulai, setErrorTglMulai] = useState<string>('');
  const [errorTglAkhir, setErrorTglAkhir] = useState<string>('');
  const [errorFile, setErrorFile] = useState<string>('');

  const handleDateStartChange = (date: Date) => {
    console.log('tgl mulai', formatDate(date));
    setSelectedDate(date);
  };

  const handleDateEndChange = (date: Date) => {
    console.log('tgl akhir', date);
    setSelectedEndDate(date);
  };

  const handleSubmit = async () => {
    let valid = true;
    if (!formData.jenis_berkas || formData.jenis_berkas === '') {
      setErrorJenisBerkas('Jenis Berkas Harus Diisi');
      valid = false;
    } else if (!formData.nomor_berkas || formData.nomor_berkas === '') {
      setErrorNomorBerkas('Nomor Berkas Harus Diisi');
      valid = false;
    } else if (!selectedDate) {
      setErrorTglMulai('Tanggal Mulai harus diisi');
      valid = false;
    } else if (!selectedEndDate) {
      setErrorTglAkhir('Tanggal Akhir harus diisi');
      valid = false;
    } else if (!selectedDocument) {
      setErrorFile('Dokumen harus diisi');
      valid = false;
    } else {
      if (valid) {
        const formDataPost = new FormData();
        try {
          const token = await getPersistData<IUser>(DataPersistKeys.TOKEN);
          if (token) {
            formDataPost.append('jenis_berkas', formData.jenis_berkas);
            formDataPost.append('nomor_berkas', formData.nomor_berkas);
            formDataPost.append('tgl_mulai', formatDate(selectedDate));
            formDataPost.append('tgl_akhir', formatDate(selectedEndDate));
            if (selectedDocument) {
              console.log('data foto', selectedDocument);

              formDataPost.append('file', {
                uri: selectedDocument.uri,
                name: selectedDocument.name,
                type: selectedDocument.mimeType,
              } as any);
            }
            console.log('data formdata', formDataPost);
            const addBerkas = await axios.post(
              `${config.API_URL}/api/berkas/create`,
              formDataPost,
              {
                headers: {
                  'Content-Type': 'multipart/form-data',
                  Authorization: `Bearer ${token.access_token}`,
                },
              },
            );
            const resAddBerkas = addBerkas.data;
            if (resAddBerkas.status === 'success') {
              const SimpanToken = await setPersistData(DataPersistKeys.TOKEN, resAddBerkas);
              if (SimpanToken) {
                console.log('data lokasi berhasil disimpan');
                Alert.alert('Simpan Data Sukes', `Data Berhasil Disimpan`, [
                  { text: 'OK', onPress: onSuccess },
                ]);
              }
            } else {
              Alert.alert('Gagal !!!', `Data Gagal Tersimpan`, [{ text: 'OK', onPress: onClose }]);
            }
          }
          // Lakukan sesuatu dengan tanggal yang dipilih
          console.log('Tanggal yang dipilih:', selectedDate);
          console.log('Dokumen yang dipilih:', selectedDocument);
        } catch (error) {
          console.log('## post Berkas', error);
        }
      }
    }
  };

  const formatDate = (date: Date) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const handleInputChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleDocumentPicked = (document: any) => {
    console.log('dokumen', document);
    setSelectedDocument(document.assets[0]);
    setErrorFile(''); // Clear error when a document is selected
  };

  return (
    <View style={styles.root}>
      <Text style={styles.title}>Tambah Data Berkas </Text>
      <View style={styles.form}>
        <FormInput
          label="Jenis Berkas"
          defaultValue={formData.jenis_berkas}
          onChangeText={text => handleInputChange('jenis_berkas', text)}
          error={errorJenisBerkas}
        />

        <FormInput
          label="Nomor Berkas"
          defaultValue={formData.nomor_berkas}
          onChangeText={text => handleInputChange('nomor_berkas', text)}
          error={errorNomorBerkas}
        />

        <Text style={styles.selectedDateText}>Tanggal Mulai : </Text>
        <DatePicker onDateChange={handleDateStartChange} error={errorTglMulai} />

        <Text style={[styles.selectedDateText, { marginVertical: 15 }]}>Tanggal Akhir : </Text>
        <DatePicker onDateChange={handleDateEndChange} error={errorTglAkhir} />

        <DocumentPickerComponent
          onDocumentPicked={handleDocumentPicked}
          error={errorFile}
          style={styles.customDocumentPickerStyle}
          textStyle={styles.customTextStyle}
          errorTextStyle={styles.customErrorTextStyle}
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
