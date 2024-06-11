import React, { useState } from 'react';
import { StyleSheet, View, Text, Alert } from 'react-native';
import GradientButton from '@components/GradientButton';
import { colors, fonts } from '@theme';
import { windowWidth } from '@utils/deviceInfo';
import FormInput from '@components/FormInput';
import DatePicker from '@components/DatePicker';
import DocumentPickerComponent from '@components/DokumentPicker/DokumenPicker';

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
    // backgroundColor: '#fff',
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
    fontSize: 18,
  },
  customErrorTextStyle: {
    color: 'orange',
  },
});

type AddBerkasProps = {
  onClose: () => void;
};

export function AddBerkas({ onClose }: AddBerkasProps) {
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
  const [error, setError] = useState<string>('');

  const handleDateStartChange = (date: Date) => {
    setSelectedDate(date);
    setError(''); // Clear error when a date is selected
  };

  const handleDateEndChange = (date: Date) => {
    setSelectedEndDate(date);
    setError(''); // Clear error when a date is selected
  };

  const handleSubmit = () => {
    let valid = true;
    if (!selectedDate) {
      setError('Tanggal harus diisi');
      valid = false;
    } else if (!selectedEndDate) {
      setError('Tanggal harus diisi');
      valid = false;
    } else if (!selectedDocument) {
      setError('Dokumen harus diisi');
      valid = false;
    } else {
      // Lakukan sesuatu dengan tanggal yang dipilih
      console.log('Tanggal yang dipilih:', selectedDate);
      console.log('Dokumen yang dipilih:', selectedDocument);
      Alert.alert('Dokumen Terpilih', `Nama Dokumen: ${selectedDocument.name}`);
    }
  };

  const formatDate = (date: Date) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const [unitKerjaError, DitetapkanError] = useState('');

  const handleInputChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleDocumentPicked = (document: any) => {
    setSelectedDocument(document);
    setError(''); // Clear error when a document is selected
  };

  return (
    <View style={styles.root}>
      <Text style={styles.title}>Tambah Data Gaji Pangkat </Text>
      <View style={styles.form}>
        <FormInput
          label="Jenis Berkas"
          defaultValue={formData.jenis_berkas}
          onChangeText={text => handleInputChange('jenis_berkas', text)}
          error={unitKerjaError}
        />

        <FormInput
          label="Nomor Berkas"
          defaultValue={formData.nomor_berkas}
          onChangeText={text => handleInputChange('nomor_berkas', text)}
          error={unitKerjaError}
        />

        <Text style={styles.selectedDateText}>Tanggal Mulai : </Text>
        <DatePicker onDateChange={handleDateStartChange} error={error} />

        <Text style={[styles.selectedDateText, { marginVertical: 15 }]}>Tanggal Akhir : </Text>
        <DatePicker onDateChange={handleDateEndChange} error={error} />

        <DocumentPickerComponent
          onDocumentPicked={handleDocumentPicked}
          error={error}
          style={styles.customDocumentPickerStyle}
          textStyle={styles.customTextStyle}
          errorTextStyle={styles.customErrorTextStyle}
        />
        {selectedDocument && (
          <Text style={styles.selectedDocumentText}>
            Selected Document: {selectedDocument.name}
          </Text>
        )}
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
