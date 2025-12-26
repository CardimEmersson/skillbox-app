import { BackgroundGradient } from '@/components/BackgroundGradient';
import { ControlledInput } from "@/components/ControlledInput";
import { CustomButton } from "@/components/ui/CustomButton";
import { sizes } from '@/constants/Sizes';
import { postEsqueciSenha } from '@/services/modules/registerService';
import { customToastError } from '@/utils/toast';
import AntDesign from '@expo/vector-icons/AntDesign';
import { yupResolver } from '@hookform/resolvers/yup';
import { useRouter } from "expo-router";
import { useState } from 'react';
import { useForm } from "react-hook-form";
import { Keyboard, KeyboardAvoidingView, Platform, Pressable, SafeAreaView, ScrollView, Text, TouchableWithoutFeedback, View } from "react-native";
import Toast from 'react-native-toast-message';
import { ForgotPasswordSchema } from '../data/shemas/forgotPasswordSchema';

type ForgotPasswordData = {
  email: string;
};

export default function ForgotPassword() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { control, handleSubmit } = useForm<ForgotPasswordData>({
    resolver: yupResolver(ForgotPasswordSchema),
  });

  async function handleForgotPassword(data: ForgotPasswordData) {
    setIsSubmitting(true);
    try {

      const result = await postEsqueciSenha({
        email: data.email,
      });

      Toast.show({
        type: 'success',
        text1: 'Email enviado!',
        text2: result?.message ?? 'Verifique sua caixa de entrada.',
      });

      setTimeout(() => {
        router.push('/reset-password');
      }, 1000);

    } catch (error: any) {
      customToastError({
        text1: 'Erro',
        text2: error?.message ?? "Tente novamente mais tarde.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <BackgroundGradient>
        <SafeAreaView className="flex-1">
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ flex: 1 }}
          >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>

              <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerClassName="flex-grow items-center justify-center relative"
              >
                <View className='w-96 mb-6 mt-7 top-10 left-8 absolute'>
                  <Pressable onPress={() => router.back()} className='flex-row items-center'>
                    <AntDesign name="arrowleft" size={sizes.icons.lg} color="black" />
                    <Text className='font-inter-semibold ml-1'>Voltar</Text>
                  </Pressable>
                </View>
                <View className='w-96 flex items-center justify-center bg-white/80 rounded-2xl p-5 mb-6'>
                  <Text className='font-inter-bold text-3xl color-headline leading-[130%] mb-2'>
                    Esqueci a senha
                  </Text>
                  <Text className='font-inter-regular text-sm color-gray mb-6 text-center'>
                    Digite seu email para receber as instruções de recuperação.
                  </Text>

                  <ControlledInput
                    control={control}
                    label='Email*'
                    name='email'
                    placeholder='@email.com'
                    keyboardType='email-address'
                    className='mb-8'
                    returnKeyType='done'
                    onSubmitEditing={handleSubmit(handleForgotPassword)}
                  />

                  <CustomButton
                    title='Enviar'
                    onPress={handleSubmit(handleForgotPassword)}
                    className="w-full mb-2"
                    isLoading={isSubmitting}
                  />
                </View>
              </ScrollView>
            </TouchableWithoutFeedback>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </BackgroundGradient>
      <Toast />
    </>
  );
}
