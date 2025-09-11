import { forwardRef } from "react";
import { Control, Controller } from "react-hook-form";
import { TextInput } from "react-native";
import { Input, InputProps } from "./ui/Input";

interface ControlledInputProps extends InputProps {
  control: Control<any, any, any>;
  name: string;
  label: string;
  placeholder?: string;
}

export const ControlledInput = forwardRef<TextInput, ControlledInputProps>(({ control, name, label, placeholder, ...props }, ref) => {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, value: controlledValue } }) => (
        <Input
          ref={ref}
          {...props}
          label={label}
          placeholder={placeholder}
          value={controlledValue}
          onChangeText={(text) => {
            onChange(text);
            props?.onChangeText?.(text);
          }}
        />
      )}
    />
  )
});

ControlledInput.displayName = "ControlledInput";