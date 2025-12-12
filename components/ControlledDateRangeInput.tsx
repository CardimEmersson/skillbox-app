
import { forwardRef } from "react";
import { Control, Controller } from "react-hook-form";
import { TextInput } from "react-native";
import { DateRangeInput, DateRangeInputProps } from "./ui/DateRangeInput";

interface ControlledDateRangeInputProps extends DateRangeInputProps {
  control: Control<any, any, any>;
  name: string;
  label: string;
  placeholder?: string;
}

export const ControlledDateRangeInput = forwardRef<TextInput, ControlledDateRangeInputProps>(({ control, name, label, placeholder, ...props }, ref) => {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, value: controlledValue }, fieldState: { error } }) => (
        <DateRangeInput
          ref={ref}
          {...props}
          label={label}
          placeholder={placeholder}
          value={controlledValue}
          onChangeText={(text) => {
            onChange(text);
            props?.onChangeText?.(text);
          }}
          error={error?.message}
        />
      )}
    />
  )
});

ControlledDateRangeInput.displayName = "ControlledDateRangeInput";
