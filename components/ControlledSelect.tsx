import { forwardRef } from "react";
import { Control, Controller } from "react-hook-form";
import { TextInput } from "react-native";
import { Select, SelectProps } from "./ui";

interface ControlledSelectProps extends Omit<SelectProps, 'value' | 'onValueChange'> {
  control: Control<any, any, any>;
  name: string;
  label: string;
  placeholder?: string;
}

export const ControlledSelect = forwardRef<TextInput, ControlledSelectProps>(({ control, name, label, placeholder, ...props }, ref) => {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, value } }) => (
        <Select
          ref={ref}
          {...props}
          label={label}
          placeholder={placeholder}
          value={value}
          onValueChange={onChange}
        />
      )}
    />
  )
});

ControlledSelect.displayName = "ControlledSelect";
