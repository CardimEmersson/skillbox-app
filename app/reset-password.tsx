import { BackgroundGradient } from '@/components/BackgroundGradient';
import { ControlledInput } from "@/components/ControlledInput";
import { CustomButton } from "@/components/ui/CustomButton";
import { sizes } from '@/constants/Sizes';
import { postRedefinirSenha } from '@/services/modules/registerService';
import { customToastError } from '@/utils/toast';
import AntDesign from '@expo/vector-icons/AntDesign';
import { yupResolver } from '@hookform/resolvers/yup';
import { useRouter } from "expo-router";
import { useRef, useState } from 'react';
import { useForm } from "react-hook-form";
import { Keyboard, KeyboardAvoidingView, Platform, Pressable, SafeAreaView, ScrollView, Text, TextInput, TouchableWithoutFeedback, View } from "react-native";
import Toast from 'react-native-toast-message';
import { ResetPasswordSchema } from '../data/shemas/resetPasswordSchema';

export default function ResetPassword() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const inputTokenRef = useRef<TextInput>(null);
  const inputSenhaRef = useRef<TextInput>(null);
  const inputConfirmarSenhaRef = useRef<TextInput>(null);

  const { control, handleSubmit } = useForm({
    resolver: yupResolver(ResetPasswordSchema),
  });

  async function handleResetPassword(data: any) {
    setIsSubmitting(true);
    try {

      const result = await postRedefinirSenha({
        email: data.email,
        token: data.token,
        novaSenha: data.senha,
      });

      Toast.show({
        type: 'success',
        text1: 'Senha alterada!',
        text2: result?.message ?? 'Faça login com sua nova senha.',
      });

      setTimeout(() => {
        router.push('/login');
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
                    Redefinir senha
                  </Text>
                  <Text className='font-inter-regular text-sm color-gray mb-6 text-center'>
                    Preencha os dados abaixo para criar uma nova senha.
                  </Text>

                  <ControlledInput
                    control={control}
                    label='Email*'
                    name='email'
                    placeholder='@email.com'
                    keyboardType='email-address'
                    className='mb-4'
                    returnKeyType='next'
                    onSubmitEditing={() => inputTokenRef.current?.focus()}
                  />

                  <ControlledInput
                    ref={inputTokenRef}
                    control={control}
                    label='Token*'
                    name='token'
                    placeholder='Código recebido'
                    className='mb-4'
                    returnKeyType='next'
                    onSubmitEditing={() => inputSenhaRef.current?.focus()}
                  />

                  <ControlledInput
                    ref={inputSenhaRef}
                    control={control}
                    label='Nova Senha*'
                    name='senha'
                    type='password'
                    placeholder='********'
                    className='mb-4'
                    returnKeyType='next'
                    onSubmitEditing={() => inputConfirmarSenhaRef.current?.focus()}
                  />

                  <ControlledInput
                    ref={inputConfirmarSenhaRef}
                    control={control}
                    label='Confirmar Nova Senha*'
                    name='confirmarSenha'
                    type='password'
                    placeholder='********'
                    className='mb-8'
                    returnKeyType='done'
                    onSubmitEditing={handleSubmit(handleResetPassword)}
                  />

                  <CustomButton
                    title='Redefinir'
                    onPress={handleSubmit(handleResetPassword)}
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
