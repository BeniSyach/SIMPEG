// ImageUpload.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  Button,
  StyleProp,
  ViewStyle,
  TextStyle,
  StyleSheet,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { colors } from '@theme';

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: colors.black,
    marginBottom: 4,
  },
  image: {
    width: 100,
    height: 100,
    marginBottom: 8,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: colors.gray,
  },
  button: {
    marginBottom: 8,
  },
  errorText: {
    fontSize: 12,
    color: colors.red,
    marginTop: 4,
  },
});

interface ImageUploadProps {
  label?: string;
  error?: string;
  style?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
  errorStyle?: StyleProp<TextStyle>;
  onImageSelected: (imageUri: string) => void; // Callback untuk memberi tahu induk
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  label,
  error,
  style,
  labelStyle,
  errorStyle,
  onImageSelected, // Callback untuk memberi tahu induk
}) => {
  const [imageUri, setImageUri] = useState<string | null>(null);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const selectedUri = result.assets[0].uri;
      setImageUri(selectedUri);
      onImageSelected(selectedUri); // Panggil callback dengan URI gambar yang dipilih
    }
  };

  return (
    <View style={[styles.container, style]}>
      {label && <Text style={[styles.label, labelStyle]}>{label}</Text>}
      <Button title="Pick Image" onPress={pickImage} />
      {imageUri && <Image source={{ uri: imageUri }} style={styles.image} />}
      {error && <Text style={[styles.errorText, errorStyle]}>{error}</Text>}
    </View>
  );
};

export default ImageUpload;
