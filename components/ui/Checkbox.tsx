
import { sizes } from '@/constants/Sizes';
import { useThemeColor } from '@/hooks/useThemeColor';
import Ionicons from '@expo/vector-icons/Ionicons';
import React from 'react';
import { Pressable, View } from 'react-native';
import { ThemedText } from '../ThemedText';

export type CheckboxProps = {
  label: string;
  value: boolean;
  onChange: (value: boolean) => void;
  className?: string;
};

export const Checkbox = ({ label, value, onChange, className }: CheckboxProps) => {
  const color = useThemeColor({}, 'text');
  const tintColor = useThemeColor({}, 'tint');
  const backgroundColor = useThemeColor({ light: '#ffffff', dark: '#ffffff10' }, 'background');

  return (
    <Pressable onPress={() => onChange(!value)} className={`flex-row items-center gap-2 ${className}`}>
      <View
        style={{
          width: sizes.icons.md,
          height: sizes.icons.md,
          borderRadius: 4,
          borderWidth: 2,
          borderColor: tintColor,
          backgroundColor,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {value && <Ionicons name="checkmark" size={sizes.icons.sm} color={tintColor} />}
      </View>
      <ThemedText style={{ color }}>{label}</ThemedText>
    </Pressable>
  );
};
