import { sizes } from '@/constants/Sizes';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Controller, FieldError } from 'react-hook-form';
import {
  FlatList,
  Keyboard,
  Pressable,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { Input, SelectOption } from './ui';


interface ControlledAutocompleteProps {
  control: any;
  name: string;
  label: string;
  options: SelectOption[];
  onAddOption: (newOption: string) => SelectOption;
  placeholder?: string;
  className?: string;
  error?: FieldError;
  inputValue: string;
  handleInputValue: (value: string) => void;
  isLoading?: boolean;
}

export function ControlledAutocomplete({
  control,
  name,
  label,
  options,
  onAddOption,
  placeholder,
  className,
  error,
  inputValue,
  handleInputValue,
  isLoading,
}: ControlledAutocompleteProps) {
  
  const [filteredOptions, setFilteredOptions] = useState<SelectOption[]>([]);
  const [isFocused, setIsFocused] = useState(false);
  const linkColor = useThemeColor({}, 'text');

  const handleInputChange = (text: string, fieldOnChange: (value: any) => void) => {
    handleInputValue(text);
    if (text) {
      const newFilteredOptions = options.filter((option) =>
        option.label.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredOptions(newFilteredOptions);
    } else {
      setFilteredOptions([]);
    }
    fieldOnChange(undefined);
  };

  const handleSelectOption = (option: SelectOption, fieldOnChange: (value: any) => void) => {
    handleInputValue(option.label);
    fieldOnChange(option.value);
    setFilteredOptions([]);
    setIsFocused(false);
    Keyboard.dismiss();
  };

  const handleAddNewOption = (fieldOnChange: (value: any) => void) => {
    if (inputValue) {
      const novaOpcao = onAddOption(inputValue);
      handleInputValue(novaOpcao.label);
      fieldOnChange(novaOpcao.value);
      setFilteredOptions([]);
      setIsFocused(false);
      Keyboard.dismiss();
    }
  };

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, value } }) => (
        <View className={className}>
          <View>
            <Input
              label={isLoading ? "carregando..." : label}
              placeholder={placeholder}
              value={inputValue}
              onChangeText={(text) => handleInputChange(text, onChange)}
              onFocus={() => {
                const newFilteredOptions = options.filter((option) =>
                  option.label.toLowerCase().includes(inputValue.toLowerCase())
                );
                setFilteredOptions(newFilteredOptions);
                setIsFocused(true);
              }}
              onBlur={() => {
                setTimeout(() => setIsFocused(false), 200);
              }}
              error={error?.message}
              isLoading={isLoading}
            />
            {isFocused && inputValue.length > 0 && (
              <View className="absolute top-[70px] z-10 w-full bg-white rounded-lg max-h-48 border border-zinc-300">
                <FlatList
                  data={filteredOptions}
                  keyExtractor={(item) => item.value.toString()}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      className="p-3 border-b border-zinc-300"
                      onPress={() => handleSelectOption(item, onChange)}
                    >
                      <Text>{item.label}</Text>
                    </TouchableOpacity>
                  )}
                  ListEmptyComponent={
                    inputValue ? (
                      <Pressable
                        className="flex-row items-center p-3"
                        onPress={() => handleAddNewOption(onChange)}
                      >
                        <Ionicons name="add-circle-outline" size={sizes.icons.md} color={linkColor} />
                        <Text className="ml-2" style={{ color: linkColor }}>
                          {`Adicionar nova categoria: "${inputValue}"`}
                        </Text>
                      </Pressable>
                    ) : null
                  }
                  keyboardShouldPersistTaps="handled"
                />
              </View>
            )}
          </View>
        </View>
      )}
    />
  );
}
