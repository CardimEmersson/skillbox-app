import { sizes } from '@/constants/Sizes';
import { MaskType, applyMask } from '@/utils/masks';
import AntDesign from '@expo/vector-icons/AntDesign';
import Ionicons from '@expo/vector-icons/Ionicons';
import DateTimePicker from '@react-native-community/datetimepicker';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import React, { forwardRef, useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Platform, Pressable, Text, TextInput, View } from 'react-native';
import { Spinner } from './Spinner';

dayjs.extend(customParseFormat);

export type InputProps = React.ComponentProps<typeof TextInput> & {
  label: string;
  lightColor?: string;
  darkColor?: string;
  rightIcon?: React.ComponentProps<typeof AntDesign>['name'];
  isLoading?: boolean;
  type?: 'password' | 'text' | 'date' | 'phone';
  mask?: MaskType;
  error?: string;
  minimumDate?: Date;
};

export const Input = forwardRef<TextInput, InputProps>(({ label, value, onChangeText, rightIcon, isLoading, editable = true, type = 'text', mask, error, minimumDate, ...props }, ref) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const animatedIsFocused = useRef(new Animated.Value(value ? 1 : 0)).current;
  const isDisabled = useMemo(() => !editable || isLoading, [editable, isLoading]);

  useEffect(() => {
    Animated.timing(animatedIsFocused, {
      toValue: isFocused || (value && value.length > 0) ? 1 : 0,
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
      outputRange: ['#687076', error ? '#EF4444' : (isFocused && !isDisabled ? '#0056b2' : '#687076')],
    }),
  };

  const isPassword = useMemo(() => type === 'password', [type]);
  const isDate = useMemo(() => type === 'date', [type]);
  const isPhone = useMemo(() => type === 'phone', [type]);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const onDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      const formattedDate = dayjs(selectedDate).format('DD/MM/YYYY');
      if (onChangeText) {
        onChangeText(formattedDate);
      }
    }
  };

  const handlePress = () => {
    if (isDate) {
      setShowDatePicker(true);
      setIsFocused(true);
    }
  };

  const onBlur = (event: any) => {
    if (!value) {
      setIsFocused(false);
    }
    if (isDate) {
      setShowDatePicker(false);
    }
    props?.onBlur?.(event);
  };

  const getDateValue = () => {
    if (value && dayjs(value, 'DD/MM/YYYY').isValid()) {
      return dayjs(value, 'DD/MM/YYYY').toDate();
    }
    return new Date();
  };

  const handleTextChange = (text: string) => {
    if (mask && onChangeText) {
      const maskedText = applyMask(mask, text);
      onChangeText(maskedText);
    } else if (onChangeText) {
      onChangeText(text);
    }
  };

  return (
    <View className={`w-full ${props.className}`}>
      <Pressable onPress={handlePress} disabled={isDisabled}>
        <View className={`rounded-lg justify-center ${props.multiline ? 'h-auto' : 'min-h-[58px]'} bg-white border border-black/10 ${isDisabled ? 'bg-black/10' : 'shadow-md'}`}>
          <Animated.Text style={[labelStyle, isDisabled && {color: '#00000050'}]} className='absolute left-4'>
            {label}
          </Animated.Text>
          <TextInput
            ref={ref}
            {...props}
            placeholder={isFocused ? props.placeholder : ""}
            value={value}
            onChangeText={handleTextChange}
            onFocus={(event) => {
              setIsFocused(true);
              if (isDate) {
                setShowDatePicker(true);
              }
              props?.onFocus?.(event);
            }}
            onBlur={onBlur}
            className={`${props.multiline ? 'h-32 pt-7' : 'min-h-[58px] pt-7'} text-base px-4 text-black ${rightIcon || isLoading || isPassword ? 'pr-12' : ''} ${isDisabled ? 'text-black/50 dark:text-white/50' : ''}`}
            placeholderTextColor={"#687076"}
            editable={!isDisabled && !isDate}
            secureTextEntry={isPassword && !isPasswordVisible}
            maxLength={isPhone ? 15 : props.maxLength}
            keyboardType={isPhone ? 'phone-pad' : props.keyboardType}
          />
          {rightIcon && !isPassword && !isDate && (
            <View className='absolute right-4'>
              <AntDesign name={rightIcon} size={sizes.icons.md} color={"#687076"} />
            </View>
          )}
          {isPassword && (
            <Pressable onPress={togglePasswordVisibility} className='absolute right-4'>
              <Ionicons name={isPasswordVisible ? 'eye' : 'eye-off-outline'} size={sizes.icons.md} color={"#687076"} />
            </Pressable>
          )}
          {isDate && (
            <View className='absolute right-4'>
              <AntDesign name="calendar" size={sizes.icons.md} color={"#687076"} />
            </View>
          )}
          {isLoading && <View className='absolute right-4'><Spinner size={"small"} /></View>}
        </View>
      </Pressable>
      {showDatePicker && isDate && (
        <DateTimePicker
          testID="dateTimePicker"
          value={getDateValue()}
          mode="date"
          display="default"
          onChange={onDateChange}
          minimumDate={minimumDate}
        />
      )}
      {error && <Text className="text-red-500 text-sm mt-1 ml-1">{error}</Text>}
    </View>
  );
});

Input.displayName = "Input";
