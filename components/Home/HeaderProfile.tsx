import { AuthContext } from "@/comtexts/authContext";
import { sizes } from "@/constants/Sizes";
import Feather from '@expo/vector-icons/Feather';
import Ionicons from "@expo/vector-icons/Ionicons";

import { useRouter } from "expo-router";
import { useContext } from "react";
import { Image, Pressable, Text, View } from "react-native";


export function HeaderProfile() {
  const { userAuth } = useContext(AuthContext);
  const router = useRouter();

  return (
    <View className="w-full flex-row justify-between items-center mb-5">
      <Pressable onPress={() => {
        router.push('/usuario');
      }}>
        {userAuth?.imagem ? (
          <Image
            source={{ uri: userAuth.imagem }}
            className="w-16 h-16 rounded-full border-4 border-bege"
          />
        ) : (
          <View className="w-16 h-16 rounded-full border-4 border-bege bg-primary-light items-center justify-center">
            <Feather name="user" size={24} />
          </View>
        )}
      </Pressable>

      <View className='relative'>
        <Pressable onPress={() => {
          router.push('/notificacoes');
        }}>
          <Ionicons name="notifications-outline" size={sizes.icons.xl} color="black" />
          <View className='w-5 h-5 bg-primary absolute rounded-full items-center justify-center -right-0'>
            <Text className='color-white font-bold text-sm'>3</Text>
          </View>
        </Pressable>
      </View>
    </View>
  )
}