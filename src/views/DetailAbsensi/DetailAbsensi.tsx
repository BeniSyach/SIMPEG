import Button from '@components/Button';
import CardAbsensi from '@components/CardAbsensi';
import { useDetailAbsensiService } from '@modules/Absensi/DetailAbsensi';
import { useAppSlice } from '@modules/app';
import { StackProps } from '@navigator';
import { colors } from '@theme';
import { useEffect, useState } from 'react';
import { Alert, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';

const styles = StyleSheet.create({
  root: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f0f0f0',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
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
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
    marginTop: 20,
    textAlign: 'center',
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
    marginVertical: 10,
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
  const { user } = useAppSlice();
  const { getDetailAbsensi } = useDetailAbsensiService();
  const [loading, setLoading] = useState(false);
  const [Kehadiran, setKehadiran] = useState(0);
  const [Telat, setTelat] = useState(0);
  const [TepatWaktu, setTepatWaktu] = useState(0);
  const [PulangCepat, setPulangCepat] = useState(0);
  const [TepatWaktuAbsenPulang, setTepatWaktuAbsenPulang] = useState(0);
  const [izin, setIzin] = useState(0);

  const { bulan, tahun } = route.params as { bulan: string; tahun: string };

  useEffect(() => {
    fetchData();
  }, []);

  if (!bulan) {
    return <Text style={styles.title}>Error: Bulan Tidak Ditemukan </Text>;
  }

  if (!tahun) {
    return <Text style={styles.title}>Error: Tahun Tidak Ditemukan </Text>;
  }

  const fetchData = async () => {
    if (loading) return;
    setLoading(true);
    const nikUser = user?.data.nik;
    if (nikUser !== undefined) {
      try {
        const getAbsen = await getDetailAbsensi(nikUser, bulan, tahun);
        if (getAbsen) {
          setKehadiran(getAbsen.kehadiran);
          setTelat(getAbsen.telat);
          setTepatWaktu(getAbsen.tepatWaktu);
          setPulangCepat(getAbsen.pulangCepat);
          setTepatWaktuAbsenPulang(getAbsen.TepatWaktuAbsenPulang);
          setIzin(getAbsen.izin);
        } else {
          Alert.alert('Gagal Mengambil Data', `Silahkan Login Kembali`, [
            { text: 'OK', onPress: () => navigation.goBack() },
          ]);
        }
      } catch (err) {
        console.log('[##] preload error DetailAbsensi:', err);
        Alert.alert('Gagal Mengambil Data', `Silahkan Login Kembali`, [
          { text: 'OK', onPress: () => navigation.goBack() },
        ]);
      } finally {
        setLoading(false);
      }
    } else {
      Alert.alert('Gagal Mengambil Data', `Silahkan Login Kembali`, [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    }
  };

  const handlePress = () => {
    // Mengosongkan nilai state
  };

  return (
    <SafeAreaView style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor={colors.black} />
      <ScrollView>
        <View style={{ alignItems: 'center', marginTop: 10 }}>
          <Text style={styles.title}>Detail Absensi</Text>
          <Text style={styles.title}> {user?.data.nama}</Text>
        </View>
        <CardAbsensi title="Kehadiran" description={Kehadiran.toString()} onPress={handlePress} />

        <Text style={styles.menuTitle}>Absen Masuk</Text>
        <CardAbsensi
          title="Tepat Waktu"
          description={TepatWaktu.toString()}
          onPress={handlePress}
        />
        <CardAbsensi title="Telat" description={Telat.toString()} onPress={handlePress} />

        <Text style={styles.menuTitle}>Absen Pulang</Text>
        <CardAbsensi
          title="Tepat Waktu"
          description={TepatWaktuAbsenPulang.toString()}
          onPress={handlePress}
        />
        <CardAbsensi
          title="Cepat Pulang"
          description={PulangCepat.toString()}
          onPress={handlePress}
        />
        <Text style={styles.menuTitle}>Izin</Text>
        <CardAbsensi title="SPT" description={izin.toString()} onPress={handlePress} />

        {/* <View style={styles.form}> */}
        <View style={styles.buttonContainer}>
          <Button
            style={styles.button}
            titleStyle={styles.buttonTitle}
            loaderColor={colors.white}
            title="Kembali"
            onPress={() => navigation.goBack()}
          />
        </View>
        {/* </View> */}
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
