import {
  ActivityIndicator,
  FlatList,
  ListRenderItem,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { StackProps } from '@navigator/stack';
import RNPickerSelect from 'react-native-picker-select';
import { useState } from 'react';
import Button from '@components/Button';
import { colors } from '@theme';
import { DataPersistKeys, useDataPersist } from '@hooks';
import { IUser } from '@modules/app';
import CardAbsensi from '@components/CardAbsensi';
import { useAbsensiService } from '@modules/Absensi/absensi.service';

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
  id: string;
  bulan: string;
  persen: string;
};

export default function Absensi({ navigation, route }: StackProps) {
  const { getPersistData, setPersistData } = useDataPersist();
  const { getAbsensi } = useAbsensiService();
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

    try {
      const token = await getPersistData<IUser>(DataPersistKeys.TOKEN);
      if (token) {
        console.log('User Token found:', token);
        const berkas = await getAbsensi(token.access_token);
        if (berkas) {
          const SimpanToken = await setPersistData(DataPersistKeys.TOKEN, berkas);
          if (SimpanToken) {
            console.log('data Berkas berhasil disimpan');
            const newData = berkas.data.map((item: any) => ({
              id: item.id,
              bulan: item.bulan,
              persen: item.persen,
            }));
            setData(newData);
          }
        } else {
          const newData: Item[] = Array.from({ length: 1 }, (_, i) => ({
            id: 'tidak ada',
            bulan: 'tidak ada',
            persen: 'tidak ada',
          }));
          setData(prevData => [...prevData, ...newData]);
        }
      } else {
        console.log('Token not found.');
      }
    } catch (err) {
      console.log('[##] preload error Berkas:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const renderItem: ListRenderItem<Item> = ({ item }) => (
    <CardAbsensi id={item.id} title={item.bulan} description={item.persen} />
  );

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
                  console.log(`Selected value: ${selectedValue}`);
                }}
              />
            </View>
          </View>
          {/* Cards dengan infinite scroll */}
          <FlatList
            data={data}
            renderItem={renderItem}
            keyExtractor={item => item.id}
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
      </ScrollView>
    </SafeAreaView>
  );
}
