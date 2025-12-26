import { BackgroundGradient } from '@/components/BackgroundGradient';
import { ControlledInput } from "@/components/ControlledInput";
import { CustomButton } from "@/components/ui/CustomButton";
import { sizes } from '@/constants/Sizes';
import { postConfirmarConta } from '@/services/modules/registerService';
import { customToastError } from '@/utils/toast';
import { AntDesign } from '@expo/vector-icons';
import { yupResolver } from '@hookform/resolvers/yup';
import { useLocalSearchParams, useRouter } from "expo-router";
import { useRef, useState } from 'react';
import { useForm } from "react-hook-form";
import { Keyboard, KeyboardAvoidingView, Platform, Pressable, SafeAreaView, ScrollView, Text, TextInput, TouchableWithoutFeedback, View } from "react-native";
import Toast from 'react-native-toast-message';
import { ConfirmAccountSchema } from '../data/shemas/confirmAccountSchema';

type ConfirmAccountData = {
  email: string;
  token: string;
};

export default function ConfirmAccount() {
  const router = useRouter();
  const { email } = useLocalSearchParams<{ email: string }>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const inputTokenRef = useRef<TextInput>(null);

  const { control, handleSubmit } = useForm<ConfirmAccountData>({
    resolver: yupResolver(ConfirmAccountSchema),
    defaultValues: {
      email: email ?? '',
    },
  });

  async function handleConfirmAccount(data: ConfirmAccountData) {
    setIsSubmitting(true);
    try {

      const result = await postConfirmarConta({
        email: data.email,
        token: data.token,
      });

      Toast.show({
        type: 'success',
        text1: 'Conta verificada!',
        text2: result?.message ?? "Conta verificada com sucesso.",
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
                    Confirmar Conta
                  </Text>
                  <Text className='font-inter-regular text-sm color-gray mb-6 text-center'>
                    Digite o código de 6 dígitos enviado para o email {email ? <Text className="font-bold">{email}</Text> : 'cadastrado'}.
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
                    placeholder='000000'
                    keyboardType='number-pad'
                    maxLength={6}
                    className='mb-8 text-center tracking-widest text-2xl'
                    returnKeyType='done'
                    onSubmitEditing={handleSubmit(handleConfirmAccount)}
                  />

                  <CustomButton
                    title='Confirmar'
                    onPress={handleSubmit(handleConfirmAccount)}
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
