import Button from '@components/Button';
import FormInput from '@components/FormInput';
import { StackProps } from '@navigator';
import { colors } from '@theme';
import { SafeAreaView, StatusBar, StyleSheet, Text, View } from 'react-native';

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

export default function DetailAbsensi({ navigation, route }: StackProps) {
  const { bulan, tahun } = route.params as { bulan: string; tahun: string };
  if (!bulan) {
    return <Text style={styles.title}>Error: Missing 'bulan' parameter</Text>;
  }

  if (!tahun) {
    return <Text style={styles.title}>Error: Missing 'tahun' parameter</Text>;
  }

  return (
    <SafeAreaView style={styles.root}>
      <StatusBar barStyle="light-content" />
      <View style={{ alignItems: 'center', marginTop: 20 }}>
        <Text style={styles.title}>Detail Absensi</Text>
      </View>
      <View style={styles.form}>
        <FormInput label="Kehadiran" value={tahun} readOnly />
        <FormInput label="Absen" value={bulan} readOnly />
        <FormInput label="Izin / SPT" readOnly />
        <FormInput label="Telat" readOnly />
        <View style={styles.buttonContainer}>
          <Button
            style={styles.button}
            titleStyle={styles.buttonTitle}
            loaderColor={colors.white}
            title="Kembali"
            onPress={() => navigation.goBack()}
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
    </SafeAreaView>
  );
}
