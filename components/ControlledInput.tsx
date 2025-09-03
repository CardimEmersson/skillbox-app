import { Control, Controller } from "react-hook-form";
import { Input, InputProps } from "./ui/Input";

interface ControlledInputProps extends InputProps {
  control: Control<any, any, any>;
  name: string;
  label: string;
  placeholder?: string;
}

export function ControlledInput({control, name, label, placeholder, ...props}: ControlledInputProps) {
  return (
     <Controller
        control={control}
        name={name}
        render={({ field: { onChange, value: controlledValue } }) => (
          <Input
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
}