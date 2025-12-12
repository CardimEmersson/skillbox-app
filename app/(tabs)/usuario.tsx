import { ListCardPerfil } from "@/components/Cursos/ListCardPerfil";
import { ListCardProjetoPerfil } from "@/components/Projetos/ListCardProjetoPerfil";
import { ConfirmationModal, CustomButton } from "@/components/ui";
import { ImageUploader } from "@/components/ui/ImageUploader";
import { SkillboxItem } from "@/components/ui/SkillboxItem";
import { Colors } from "@/constants/Colors";
import { AntDesign, FontAwesome5 } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, SafeAreaView, ScrollView, Text, View } from "react-native";


export default function Usuario() {
  const router = useRouter();
  const [image, setImage] = useState<string | null>("");
  const [isExitModalVisible, setIsExitModalVisible] = useState(false);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerClassName="flex-grow w-full flex pt-10 px-8 pb-8 mt-2"
        automaticallyAdjustKeyboardInsets
      >
        <View className="flex items-center ">
          <View className="w-full flex flex-row justify-between">
            <Pressable className="opacity-0">
              <FontAwesome5 name="angle-left" size={32} color="black" />
            </Pressable>

            <Text className="text-2xl font-inter-bold mb-4 ml-2">Perfil</Text>

            <Pressable onPress={() => {
              setIsExitModalVisible(true);
            }}>
              <AntDesign name="logout" size={25} />
            </Pressable>
          </View>
          <ImageUploader image={image} setImage={setImage} disabled />
          <Text className="text-2xl font-inter-bold">Usuario</Text>
          <Text className="text-xl font-inter-light text-center">Apaixonado por resolver problemas com código e café ☕</Text>
        </View>

        <View className="w-full flex flex-row justify-between mt-10">
          <CustomButton
            title='Editar perfil'
            onPress={() => {
              router.push('/cadastroUsuario')
            }}
            className="flex-1 mt-auto mr-2"
          />
          <CustomButton
            title='Compartilhar'
            onPress={() => {
              //
            }}
            className="flex-1 mt-auto"
            colors={[...Colors.greenGradient] as [string, string, ...string[]]}
          />
        </View>

        <Text className="text-3xl font-inter-bold my-8">Skillbox</Text>

        <View className="w-full flex flex-row flex-wrap justify-between mb-4">
          <SkillboxItem
            title="Hard skill"
            value="Python"
            bgColor="green"
          />
          <SkillboxItem
            title="Hard skill"
            value="Python"
            bgColor="green"
          />
          <SkillboxItem
            title="Hard skill"
            value="Python"
            bgColor="green"
          />
          <SkillboxItem
            title="Hard skill"
            value="Python"
            bgColor="green"
          />
        </View>

        <View className="flex flex-row w-full">
          <View className="flex flex-1 mr-2">
            <Text className="text-3xl font-inter-bold">Cursos</Text>

            <ListCardPerfil institution="Alura"
              name="Curso de python as saasdas asd asd" />
            <ListCardPerfil institution="Alura"
              name="Curso de python as saasdas asd asd" />
            <ListCardPerfil institution="Alura"
              name="Curso de python as saasdas asd asd" />
            <ListCardPerfil institution="Alura"
              name="Curso de python as saasdas asd asd" />
            <ListCardPerfil institution="Alura"
              name="Curso de python as saasdas asd asd" />
            <ListCardPerfil institution="Alura"
              name="Curso de python as saasdas asd asd" />

          </View>
          <View className="flex flex-1">
            <Text className="text-3xl font-inter-bold">Projetos</Text>

            <ListCardProjetoPerfil
              image="https://picsum.photos/seed/react/600/400"
              title="Dashboard de vendas"
              skills={["python", "UI design"]}
            />
            <ListCardProjetoPerfil
              image="https://picsum.photos/seed/react/600/400"
              title="Dashboard de vendas"
              skills={["python", "UI design"]}
            />
            <ListCardProjetoPerfil
              image="https://picsum.photos/seed/react/600/400"
              title="Dashboard de vendas"
              skills={["python", "UI design"]}
            />
          </View>

        </View>

      </ScrollView>
      <ConfirmationModal
        isVisible={isExitModalVisible}
        onClose={() => setIsExitModalVisible(false)}
        onConfirm={() => {
          setIsExitModalVisible(false);
          router.push('/login');
        }}
        title="Confirmar saida"
        message="Tem certeza de que deseja sair?"
        confirmButtonText="Sim, Sair"
      />
    </SafeAreaView>
  )
}