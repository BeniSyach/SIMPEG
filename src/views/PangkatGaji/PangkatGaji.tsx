import React, { useState, useEffect } from 'react';
import { View, FlatList, ActivityIndicator, StyleSheet, ListRenderItem, Alert } from 'react-native';
import { StackProps } from '@navigator/stack';
import { DataPersistKeys, useDataPersist } from '@hooks';
import Card from '@components/Card';
import { usePangkatGajiService, usePangkatGajiSlice } from '@modules/PangkatGaji';
import { IUser } from '@modules/app';
import BottomSheet from '@components/BottomSheet';
import { AddPangkatGaji } from './Component/AddPangkatGaji';
import { UpdatePangkatGaji } from './Component/UpdatePangkatGaji';
import Button from '@components/Button';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingIndicator: {
    paddingVertical: 20,
  },
  button: {
    marginVertical: 10,
    width: 150,
  },
  PosisiButtonTambah: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

type Item = {
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

export default function PangkatGaji({ navigation, route }: StackProps) {
  const { getPersistData, setPersistData } = useDataPersist();
  const { getPangkatGaji } = usePangkatGajiService();
  const [data, setData] = useState<Item[]>([]);
  const [dataUpdate, setDataUpdate] = useState({
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
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [TokenLama, setTokenLama] = useState('');
  const [isOpenAdd, setOpenAdd] = useState(false);
  const [isOpenUpdate, setOpenUpdate] = useState(false);

  useEffect(() => {
    fetchData();
  }, [page]);

  const fetchData = async () => {
    if (loading) return;
    setLoading(true);

    try {
      const token = await getPersistData<IUser>(DataPersistKeys.TOKEN);
      if (token) {
        setTokenLama(token.access_token);
        console.log('User Token found:', token);
        const PangkatGaji = await getPangkatGaji(token.access_token);
        if (PangkatGaji) {
          const SimpanToken = await setPersistData(DataPersistKeys.TOKEN, PangkatGaji);
          if (SimpanToken) {
            console.log('data Pangkat Gaji berhasil disimpan');
            const newData = PangkatGaji.data.map((item: any) => ({
              id: item.id,
              nik: item.nik,
              ditetapkan: item.ditetapkan,
              nomor_sk: item.nomor_sk,
              tgl_sk: item.tgl_sk,
              tmt_pangkat: item.tmt_pangkat,
              golongan_ruang: item.golongan_ruang,
              masa_kerja_tahun: item.masa_kerja_tahun,
              masa_kerja_bulan: item.masa_kerja_bulan,
              tmt_gaji_berkala: item.tmt_gaji_berkala,
              masa_kerja_gaji_tahun: item.masa_kerja_gaji_tahun,
              masa_kerja_gaji_bulan: item.masa_kerja_gaji_bulan,
              gaji_pokok: item.gaji_pokok,
            }));
            setData(newData);
          }
        } else {
          const newData: Item[] = Array.from({ length: 1 }, (_, i) => ({
            id: 'tidak ada',
            nik: 0,
            ditetapkan: 'tidak ada',
            nomor_sk: 'tidak ada',
            tgl_sk: 'tidak ada',
            tmt_pangkat: 'tidak ada',
            golongan_ruang: 'tidak ada',
            masa_kerja_tahun: 'tidak ada',
            masa_kerja_bulan: 'tidak ada',
            tmt_gaji_berkala: 'tidak ada',
            masa_kerja_gaji_tahun: '0',
            masa_kerja_gaji_bulan: '0',
            gaji_pokok: '0',
          }));
          setData(prevData => [...prevData, ...newData]);
        }
      } else {
        console.log('Token not found.');
      }
    } catch (err) {
      console.log('[##] preload error Pangkat Gaji:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleLoadMore = () => {
    setPage(prevPage => prevPage + 1);
  };

  const handleRefresh = () => {
    setRefreshing(true);
    setPage(1);
    // setData([]);
    fetchData();
  };

  const handleAddItem = () => {
    setOpenAdd(true);
  };

  const handleDeleteItem = (id: string) => {
    Alert.alert(
      'Konfirmasi',
      'Apakah Anda Yakin Menghapus Data',
      [
        {
          text: 'Batal',
          onPress: () => console.log('Delete Data Cancel'),
          style: 'cancel',
        },
        { text: 'OK', onPress: () => HandleDeleteData(id) },
      ],
      { cancelable: false },
    );
  };

  const HandleDeleteData = async (id: string) => {
    try {
      setData(data.filter(item => item.id !== id));
      Alert.alert('Sukses', `Berhasil Menghapus Data`);
    } catch (error) {
      console.log('Delete Data error:', error);
    }
  };

  const handleEditItem = (id: string) => {
    const itemIndex = data.find(item => item.id === id);
    if (itemIndex) {
      setDataUpdate(itemIndex);
      setOpenUpdate(true);
    }
  };

  const renderFooter = () => {
    if (!loading) return null;
    return <ActivityIndicator style={styles.loadingIndicator} />;
  };

  const renderItem: ListRenderItem<Item> = ({ item }) => (
    <Card
      id={item.id}
      title={item.nomor_sk}
      description={item.golongan_ruang}
      onDelete={handleDeleteItem}
      onEdit={handleEditItem}
    />
  );

  const handleAddBerkasSuccess = () => {
    setOpenAdd(false);
    handleRefresh();
  };

  const handleUpdateBerkasSuccess = () => {
    setOpenUpdate(false);
    handleRefresh();
  };

  return (
    <View style={styles.container}>
      <View style={styles.PosisiButtonTambah}>
        <Button style={styles.button} title="Tambah Data" onPress={handleAddItem} />
      </View>
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
      <BottomSheet isOpen={isOpenAdd}>
        <AddPangkatGaji onClose={() => setOpenAdd(false)} onSuccess={handleAddBerkasSuccess} />
      </BottomSheet>
      <BottomSheet isOpen={isOpenUpdate}>
        <UpdatePangkatGaji
          onClose={() => setOpenUpdate(false)}
          onSuccess={handleUpdateBerkasSuccess}
          DataPangkatGaji={dataUpdate}
        />
      </BottomSheet>
    </View>
  );
}
