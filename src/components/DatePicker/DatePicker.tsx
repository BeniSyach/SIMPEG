// DatePicker.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Platform, StyleSheet } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { colors } from '@theme'; // Pastikan impor colors sesuai dengan struktur direktori Anda

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  dateDisplay: {
    borderColor: colors.gray,
    borderWidth: 1,
    borderRadius: 4,
    padding: 10,
  },
  errorBorder: {
    borderColor: colors.red,
  },
  errorText: {
    color: colors.red,
    marginTop: 5,
  },
});

interface DatePickerProps {
  onDateChange: (date: Date) => void;
  error?: string;
  value?: string;
}

const DatePicker: React.FC<DatePickerProps> = ({ onDateChange, error, value }) => {
  const [date, setDate] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleDateChange = (event: any, selectedDate?: Date) => {
    if (selectedDate) {
      setDate(selectedDate);
      onDateChange(selectedDate); // Call the callback function with the selected date
    }
    setShowDatePicker(false);
  };

  const formatDate = (date: Date) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  useEffect(() => {
    if (value) {
      // Parse nilai dari API menjadi objek Date
      const parts = value.split('/');
      const day = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1; // Months are zero-based
      const year = parseInt(parts[2], 10);
      const parsedDate = new Date(year, month, day);
      setDate(parsedDate);
    }
  }, [value]);

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => setShowDatePicker(true)}>
        <View style={[styles.dateDisplay, error ? styles.errorBorder : null]}>
          <Text>{date ? formatDate(date) : 'Pilih Tanggal'}</Text>
        </View>
      </TouchableOpacity>
      {showDatePicker && (
        <DateTimePicker
          value={date || new Date()}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleDateChange}
        />
      )}
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

export default DatePicker;
