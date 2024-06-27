import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, Alert } from 'react-native';
import GradientButton from '@components/GradientButton';
import { colors, fonts } from '@theme';
import { windowWidth } from '@utils/deviceInfo';
import FormInput from '@components/FormInput';
import DatePicker from '@components/DatePicker';
import DocumentPickerComponent from '@components/DokumentPicker/DokumenPicker';
import { DataPersistKeys, useDataPersist } from '@hooks';
import { IUser } from '@modules/app';
import axios from 'axios';
import config from '@utils/config';

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
  selectedDocumentText: {
    marginTop: 20,
    fontSize: 16,
  },
});

type UpdateBerkasProps = {
  onClose: () => void;
  onSuccess: () => void;
  dataBerkas: {
    id: string;
    nik: number;
    jenis_berkas: string;
    nomor_berkas: string;
    tgl_mulai: string;
    tgl_akhir: string;
    file: string;
  };
};

export function UpdateBerkas({ onClose, onSuccess, dataBerkas }: UpdateBerkasProps) {
  const MAX_FILE_SIZE = 1048576;
  const { getPersistData, setPersistData } = useDataPersist();
  const [selectedStartDate, setSelectedStartDate] = useState<Date | null>(null);
  const [selectedEndDate, setSelectedEndDate] = useState<Date | null>(null);
  const [selectedDocument, setSelectedDocument] = useState<any | null>(null);
  const [formData, setFormData] = useState({
    id: '',
    nik: 0,
    jenis_berkas: '',
    nomor_berkas: '',
    tgl_mulai: '',
    tgl_akhir: '',
    file: '',
  });
  const [JenisBerkasError, setJenisBerkasError] = useState('');
  const [NomorBerkasError, setNomorBerkasError] = useState('');
  const [selectedStartDateError, setselectedStartDateError] = useState('');
  const [selectedEndDateError, setselectedEndDateError] = useState('');
  const [FileError, setFileError] = useState('Ukuran Berkas Harus Dibawah 1 mb');

  useEffect(() => {
    setFormData(dataBerkas);
  }, [dataBerkas]);

  const handleInputChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleStartDateChange = (date: Date) => {
    setSelectedStartDate(date);
  };

  const handleEndDateChange = (date: Date) => {
    setSelectedEndDate(date);
  };

  const handleDocumentPicked = (document: any) => {
    if (document.assets[0].size > MAX_FILE_SIZE) {
      Alert.alert('Gagal mengambil File', `Berkas Harus Dibawah 1 mb`, [{ text: 'OK' }]);
    } else {
      setSelectedDocument(document.assets[0]);
    }
  };

  const formatDate = (date: Date) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const handleSubmit = async () => {
    let valid = true;
    if (!formData.jenis_berkas || formData.jenis_berkas === '') {
      setJenisBerkasError('Jenis Berkas Harus Diisi');
      valid = false;
    } else if (!formData.nomor_berkas || formData.nomor_berkas === '') {
      setNomorBerkasError('Nomor Berkas Harus Diisi');
      valid = false;
    } else if (!selectedStartDate) {
      setselectedStartDateError('Tanggal Mulai Harus Dipilih');
      valid = false;
    } else if (!selectedEndDate) {
      setselectedEndDateError('Tanggal Akhir Harus Dipilih');
      valid = false;
    } else if (!formData.file) {
      setFileError('File Harus Dipilih');
      valid = false;
    } else if (selectedDocument.size > MAX_FILE_SIZE) {
      setFileError('Ukuran Berkas Harus Dibawah 1 mb');
      valid = false;
    } else {
      if (valid) {
        const formDataUpdate = new FormData();
        try {
          const token = await getPersistData<IUser>(DataPersistKeys.TOKEN);
          if (token) {
            formDataUpdate.append('jenis_berkas', formData.jenis_berkas);
            formDataUpdate.append('nomor_berkas', formData.nomor_berkas);
            formDataUpdate.append('tgl_mulai', formatDate(selectedStartDate));
            formDataUpdate.append('tgl_akhir', formatDate(selectedEndDate));
            if (selectedDocument) {
              console.log('data foto', selectedDocument);

              formDataUpdate.append('file', {
                uri: selectedDocument.uri,
                name: selectedDocument.name,
                type: selectedDocument.mimeType,
              } as any);
            }
            console.log('data update', formDataUpdate);
            const updateBerkas = await axios.post(
              `${config.API_URL}/api/berkas/update/${formData.id}`,
              formDataUpdate,
              {
                headers: {
                  'Content-Type': 'multipart/form-data',
                  Authorization: `Bearer ${token.access_token}`,
                },
              },
            );
            const success = updateBerkas.data;
            if (success.status === 'success') {
              const SimpanToken = await setPersistData(DataPersistKeys.TOKEN, success);
              if (SimpanToken) {
                console.log('data lokasi berhasil disimpan');
                Alert.alert('Update Data Sukes', `Data Berhasil Diubah`, [
                  { text: 'OK', onPress: onSuccess },
                ]);
              }
            } else {
              Alert.alert('Gagal !!!', `Data Gagal Tersimpan`, [{ text: 'OK', onPress: onClose }]);
            }
          }
        } catch (err) {
          console.log('Update Berkas error:', err);
          Alert.alert('Gagal', `Data Gagal Tersimpan`, [{ text: 'OK', onPress: onClose }]);
        }
      }
    }
  };

  return (
    <View style={styles.root}>
      <Text style={styles.title}>Update Data Berkas</Text>
      <View style={styles.form}>
        <FormInput
          label="Jenis Berkas"
          defaultValue={formData.jenis_berkas}
          onChangeText={text => handleInputChange('jenis_berkas', text)}
          error={JenisBerkasError}
        />
        <FormInput
          label="Nomor Berkas"
          defaultValue={formData.nomor_berkas}
          onChangeText={text => handleInputChange('nomor_berkas', text)}
          error={NomorBerkasError}
        />

        <Text style={styles.selectedDateText}>Tanggal Mulai : </Text>
        <DatePicker
          onDateChange={handleStartDateChange}
          error={selectedStartDateError}
          value={formData.tgl_mulai ? formData.tgl_mulai.toString().split('T')[0] : undefined}
        />

        <Text style={[styles.selectedDateText, { marginVertical: 15 }]}>Tanggal Akhir : </Text>
        <DatePicker
          onDateChange={handleEndDateChange}
          error={selectedEndDateError}
          value={formData.tgl_akhir ? formData.tgl_akhir.toString().split('T')[0] : undefined}
        />

        <DocumentPickerComponent
          onDocumentPicked={handleDocumentPicked}
          error={FileError}
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
