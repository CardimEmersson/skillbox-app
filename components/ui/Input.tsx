import { sizes } from '@/constants/Sizes';
import { useThemeColor } from '@/hooks/useThemeColor';
import { MaskType, applyMask } from '@/utils/masks';
import AntDesign from '@expo/vector-icons/AntDesign';
import Ionicons from '@expo/vector-icons/Ionicons';
import DateTimePicker from '@react-native-community/datetimepicker';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import React, { forwardRef, useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Platform, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
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
};

export const Input = forwardRef<TextInput, InputProps>(({ label, value, onChangeText, rightIcon, isLoading, editable = true, type = 'text', mask, error, ...props }, ref) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const animatedIsFocused = useRef(new Animated.Value(value ? 1 : 0)).current;
  const color = useThemeColor({}, 'text');
  const tintColor = useThemeColor({}, 'tint');
  const placeholderColor = useThemeColor({}, 'icon');
  const backgroundColor = useThemeColor({ light: '#ffffff', dark: '#ffffff10' }, 'background');
  const disabledBackgroundColor = useThemeColor({ light: '#00000010', dark: '#ffffff10' }, 'background');
  const disabledTextColor = useThemeColor({ light: '#00000050', dark: '#ffffff50' }, 'text');

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
      outputRange: [placeholderColor, error ? '#EF4444' : (isFocused && !isDisabled ? tintColor : placeholderColor)],
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
        <View style={[
          { backgroundColor: isDisabled ? disabledBackgroundColor : backgroundColor },
          styles.inputContainer,
          { borderColor: error ? '#EF4444' : 'transparent', borderWidth: 1 }
        ]} className={`rounded-lg justify-center ${props.multiline ? 'h-auto' : 'min-h-[58px]'}`}>
          <Animated.Text style={[labelStyle, { color: isDisabled ? disabledTextColor : labelStyle.color }]} className='absolute left-4'>
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
            style={{ color: isDisabled ? disabledTextColor : color }}
            className={`${props.multiline ? 'h-32 pt-7' : 'min-h-[58px] pt-7'} text-base px-4 ${rightIcon || isLoading || isPassword ? 'pr-12' : ''}`}
            placeholderTextColor={placeholderColor}
            editable={!isDisabled && !isDate}
            secureTextEntry={isPassword && !isPasswordVisible}
            maxLength={isPhone ? 15 : props.maxLength}
            keyboardType={isPhone ? 'phone-pad' : props.keyboardType}
          />
          {rightIcon && !isPassword && !isDate && (
            <View className='absolute right-4'>
              <AntDesign name={rightIcon} size={sizes.icons.md} color={isDisabled ? disabledTextColor : placeholderColor} />
            </View>
          )}
          {isPassword && (
            <Pressable onPress={togglePasswordVisibility} className='absolute right-4'>
              <Ionicons name={isPasswordVisible ? 'eye' : 'eye-off-outline'} size={sizes.icons.md} color={isDisabled ? disabledTextColor : placeholderColor} />
            </Pressable>
          )}
          {isDate && (
            <View className='absolute right-4'>
              <AntDesign name="calendar" size={sizes.icons.md} color={isDisabled ? disabledTextColor : placeholderColor} />
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
        />
      )}
      {error && <Text className="text-red-500 text-sm mt-1 ml-1">{error}</Text>}
    </View>
  );
});

Input.displayName = "Input";

export const shadowInput = {
  shadowColor: '#000',
  shadowOffset: {
    width: 0,
    height: 1,
  },
  shadowOpacity: 0.20,
  shadowRadius: 1.41,
  elevation: 4,
}

const styles = StyleSheet.create({
  inputContainer: shadowInput,
});