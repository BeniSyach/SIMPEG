import {
  ActivityIndicator,
  Alert,
  FlatList,
  ListRenderItem,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { StackProps } from '@navigator/stack';
import RNPickerSelect from 'react-native-picker-select';
import { useState } from 'react';
import Button from '@components/Button';
import { colors } from '@theme';
import { useDataPersist } from '@hooks';
import { useAppSlice } from '@modules/app';
import CardAbsensi from '@components/CardAbsensi';
import { useAbsensiService } from '@modules/Absensi/absensi.service';

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
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
    backgroundColor: colors.black,
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
  loadingIndicator: {
    paddingVertical: 20,
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

type Item = {
  bulan: number;
  persen: string;
};

export default function Absensi({ navigation, route }: StackProps) {
  const { removeAllPersistData } = useDataPersist();
  const { dispatch, reset } = useAppSlice();
  const { getAbsensi } = useAbsensiService();
  const { user } = useAppSlice();
  const currentYear = new Date().getFullYear();
  const [selectedValue, setSelectedValue] = useState<string>(`${currentYear}`);
  const [data, setData] = useState<Item[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);

  const generateYearOptions = (startYear: number, range: number) => {
    const years = [];
    for (let i = startYear - range; i <= startYear + range; i++) {
      years.push({ label: `${i}`, value: `${i}` });
    }
    return years;
  };

  function getMonthName(month: number): string {
    const monthNames = [
      'Januari',
      'Februari',
      'Maret',
      'April',
      'Mei',
      'Juni',
      'Juli',
      'Agustus',
      'September',
      'Oktober',
      'November',
      'Desember',
    ];
    return monthNames[month - 1] || '';
  }

  const yearOptions = generateYearOptions(currentYear, 5);

  const renderFooter = () => {
    if (!loading) return null;
    return <ActivityIndicator style={styles.loadingIndicator} />;
  };

  const handleRefresh = () => {
    setRefreshing(true);
    setPage(1);
    // setData([]);
    fetchData();
  };

  const fetchData = async () => {
    if (loading) return;
    setLoading(true);
    const nikUser = user?.data.nik;
    if (nikUser !== undefined) {
      try {
        const getAbsen = await getAbsensi(nikUser, selectedValue);
        if (getAbsen) {
          console.log('data Absen Berhasil di ambil', getAbsen);
          const newData = getAbsen.allAbsenMasuk.map((item: any) => ({
            bulan: item.bulan_masuk,
            persen: item.jumlah_absen,
          }));
          setData(newData);
        } else {
          const newData: Item[] = Array.from({ length: 1 }, (_, i) => ({
            bulan: 0,
            persen: 'tidak ada',
          }));
          setData(prevData => [...prevData, ...newData]);
        }
      } catch (err) {
        console.log('[##] preload error Absensi:', err);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    } else {
      Alert.alert('Gagal Mengambil Data', `Silahkan Login Kembali`, [
        { text: 'OK', onPress: handleLogout },
      ]);
    }
  };

  const handleLogout = async () => {
    try {
      // Hapus data pengguna dari penyimpanan persisten
      const hapusDataLogin = await removeAllPersistData();
      if (hapusDataLogin) {
        console.log('Berhasil menghapus data pengguna.');
        // Reset status login dan hapus data pengguna dari store Redux
        dispatch(reset());
        Alert.alert('Logout Berhasil', `Berhasil Keluar akun`);
      } else {
        console.error('Gagal megnhapus data pengguna.');
      }
    } catch (error) {
      console.log('Logout error:', error);
    }
  };

  const renderItem: ListRenderItem<Item> = ({ item }) => (
    <CardAbsensi
      title={getMonthName(item.bulan)}
      description={item.persen}
      onPress={() =>
        navigation.navigate('DetailAbsensiStack', {
          bulan: item.bulan.toString(),
          tahun: selectedValue,
        })
      }
    />
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Combo box and Filter button */}
        <Text style={styles.titleCombo}>Pilih Tahun :</Text>
        <View style={styles.filterContainer}>
          <View style={styles.pickerContainer}>
            <RNPickerSelect
              onValueChange={value => setSelectedValue(value)}
              items={yearOptions}
              style={pickerSelectStyles}
              value={selectedValue}
            />
          </View>
          <View style={styles.filterButton}>
            <Button
              title="Filter"
              style={styles.buttonCombo}
              onPress={() => {
                // Implement filter logic here
                handleRefresh();
                console.log(`Selected value: ${selectedValue}`);
              }}
            />
          </View>
        </View>
        {/* Cards dengan infinite scroll */}
        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={item => item.persen}
          // onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={renderFooter}
          refreshing={refreshing}
          onRefresh={handleRefresh}
        />
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
