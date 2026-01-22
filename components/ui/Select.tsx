import { sizes } from '@/constants/Sizes';
import AntDesign from '@expo/vector-icons/AntDesign';
import React, { forwardRef, useEffect, useMemo, useRef, useState } from 'react';
import { Animated, FlatList, Modal, Pressable, Text, TextInput, View } from 'react-native';
import { ThemedText } from '../ThemedText';
import { CustomButton } from './CustomButton';

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
  keyExtractor?: (item: any, index: number) => string;
};

export const Select = forwardRef<TextInput, SelectProps>(({ label, value, onValueChange, isLoading, editable = true, options, error, keyExtractor, ...props }, ref) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const animatedIsFocused = useRef(new Animated.Value(value ? 1 : 0)).current;
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
    lineHeight: animatedIsFocused.interpolate({
      inputRange: [0, 1],
      outputRange: [22, 16],
    }),
    color: animatedIsFocused.interpolate({
      inputRange: [0, 1],
      outputRange: ['#687076', error ? '#EF4444' : (isFocused && !isDisabled ? '#0056b2' : '#687076')],
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
        <View className={`rounded-lg justify-center h-[58px] bg-white ${error ? 'border-red-500' : 'border-black/10'} ${!isDisabled ? 'shadow-md' : 'bg-black/10'}`}>
          <Animated.Text
            style={[labelStyle, isDisabled && { color: '#00000050' }]}
            className='absolute left-4 right-12'
            numberOfLines={1}
          >
            {label}
          </Animated.Text>
          <Text
            className={`text-base px-4 pt-7 pr-12 text-black ${isDisabled ? 'text-black/50 dark:text-white/50' : ''}`}
            numberOfLines={1}
          >
            {selectedOption?.label}
          </Text>
          <View className='absolute right-4'>
            <AntDesign name="down" size={sizes.icons.md} color={"#687076"} />
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
        <Pressable className="flex-1 justify-center items-center bg-black/50" onPress={() => setShowModal(false)}>
          <View className="w-80 max-h-[80%] bg-white rounded-2xl py-9 px-7 items-center shadow-lg">
            <ThemedText type="subtitle" className="mb-5 text-center">{label}</ThemedText>
            <FlatList
              data={options}
              keyExtractor={keyExtractor ? (item, index) => keyExtractor(item, index) : (item) => item.value.toString()}
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
              ListEmptyComponent={
                <View className="flex-1 items-center justify-center p-4">
                  <Text className="text-gray-500 text-center">Nenhum item encontrado.</Text>
                </View>
              }
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
