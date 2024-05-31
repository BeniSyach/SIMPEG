// src/Card.tsx
import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';

type CardProps = {
  id: string;
  title: string;
  description: string;
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
};

const Card: React.FC<CardProps> = ({ id, title, description, onDelete, onEdit }) => {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
      <View style={styles.buttonContainer}>
        <Button title="Edit" onPress={() => onEdit(id)} />
        <Button title="Delete" onPress={() => onDelete(id)} color="red" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
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
});

export default Card;
