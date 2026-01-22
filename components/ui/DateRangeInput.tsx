import { sizes } from '@/constants/Sizes';
import AntDesign from '@expo/vector-icons/AntDesign';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import React, { forwardRef, useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Modal, Pressable, Text, TextInput, View } from 'react-native';
import CalendarPicker from 'react-native-calendar-picker';

dayjs.extend(customParseFormat);

export type DateRangeInputProps = React.ComponentProps<typeof TextInput> & {
  label: string;
  lightColor?: string;
  darkColor?: string;
  isLoading?: boolean;
  onChangeText?: (text: string) => void;
  value?: string;
  error?: string;
};

export const DateRangeInput = forwardRef<TextInput, DateRangeInputProps>(({ label, value, onChangeText, isLoading, editable = true, error, ...props }, ref) => {
  const [isFocused, setIsFocused] = useState(false);
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
    lineHeight: animatedIsFocused.interpolate({
      inputRange: [0, 1],
      outputRange: [22, 16],
    }),
    color: animatedIsFocused.interpolate({
      inputRange: [0, 1],
      outputRange: ['#687076', error ? '#EF4444' : (isFocused && !isDisabled ? '#0056b2' : '#687076')],
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
        <View className={`rounded-lg justify-center h-[58px] bg-white border ${error ? 'border-red-500' : 'border-black/10'} ${!isDisabled ? 'shadow-md' : 'bg-black/10'}`}>
          <Animated.Text
            style={[labelStyle, isDisabled && { color: '#00000050' }]}
            className='absolute left-4 right-12'
            numberOfLines={1}
          >
            {label}
          </Animated.Text>
          <Text className={`text-base px-4 pt-5 text-black ${isDisabled ? 'text-black/50' : ''}`}>
            {value}
          </Text>
          <View className='absolute right-4'>
            <AntDesign name="calendar" size={sizes.icons.md} color={"#687076"} />
          </View>
        </View>
      </Pressable>
      {error && <Text className="text-red-500 text-sm mt-1 ml-1">{error}</Text>}
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
