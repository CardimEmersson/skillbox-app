import { Colors } from '@/constants/Colors';
import React from 'react';
import { Modal, Pressable, StyleSheet, Text } from 'react-native';
import { ThemedText } from '../ThemedText';
import { CustomButton } from './CustomButton';

type ConfirmationModalProps = {
  isVisible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmButtonText?: string;
  cancelButtonText?: string;
  isConfirming?: boolean;
};

export function ConfirmationModal({
  isVisible,
  onClose,
  onConfirm,
  title,
  message,
  confirmButtonText = 'Confirmar',
  cancelButtonText = 'Cancelar',
  isConfirming = false,
}: ConfirmationModalProps) {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <Pressable style={styles.modalOverlay} onPress={onClose}>
        <Pressable style={styles.modalView} className="w-80 bg-white rounded-2xl py-9 px-7 items-center">
          <ThemedText type="subtitle" className="mb-2 text-center">{title}</ThemedText>
          <Text className="font-inter-regular text-base text-center text-gray-600 mb-6">{message}</Text>
          <CustomButton
            title={confirmButtonText}
            onPress={onConfirm}
            className='w-full mb-2'
            colors={[...Colors.redGradient] as [string, string, ...string[]]}
            isLoading={isConfirming}
          />
          <CustomButton
            title={cancelButtonText}
            onPress={onClose}
            className='w-full'
            variant='outlined'
            colors={['#6B7280', '#6B7280']}
            disabled={isConfirming}
          />
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
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
