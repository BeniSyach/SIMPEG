import { colors } from '@theme';
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

type CardProps = {
  id: string;
  title: string;
  description: string;
};

const CardAbsen: React.FC<CardProps> = ({ id, title, description }) => {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 30,
    padding: 20,
    marginVertical: 10,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  buttonEdit: {
    width: 100,
    backgroundColor: colors.blue,
  },
  buttonHapus: {
    width: 100,
    backgroundColor: colors.red,
  },
});

export default CardAbsen;
