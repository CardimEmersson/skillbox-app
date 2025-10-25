import { sizes } from '@/constants/Sizes';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Text, View } from 'react-native';

interface EmptyStateProps {
  icon?: React.ComponentProps<typeof Ionicons>['name'];
  title: string;
  message: string;
}

export function EmptyState({ icon = 'information-circle-outline', title, message }: EmptyStateProps) {
  return (
    <View className="flex-1 items-center justify-center p-8">
      <Ionicons name={icon} size={sizes.icons.xl * 1.5} color="#A0A0A0" />
      <Text className="text-2xl font-inter-bold text-center color-text mt-4">{title}</Text>
      <Text className="text-lg font-inter-regular text-center color-gray mt-2">{message}</Text>
    </View>
  );
}
