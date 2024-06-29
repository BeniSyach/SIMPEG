import React, { useState, useEffect } from 'react';
import { View, FlatList, ActivityIndicator, StyleSheet, ListRenderItem, Alert } from 'react-native';
import { StackProps } from '@navigator/stack';
import { DataPersistKeys, useDataPersist } from '@hooks';
import Card from '@components/Card';
import { useBerkasService } from '@modules/Berkas';
import { IUser, useAppSlice } from '@modules/app';
import BottomSheet from '@components/BottomSheet';
import { AddBerkas } from './Component/AddBerkas';
import { UpdateBerkas } from './Component/UpdateBerkas';
import Button from '@components/Button';
import axios from 'axios';
import config from '@utils/config';

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
  jenis_berkas: string;
  nomor_berkas: string;
  tgl_mulai: string;
  tgl_akhir: string;
  file: string;
};

export default function Berkas({ navigation, route }: StackProps) {
  const { getPersistData, setPersistData, removeAllPersistData } = useDataPersist();
  const { dispatch, reset } = useAppSlice();
  const { getBerkas } = useBerkasService();
  const [data, setData] = useState<Item[]>([]);
  const [dataUpdate, setDataUpdate] = useState({
    id: '',
    nik: 0,
    jenis_berkas: '',
    nomor_berkas: '',
    tgl_mulai: '',
    tgl_akhir: '',
    file: '',
  });
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
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
        console.log('User Token found:', token);
        const berkas = await getBerkas(token.access_token);
        if (berkas) {
          const SimpanToken = await setPersistData(DataPersistKeys.TOKEN, berkas);
          if (SimpanToken) {
            console.log('data Berkas berhasil disimpan');
            const newData = berkas.data.map((item: any) => ({
              id: item.id,
              nik: item.nik,
              jenis_berkas: item.jenis_berkas,
              nomor_berkas: item.nomor_berkas,
              tgl_mulai: item.tgl_mulai,
              tgl_akhir: item.tgl_akhir,
              file: item.file,
            }));
            setData(newData);
          }
        } else {
          const newData: Item[] = Array.from({ length: 1 }, (_, i) => ({
            id: 'tidak ada',
            nik: 0,
            jenis_berkas: 'tidak ada',
            nomor_berkas: 'tidak ada',
            tgl_mulai: 'tidak ada',
            tgl_akhir: 'tidak ada',
            file: 'tidak ada',
          }));
          setData(prevData => [...prevData, ...newData]);
        }
      } else {
        console.log('Token not found.');
      }
    } catch (err) {
      console.log('[##] preload error Berkas:', err);
      Alert.alert('Error Internet 2', 'Silahkan login kembali', [
        { text: 'OK', onPress: handleLogout },
      ]);
    } finally {
      setLoading(false);
      setRefreshing(false);
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

  const handleLoadMore = () => {
    setPage(prevPage => prevPage + 1);
  };

  const handleRefresh = () => {
    setRefreshing(true);
    setOpenAdd(false);
    setOpenUpdate(false);
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
      try {
        const token = await getPersistData<IUser>(DataPersistKeys.TOKEN);
        if (token) {
          const deleteBerkas = await axios.post(
            `${config.API_URL}/api/berkas/delete/${id}`,
            {},
            {
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token.access_token}`,
              },
            },
          );
          const success = deleteBerkas.data;
          if (success.status === 'success') {
            const SimpanToken = await setPersistData(DataPersistKeys.TOKEN, success);
            if (SimpanToken) {
              console.log('data berhasil dihapus');
              Alert.alert('Hapus Data Sukes', `Data Berhasil Dihapus`, [{ text: 'OK' }]);
            }
          } else {
            Alert.alert('Gagal !!!', `Data Gagal Dihapus`, [{ text: 'OK' }]);
          }
        }
      } catch (err) {
        console.log('Delete Data Berkas error:', err);
      }
    } catch (error) {
      console.log('Delete Data Berkas error:', error);
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
      title={item.jenis_berkas}
      description={item.nomor_berkas}
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
        <AddBerkas onClose={() => setOpenAdd(false)} onSuccess={handleAddBerkasSuccess} />
      </BottomSheet>
      <BottomSheet isOpen={isOpenUpdate}>
        <UpdateBerkas
          onClose={() => setOpenUpdate(false)}
          onSuccess={handleUpdateBerkasSuccess}
          dataBerkas={dataUpdate}
        />
      </BottomSheet>
    </View>
  );
}
