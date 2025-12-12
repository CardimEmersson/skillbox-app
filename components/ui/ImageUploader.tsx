
import { sizes } from '@/constants/Sizes';
import { useThemeColor } from '@/hooks/useThemeColor';
import { AntDesign, Feather } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import React, { useEffect } from 'react';
import { Alert, Image, Pressable, StyleSheet } from 'react-native';

interface ImageUploaderProps {
  image: string | null;
  setImage: (uri: string | null) => void;
  disabled?: boolean;
}

export function ImageUploader({ image, setImage, disabled }: ImageUploaderProps) {
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
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setImage(uri);
    }
  };

  return (
    <Pressable onPress={pickImage} style={[styles.container, { backgroundColor }]} disabled={disabled}>
      {image ? (
        <Image source={{ uri: image }} style={styles.image} />
      ) : (
        disabled ? <Feather name="user" size={sizes.icons.lg} color={color} /> : <AntDesign name="plus" size={sizes.icons.lg} color={color} />
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#ddd',
    borderStyle: 'dashed',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
});
