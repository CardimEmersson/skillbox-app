import { useThemeColor } from '@/hooks/useThemeColor';
import React from 'react';
import { ActivityIndicator } from 'react-native';

export type SpinnerProps = React.ComponentProps<typeof ActivityIndicator> & {
  size?: number | "small" | "large";
};

export function Spinner({ size = "large", ...props }: SpinnerProps) {
  const color = useThemeColor({}, 'text');

  return (
    // <View style={style} className='flex-1 justify-center items-center'>
      <ActivityIndicator size={size} color={color} {...props} />
    // </View>
  );
}