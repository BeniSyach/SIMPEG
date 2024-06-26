// ImageUpload.tsx
import React, { useState } from 'react';
import { View, Text, Image, StyleProp, ViewStyle, TextStyle, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';
import { colors } from '@theme';
import Button from '@components/Button';

const MAX_IMAGE_SIZE_MB = 1;

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
  posisiGambar: {
    marginTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
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

  const resizeImageIfNeeded = async (uri: string) => {
    // Get file info
    const fileInfo = await fetch(uri).then(response => response.blob());

    // Check if file size is greater than 1 MB
    if (fileInfo.size / 1024 / 1024 > MAX_IMAGE_SIZE_MB) {
      // Resize image
      const manipulatedImage = await manipulateAsync(
        uri,
        [{ resize: { width: 1200, height: 900 } }],
        { compress: 0.7, format: SaveFormat.JPEG },
      );

      return manipulatedImage.uri;
    }

    return uri;
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const selectedUri = result.assets[0].uri;
      const resizedUri = await resizeImageIfNeeded(selectedUri);
      setImageUri(resizedUri);
      onImageSelected(resizedUri); // Panggil callback dengan URI gambar yang dipilih
    }
  };

  return (
    <View style={[styles.container, style]}>
      {label && <Text style={[styles.label, labelStyle]}>{label}</Text>}
      <Button title="Ambil Foto" onPress={pickImage} />
      <View style={styles.posisiGambar}>
        {imageUri && <Image source={{ uri: imageUri }} style={styles.image} />}
        {error && <Text style={[styles.errorText, errorStyle]}>{error}</Text>}
      </View>
    </View>
  );
};

export default ImageUpload;
