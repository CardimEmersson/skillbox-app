import { sizes } from '@/constants/Sizes';
import { useThemeColor } from '@/hooks/useThemeColor';
import AntDesign from '@expo/vector-icons/AntDesign';
import React, { forwardRef, useEffect, useMemo, useRef, useState } from 'react';
import { Animated, FlatList, Modal, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { ThemedText } from '../ThemedText';
import { CustomButton } from './CustomButton';
import { shadowInput } from './Input';

export type SelectOption = {
  label: string;
  value: any;
};

export type SelectProps = Omit<React.ComponentProps<typeof TextInput>, 'onChangeText' | 'value'> & {
  label: string;
  lightColor?: string;
  darkColor?: string;
  isLoading?: boolean;
  options: SelectOption[];
  onValueChange: (value: any) => void;
  value: any;
  error?: string;
};

export const Select = forwardRef<TextInput, SelectProps>(({ label, value, onValueChange, isLoading, editable = true, options, error, ...props }, ref) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const animatedIsFocused = useRef(new Animated.Value(value ? 1 : 0)).current;
  const color = useThemeColor({}, 'text');
  const tintColor = useThemeColor({}, 'tint');
  const placeholderColor = useThemeColor({}, 'icon');
  const backgroundColor = useThemeColor({ light: '#ffffff', dark: '#ffffff10' }, 'background');
  const disabledBackgroundColor = useThemeColor({ light: '#00000010', dark: '#ffffff10' }, 'background');
  const disabledTextColor = useThemeColor({ light: '#00000050', dark: '#ffffff50' }, 'text');

  const isDisabled = useMemo(() => !editable || isLoading, [editable, isLoading]);
  const selectedOption = useMemo(() => options.find(option => option.value === value), [options, value]);

  useEffect(() => {
    Animated.timing(animatedIsFocused, {
      toValue: isFocused || (value !== undefined && value !== null && value !== '') ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [animatedIsFocused, isFocused, value]);

  const labelStyle = {
    top: animatedIsFocused.interpolate({
      inputRange: [0, 1],
      outputRange: [18, 8],
    }),
    fontSize: animatedIsFocused.interpolate({
      inputRange: [0, 1],
      outputRange: [16, 12],
    }),
    color: animatedIsFocused.interpolate({
      inputRange: [0, 1],
      outputRange: [placeholderColor, error ? '#EF4444' : (isFocused && !isDisabled ? tintColor : placeholderColor)],
    }),
  };

  const handlePress = () => {
    if (!isDisabled) {
      setShowModal(true);
      setIsFocused(true);
    }
  };

  const onBlur = (event: any) => {
    if (!value) {
      setIsFocused(false);
    }
    props?.onBlur?.(event);
  };

  const handleSelect = (option: SelectOption) => {
    onValueChange(option.value);
    setShowModal(false);
    setIsFocused(false);
  };

  return (
    <View className={props.className ? props.className : "w-full"}>
      <Pressable onPress={handlePress} disabled={isDisabled} onBlur={onBlur}>
        <View style={[
          { backgroundColor: isDisabled ? disabledBackgroundColor : backgroundColor },
          styles.selectContainer,
          { borderColor: error ? '#EF4444' : 'transparent', borderWidth: 1 }
        ]} className='rounded-lg justify-center h-[58px]'>
          <Animated.Text style={[labelStyle, {color: isDisabled ? disabledTextColor : labelStyle.color}]} className='absolute left-4'>
            {label}
          </Animated.Text>
          <Text
            style={{ color: isDisabled ? disabledTextColor : color }}
            className={`text-base px-4 pt-7 ${'pr-12'}`}
          >
            {selectedOption?.label}
          </Text>
          <View className='absolute right-4'>
            <AntDesign name="down" size={sizes.icons.md} color={isDisabled ? disabledTextColor : placeholderColor} />
          </View>
        </View>
      </Pressable>
      {error && <Text className="text-red-500 text-sm mt-1 ml-1">{error}</Text>}
      <Modal
        animationType="fade"
        transparent={true}
        visible={showModal}
        onRequestClose={() => setShowModal(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setShowModal(false)}>
          <View style={styles.modalView} className="w-80 max-h-[80%] bg-white rounded-2xl py-9 px-7 items-center">
            <ThemedText type="subtitle" className="mb-5">{label}</ThemedText>
            <FlatList
              data={options}
              keyExtractor={(item) => item.value.toString()}
              renderItem={({ item }) => (
                <CustomButton
                  title={item.label}
                  onPress={() => handleSelect(item)}
                  className='w-full mb-2'
                  colors={value === item.value ? undefined : ['#b5b7ba', '#b8babc'] as [string, string, ...string[]]}
                />
              )}
              className='w-full'
              showsVerticalScrollIndicator={false}
            />
            <Pressable
              className="rounded-2xl p-2.5 mt-4 bg-transparent"
              onPress={() => setShowModal(false)}
            >
              <Text className="text-red-500 font-bold text-center">Cancelar</Text>
            </Pressable>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
});

Select.displayName = "Select";

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
  selectContainer: shadowInput
});