import { Colors } from "@/constants/Colors";
import { View } from "react-native";
import { ListCardLayout } from "../ui";

export function ListCardPerfilSkeleton() {
  return (
    <ListCardLayout colors={[...Colors.grayGradient] as [string, string, ...string[]]} onEdit={() => {}} showEdit={false}>
      <View className='w-full flex flex-row items-center'>
        <View className='flex-1 mr-auto'>
          <View className='h-6 w-3/4 bg-zinc-300 rounded mb-2' />
          <View className='h-4 w-1/2 bg-zinc-300 rounded' />
        </View>
      </View>
      <View className="w-full h-3 bg-zinc-200 rounded-full my-2">
        <View className="h-3 bg-zinc-300 rounded-full" style={{ width: `50%` }} />
      </View>
    </ListCardLayout>
  )
}