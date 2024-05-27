import React from 'react';
import { Text, View, StyleSheet, StatusBar } from 'react-native';
import Button from '@components/Button';
import { StackProps } from '@navigator/stack';
import { colors } from '@theme';
import { DataPersistKeys, useDataPersist } from '@hooks';
import { useAppSlice } from '@modules/app';

const styles = StyleSheet.create({
  root: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.lightGrayPurple,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  buttonTitle: {
    fontSize: 16,
    color: colors.white,
    textAlign: 'center',
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 22,
    backgroundColor: colors.lightPurple,
    height: 44,
    width: '50%',
  },
});

export default function Home({ navigation }: StackProps) {
  const { removePersistData } = useDataPersist();
  const { dispatch, reset } = useAppSlice();

  const handleLogout = async () => {
    try {
      // Hapus data pengguna dari penyimpanan persisten
      // await removePersistData(DataPersistKeys.USER);

      // Reset status login dan hapus data pengguna dari store Redux
      dispatch(reset());

      // Navigasikan pengguna kembali ke layar login
      // navigation.replace('LoginStack');
    } catch (error) {
      console.log('Logout error:', error);
    }
  };

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" />
      <Text style={styles.title}>Home</Text>
      {/* <Button
        title="Go to Details"
        titleStyle={styles.buttonTitle}
        style={styles.button}
        onPress={() => navigation.navigate('DetailsStack', { from: 'Home' })}
      /> */}
      <Button
        title="Logout"
        titleStyle={styles.buttonTitle}
        style={styles.button}
        onPress={handleLogout}
      />
    </View>
  );
}
