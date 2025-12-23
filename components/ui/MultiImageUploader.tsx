
import { sizes } from '@/constants/Sizes';
import { useThemeColor } from '@/hooks/useThemeColor';
import { AntDesign } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import React, { useEffect } from 'react';
import { Alert, Image, Pressable, StyleSheet, View } from 'react-native';

export type TypeImage = {
  id?: number;
  url: string;
}

interface MultiImageUploaderProps {
  images: TypeImage[];
  setImages: (images: TypeImage[]) => void;
  callbackFiles: (images: ImagePicker.ImagePickerAsset[]) => void;
  selectionLimit?: number;
}

export function MultiImageUploader({ images, setImages, callbackFiles, selectionLimit }: MultiImageUploaderProps) {
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
      mediaTypes: 'images',
      allowsMultipleSelection: true,
      quality: 1,
      selectionLimit: selectionLimit,
    });

    if (!result.canceled) {
      const uris: TypeImage[] = result.assets.map((asset) => ({
        url: asset.uri
      }));
      callbackFiles?.(result.assets);
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
          <Image source={{ uri: image?.url }} style={styles.image} />
          <Pressable onPress={() => removeImage(index)} style={styles.removeButton}>
            <AntDesign name="closecircle" size={sizes.icons.md} color="red" />
          </Pressable>
        </View>
      ))}
      {Boolean(selectionLimit) && (
        <Pressable onPress={pickImage} style={[styles.addButton, { backgroundColor }]}>
          <AntDesign name="plus" size={sizes.icons.lg} color={color} />
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: '100%',
    paddingVertical: 10,
  },
  imageContainer: {
    width: '31%',
    aspectRatio: 1,
    marginRight: '2%',
    marginBottom: 10,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  removeButton: {
    position: 'absolute',
    top: 5,
    right: 5,
  },
  addButton: {
    width: '31%',
    height: "100%",
    aspectRatio: 1,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderStyle: 'dashed',
    marginBottom: 10,
    marginRight: '2%',
  },
});
