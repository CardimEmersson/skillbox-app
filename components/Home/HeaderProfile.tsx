import { AuthContext } from "@/contexts/authContext";
import Feather from '@expo/vector-icons/Feather';

import { useRouter } from "expo-router";
import { useContext } from "react";
import { Image, Pressable, View } from "react-native";


export function HeaderProfile() {
  const { userAuth } = useContext(AuthContext);
  const router = useRouter();

  return (
    <View className="w-full flex-row justify-between items-center mb-5 relative">
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
      <Image
        style={{
          width: 40,
          height: 60,
          objectFit: "contain",
          position: "absolute",
          right: 0,
          top: 0,
        }}
        source={require('@/assets/images/skillbox.png')}
      />
    </View>
  )
}