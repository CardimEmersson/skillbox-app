import { MaterialIcons } from "@expo/vector-icons";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import { Pressable, Text, View } from "react-native";

interface HeaderListProps {
  onPressAdd?: () => void;
  onPressDelete?: () => void;
  title: string;
  onBack?: () => void;
  disabledAdd?: boolean;
  disabledDelete?: boolean;
  hasAdd?: boolean;
  hasDelete?: boolean;
}

export function HeaderList({ onPressAdd, title, onBack, disabledAdd, hasAdd = true, hasDelete = false, disabledDelete, onPressDelete}: HeaderListProps) {
  const router = useRouter();
  return (
    <View className="w-full flex flex-row justify-between items-center mt-5">
      <Pressable onPress={() => {
        onBack ? onBack() : router.back();
      }}>
        <FontAwesome5 name="angle-left" size={32} color="black" />
      </Pressable>
      <Text className="text-2xl font-inter-bold">{title}</Text>
      {hasAdd && <Pressable onPress={onPressAdd} className={disabledAdd ? "opacity-0" : ""} disabled={disabledAdd}>
        <Ionicons name="add-circle" size={32} color="black" />
      </Pressable>}
      {hasDelete && <Pressable onPress={onPressDelete} className={disabledDelete ? "opacity-0" : ""} disabled={disabledDelete}>
        <MaterialIcons name="delete" size={32} color="#FF6B6B" />
      </Pressable>}
    </View>
  )
}