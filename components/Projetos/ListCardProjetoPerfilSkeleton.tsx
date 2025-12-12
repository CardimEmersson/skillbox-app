import { Colors } from "@/constants/Colors";
import { View } from "react-native";
import { ListCardLayout } from "../ui";

export function ListCardProjetoPerfilSkeleton() {
  return (
    <ListCardLayout colors={[...Colors.grayGradient] as [string, string, ...string[]]} onEdit={() => { }} showEdit={false} className={"py-0 px-0 pb-2"}>
      <View className='h-20 w-full bg-zinc-300 rounded' />
      <View className='w-full flex flex-row items-center py-4 px-4'>
        <View className='flex-1'>
          <View className='h-6 w-3/4 bg-zinc-300 rounded mb-2' />
          <View className='h-4 w-1/2 bg-zinc-300 rounded' />
        </View>
      </View>
        <View className="w-full bg-zinc-200 rounded-full px-4 flex flex-row">
          <View className="h-6 bg-zinc-300 rounded mr-1" style={{ width: `40%` }} />
          <View className="h-6 bg-zinc-300 rounded" style={{ width: `40%` }} />
        </View>
    </ListCardLayout>
  )
}