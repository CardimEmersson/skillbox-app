import Ionicons from '@expo/vector-icons/Ionicons';
import { Text, View } from 'react-native';

interface NotificationItemProps {
  icon: React.ComponentProps<typeof Ionicons>['name'];
  title: string;
  isRead?: boolean;
}

export function NotificationItem({ icon, title, isRead = false }: NotificationItemProps) {
  return (
    <View className={`flex-row items-center p-4 rounded-lg mb-3 ${isRead ? 'bg-gray-50' : 'bg-blue-50'}`}>
      <View className={`w-12 h-12 rounded-full items-center justify-center mr-4 ${isRead ? 'bg-gray-200' : 'bg-blue-100'}`}>
        <Ionicons name={icon} size={24} color={isRead ? '#6B7280' : '#3B82F6'} />
      </View>
      <View className="flex-1">
        <Text className={`font-inter-regular text-base ${isRead ? 'text-gray-600' : 'text-gray-800'}`}>{title}</Text>
      </View>
      {!isRead && (
        <View className="w-3 h-3 bg-primary rounded-full ml-2" />
      )}
    </View>
  );
}
