import { colors } from '@theme';
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

type CardProps = {
  title: string;
  description: string;
  onPress: (title: string) => void;
};

const CardAbsen: React.FC<CardProps> = ({ title, description, onPress }) => {
  return (
    <TouchableOpacity onPress={() => onPress(title)} style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
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
    fontSize: 18,
    color: '#666',
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
