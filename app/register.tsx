import { BackgroundGradient } from '@/components/BackgroundGradient';
import { ControlledInput } from "@/components/ControlledInput";
import { CustomButton } from "@/components/ui/CustomButton";
import { sizes } from '@/constants/Sizes';
import { RegisterDataForm } from '@/interfaces/register';
import AntDesign from '@expo/vector-icons/AntDesign';
import { useRouter } from "expo-router";
import { useRef } from 'react';
import { useForm } from "react-hook-form";
import { Keyboard, KeyboardAvoidingView, Platform, Pressable, SafeAreaView, ScrollView, Text, TextInput, TouchableWithoutFeedback, View } from "react-native";


export default function Register() {
  const router = useRouter();

  const inputSobrenomeRef = useRef<TextInput>(null);
  const inputEmailRef = useRef<TextInput>(null);
  const inputDataNascimentoRef = useRef<TextInput>(null);
  const inputTelefoneRef = useRef<TextInput>(null);
  const inputSenhaRef = useRef<TextInput>(null);
  const inputConfirmarSenhaRef = useRef<TextInput>(null);

  const {
    control
  } = useForm<RegisterDataForm>({
    // resolver: yupResolver(LoginSchema)
  });

  function focusInput(nameInput: string) {
    switch (nameInput) {
      case 'sobrenome':
        inputSobrenomeRef?.current?.focus();
        break;
      case 'email':
        inputEmailRef?.current?.focus();
        break;
      case 'dataNascimento':
        inputDataNascimentoRef?.current?.focus();
        break;
      case 'telefone':
        inputTelefoneRef?.current?.focus();
        break;
      case 'senha':
        inputSenhaRef?.current?.focus();
        break;
      case 'confirmarSenha':
        inputConfirmarSenhaRef?.current?.focus();
        break;
      default:
        break;
    }
  }

  return (
    <BackgroundGradient>
      <SafeAreaView className="flex-1">
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerClassName="flex-grow items-center justify-center"
              automaticallyAdjustKeyboardInsets
            >
              <View className='w-96 mb-6 mt-7'>
                <Pressable onPress={() => router.back()} className='flex-row items-center'>
                  <AntDesign name="arrowleft" size={sizes.icons.lg} color="black" />
                  <Text className='font-inter-semibold ml-1'>
                    Voltar
                  </Text>
                </Pressable>
              </View>

              <View className='w-96 flex items-center justify-center bg-white/80 rounded-2xl p-5 mb-6'>
                <Text className='font-inter-bold text-3xl color-headline leading-[130%] mb-2'>
                  Cadastro
                </Text>
                <Text className='font-inter-regular text-sm color-gray mb-6'>
                  Crie uma conta para continuar
                </Text>
                <ControlledInput
                  control={control}
                  label='Nome'
                  name='nome'
                  placeholder='Nome'
                  className='mb-4'
                  returnKeyType='next'
                  onSubmitEditing={() => focusInput('sobrenome')}
                />
                <ControlledInput
                  ref={inputSobrenomeRef}
                  control={control}
                  label='Sobrenome'
                  name='sobrenome'
                  placeholder='Sobrenome'
                  className='mb-4'
                  returnKeyType='next'
                  onSubmitEditing={() => focusInput('email')}
                />
                <ControlledInput
                  ref={inputEmailRef}
                  control={control}
                  label='Email'
                  name='email'
                  placeholder='@email.com'
                  keyboardType='email-address'
                  className='mb-4'
                  returnKeyType='next'
                  onSubmitEditing={() => focusInput('dataNascimento')}
                />
                <ControlledInput
                  ref={inputDataNascimentoRef}
                  control={control}
                  label='Data de nascimento'
                  name='dataNascimento'
                  placeholder='dd/mm/yyyy'
                  className='mb-4'
                  type='date'
                  returnKeyType='next'
                  onSubmitEditing={() => focusInput('telefone')}
                />
                <ControlledInput
                  ref={inputTelefoneRef}
                  control={control}
                  label='Telefone'
                  name='telefone'
                  placeholder='(00) 00000-0000'
                  type='phone'
                  mask='phone'
                  className='mb-4'
                  returnKeyType='next'
                />
                <ControlledInput
                  ref={inputSenhaRef}
                  control={control}
                  label='Senha'
                  name='senha'
                  type='password'
                  placeholder='********'
                  className='mb-4'
                  returnKeyType='next'
                />
                <ControlledInput
                  ref={inputConfirmarSenhaRef}
                  control={control}
                  label='Confirmar senha'
                  name='confirmarSenha'
                  type='password'
                  placeholder='********'
                  className='mb-8'
                  returnKeyType='done'
                />
                <CustomButton
                  title='Cadastrar'
                  onPress={() => {
                    //
                  }}
                  className="w-full mb-2"
                />

                <View className="flex-row justify-center items-center w-full my-2">
                  <Text className="text-gray flex items-center justify-center">Já tenho uma conta? </Text>
                  <Pressable onPress={() => router.push('/login')}>
                    <Text className="text-link">Login</Text>
                  </Pressable>
                </View>
              </View>
            </ScrollView>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </BackgroundGradient>
  );
}