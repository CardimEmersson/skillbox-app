
import { sizes } from '@/constants/Sizes';
import { useThemeColor } from '@/hooks/useThemeColor';
import { AntDesign } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import React, { useEffect } from 'react';
import { Alert, Image, Pressable, StyleSheet, View } from 'react-native';

interface MultiImageUploaderProps {
  images: string[];
  setImages: (uris: string[]) => void;
}

export function MultiImageUploader({ images, setImages }: MultiImageUploaderProps) {
  const color = useThemeColor({}, 'text');
  const backgroundColor = useThemeColor({ light: '#ffffff', dark: '#ffffff10' }, 'background');

  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permissão necessária', 'É necessário permitir o acesso à galeria para selecionar uma imagem.');
      }
    })();
  }, []);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 1,
    });

    if (!result.canceled) {
      const uris = result.assets.map((asset) => asset.uri);
      setImages([...images, ...uris]);
    }
  };

  const removeImage = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
  };

  return (
    <View style={styles.container}>
      {images.map((image, index) => (
        <View key={index} style={styles.imageContainer}>
          <Image source={{ uri: image }} style={styles.image} />
          <Pressable onPress={() => removeImage(index)} style={styles.removeButton}>
            <AntDesign name="closecircle" size={sizes.icons.md} color="red" />
          </Pressable>
        </View>
      ))}
      <Pressable onPress={pickImage} style={[styles.addButton, { backgroundColor }]}>
        <AntDesign name="plus" size={sizes.icons.lg} color={color} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingVertical: 10,
  },
  imageContainer: {
    marginRight: 10,
    marginBottom: 10,
    position: 'relative',
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  removeButton: {
    position: 'absolute',
    top: 5,
    right: 5,
  },
  addButton: {
    width: 100,
    height: 100,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderStyle: 'dashed',
    marginBottom: 10,
  },
});
