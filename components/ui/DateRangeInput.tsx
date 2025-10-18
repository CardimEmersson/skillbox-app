import { sizes } from '@/constants/Sizes';
import { useThemeColor } from '@/hooks/useThemeColor';
import AntDesign from '@expo/vector-icons/AntDesign';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import React, { forwardRef, useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Modal, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import CalendarPicker from 'react-native-calendar-picker';

dayjs.extend(customParseFormat);

export type DateRangeInputProps = React.ComponentProps<typeof TextInput> & {
  label: string;
  lightColor?: string;
  darkColor?: string;
  isLoading?: boolean;
  onChangeText?: (text: string) => void;
  value?: string;
};

export const DateRangeInput = forwardRef<TextInput, DateRangeInputProps>(({ label, value, onChangeText, isLoading, editable = true, ...props }, ref) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const animatedIsFocused = useRef(new Animated.Value(value ? 1 : 0)).current;
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
      outputRange: [placeholderColor, isFocused && !isDisabled ? tintColor : placeholderColor],
    }),
  };

  const onDateChange = (date: any, type: 'START_DATE' | 'END_DATE') => {
    if (type === 'END_DATE') {
      const endDate = dayjs(date).format('DD/MM/YYYY');
      const startDate = value?.split(' - ')[0] || '';
      onChangeText?.(`${startDate} - ${endDate}`);
      setShowDatePicker(false);
    } else {
      const startDate = dayjs(date).format('DD/MM/YYYY');
      onChangeText?.(`${startDate} - `);
    }
  }

  const handlePress = () => {
    setShowDatePicker(true);
    setIsFocused(true);
  };

  return (
    <View className={`w-full ${props.className}`}>
      <Pressable onPress={handlePress} disabled={isDisabled}>
        <View style={[{ backgroundColor: isDisabled ? disabledBackgroundColor : backgroundColor }, styles.inputContainer]} className='rounded-lg justify-center h-[58px]'>
          <Animated.Text style={[labelStyle, { color: isDisabled ? disabledTextColor : labelStyle.color }]} className='absolute left-4'>
            {label}
          </Animated.Text>
          <Text className='text-base px-4 pt-5 text-black'>
            {value}
          </Text>
          <View className='absolute right-4'>
            <AntDesign name="calendar" size={sizes.icons.md} color={isDisabled ? disabledTextColor : placeholderColor} />
          </View>
        </View>
      </Pressable>
      <Modal
        animationType="slide"
        transparent={true}
        visible={showDatePicker}
        onRequestClose={() => {
          setShowDatePicker(!showDatePicker);
        }}
      >
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <View style={{ backgroundColor: 'white', borderRadius: 20, padding: 20, alignItems: 'center' }}>
            <CalendarPicker
              startFromMonday={true}
              allowRangeSelection={true}
              onDateChange={(date, type) => {
                onDateChange(date, type);
              }}
              todayBackgroundColor="#1D61E7"
              selectedDayColor="#1D61E7"
              selectedDayTextColor="#FFFFFF"
              previousTitle="Anterior"
              nextTitle="Próximo"
              weekdays={['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab', 'Dom']}
              months={['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']}
            />
            <Pressable
              className="rounded-2xl p-2.5 mt-4 bg-transparent"
              onPress={() => setShowDatePicker(false)}
            >
              <Text className="text-red-500 font-bold text-center">Cancelar</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
});

DateRangeInput.displayName = "DateRangeInput";

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