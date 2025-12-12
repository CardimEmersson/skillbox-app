import { Colors } from '@/constants/Colors';
import { useRouter } from 'expo-router';
import React from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { ThemedText } from '../ThemedText';
import { CustomButton } from './CustomButton';

type ActionModalProps = {
  isVisible: boolean;
  onClose: () => void;
};

export function ActionModal({ isVisible, onClose }: ActionModalProps) {
  const router = useRouter();
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-center items-center">
        <View style={styles.modalView} className="w-80 bg-white rounded-2xl py-9 px-7 items-center">
          <ThemedText type="subtitle" className="mb-5">Navegar</ThemedText>
          <CustomButton
            title="Habilidade"
            onPress={() => {
              router.push('/minhasHabilidades')
              onClose();
            }}
            className='w-full mb-2'
            colors={[...Colors.greenGradient] as [string, string, ...string[]]}
          />
          <CustomButton
            title="Projeto"
            onPress={() => {
              router.push('/projetos')
              onClose();
            }}
            className='w-full mb-2'
            colors={[...Colors.blueGradient] as [string, string, ...string[]]}
          />
          <CustomButton
            title="Meta"
            onPress={() => {
              router.push('/metas')
              onClose();
            }}
            className='w-full mb-2'
            colors={[...Colors.pinkGradient] as [string, string, ...string[]]}
          />
          <CustomButton
            title="Curso"
            onPress={() => {
              router.push('/cursos')
              onClose();
            }}
            className='w-full mb-2'
            colors={[...Colors.orangeGradient] as [string, string, ...string[]]}
          />
          <Pressable
            className="rounded-2xl p-2.5 mt-4 bg-transparent"
            onPress={onClose}
          >
            <Text className="text-red-500 font-bold text-center">Cancelar</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalView: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
});
