// DocumentPicker.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StyleProp,
  ViewStyle,
  TextStyle,
} from 'react-native';
import * as DocumentPicker from 'expo-document-picker';

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  button: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  buttonText: {
    fontSize: 16,
    color: 'black',
  },
  errorText: {
    fontSize: 12,
    color: 'red',
    marginTop: 4,
  },
});

interface DocumentPickerProps {
  onDocumentPicked: (document: any) => void;
  error?: string;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  errorTextStyle?: StyleProp<TextStyle>;
}

const DocumentPickerComponent: React.FC<DocumentPickerProps> = ({
  onDocumentPicked,
  error,
  style,
  textStyle,
  errorTextStyle,
}) => {
  const [document, setDocument] = useState<any | null>(null);

  const pickDocument = async () => {
    const result = await DocumentPicker.getDocumentAsync({});
    if (!result.canceled && 'type' in result) {
      setDocument(result);
      onDocumentPicked(result);
    }
  };

  return (
    <View style={[styles.container, style]}>
      <TouchableOpacity onPress={pickDocument} style={styles.button}>
        <Text style={[styles.buttonText, textStyle]}>
          {document ? document.name : 'Pilih Dokumen'}
        </Text>
      </TouchableOpacity>
      {error && <Text style={[styles.errorText, errorTextStyle]}>{error}</Text>}
    </View>
  );
};

export default DocumentPickerComponent;
