import React, { useState, useEffect } from 'react';
import {
  View,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  ListRenderItem,
  Button,
  Alert,
} from 'react-native';
import { StackProps } from '@navigator/stack';
import { DataPersistKeys, useDataPersist } from '@hooks';
import Card from '@components/Card';
import { usePangkatGajiService, usePangkatGajiSlice } from '@modules/PangkatGaji';
import { IUser } from '@modules/app';
import BottomSheet from '@components/BottomSheet';
import { AddPangkatGaji } from './Component/AddPangkatGaji';
import { UpdatePangkatGaji } from './Component/UpdatePangkatGaji';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingIndicator: {
    paddingVertical: 20,
  },
});

type Item = {
  id: string;
  title: string;
  description: string;
};

export default function Pns({ navigation, route }: StackProps) {
  const { getPersistData, setPersistData } = useDataPersist();
  const { getPangkatGaji } = usePangkatGajiService();
  const [data, setData] = useState<Item[]>([]);
  const [dataUpdate, setDataUpdate] = useState<Item[]>([]);
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
        console.log('data Pangkat Gaji', PangkatGaji?.data[0].nomor_sk);
        if (PangkatGaji) {
          const SimpanToken = await setPersistData(DataPersistKeys.TOKEN, PangkatGaji);
          if (SimpanToken) {
            console.log('data Pangkat Gaji berhasil disimpan');
            const newData = PangkatGaji.data.map((item: any) => ({
              id: item.id,
              title: item.nomor_sk,
              description: item.golongan_ruang,
            }));
            setData(newData);
          }
        } else {
          const newData: Item[] = Array.from({ length: 1 }, (_, i) => ({
            id: `Tidak Ada ${i}`,
            title: `Tidak Ada`,
            description: `Tidak Ada`,
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
    const itemIndex = data.findIndex(item => item.id === id);
    if (itemIndex >= 0) {
      const newTitle = `Updated Item ${id}`;
      const newDescription = `Updated description for item ${id}`;
      const updatedItem: Item = {
        ...data[itemIndex],
        title: newTitle,
        description: newDescription,
      };
      const newData = [...data];
      newData[itemIndex] = updatedItem;
      setDataUpdate(newData);
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
      title={item.title}
      description={item.description}
      onDelete={handleDeleteItem}
      onEdit={handleEditItem}
    />
  );

  return (
    <View style={styles.container}>
      <Button title="Tambah Data" onPress={handleAddItem} />
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
        <AddPangkatGaji onClose={() => setOpenAdd(false)} />
      </BottomSheet>
      <BottomSheet isOpen={isOpenUpdate}>
        <UpdatePangkatGaji onClose={() => setOpenUpdate(false)} />
      </BottomSheet>
    </View>
  );
}
