import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { StackProps } from '@navigator/stack';
import RNPickerSelect from 'react-native-picker-select';
import { useState } from 'react';
import Button from '@components/Button';

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scrollView: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    padding: 16,
  },
  filterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  titleCombo: {
    marginVertical: 10,
    fontSize: 14,
    fontWeight: 'bold',
  },
  pickerContainer: {
    flex: 1,
    marginRight: 8,
  },
  filterButton: {
    flexBasis: 100,
  },
  buttonCombo: {
    backgroundColor: '#fff',
    height: 50,
    width: 100,
    borderRadius: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  card: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 4,
  },
  cardContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  invisibleCard: {
    backgroundColor: 'transparent',
    elevation: 0,
  },
  cardText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  cardSubText: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
    color: 'black',
    paddingRight: 30, // to ensure the text is never behind the icon
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 0.5,
    borderColor: 'purple',
    borderRadius: 8,
    color: 'black',
    paddingRight: 30, // to ensure the text is never behind the icon
  },
});

export default function Absensi({ navigation, route }: StackProps) {
  const [selectedValue, setSelectedValue] = useState('');

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <View style={styles.container}>
          {/* Combo box and Filter button */}
          <Text style={styles.titleCombo}>Pilih Tahun :</Text>
          <View style={styles.filterContainer}>
            <View style={styles.pickerContainer}>
              <RNPickerSelect
                onValueChange={value => setSelectedValue(value)}
                items={[
                  { label: '2024', value: '2024' },
                  { label: '2023', value: '2023' },
                  { label: '2022', value: '2022' },
                ]}
                style={pickerSelectStyles}
              />
            </View>
            <View style={styles.filterButton}>
              <Button
                title="Filter"
                style={styles.buttonCombo}
                onPress={() => {
                  // Implement filter logic here
                  console.log(`Selected value: ${selectedValue}`);
                }}
              />
            </View>
          </View>
          {/* Cards */}
          <View style={styles.row}>
            <TouchableOpacity
              style={styles.card}
              onPress={() => navigation.navigate('DetailAbsensiStack', { from: selectedValue })}>
              <View style={styles.cardContent}>
                <Text style={styles.cardText}>Bulan</Text>
                <Text style={styles.cardSubText}>Persen</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.card}
              onPress={() => navigation.navigate('DetailAbsensiStack', { from: selectedValue })}>
              <View style={styles.cardContent}>
                <Text style={styles.cardText}>bulan</Text>
                <Text style={styles.cardSubText}>Persen</Text>
              </View>
            </TouchableOpacity>
          </View>
          <View style={styles.row}>
            <TouchableOpacity style={styles.card}>
              <View style={styles.cardContent}>
                <Text style={styles.cardText}>Bulan</Text>
                <Text style={styles.cardSubText}>Persen</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.card}>
              <View style={styles.cardContent}>
                <Text style={styles.cardText}>bulan</Text>
                <Text style={styles.cardSubText}>Persen</Text>
              </View>
            </TouchableOpacity>
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
