import FacebookIcon from '@/assets/icons/facebook.svg';
import GoogleIcon from '@/assets/icons/google.svg';
import LinkedinIcon from '@/assets/icons/linkedin.svg';
import { BackgroundGradient } from '@/components/BackgroundGradient';
import { ControlledInput } from '@/components/ControlledInput';
import { CustomButton } from '@/components/ui/CustomButton';
import { IconButton } from '@/components/ui/IconButton';
import { AuthContext } from '@/contexts/authContext';
import { LoginSchema } from '@/data/shemas/loginSchema';
import { IPostLogin, LoginDataForm } from '@/interfaces/login';
import { postLogin } from '@/services/modules/loginService';
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "expo-router";
import { useContext, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Image, Pressable, Text, TextInput, View } from "react-native";
import Toast from 'react-native-toast-message';

export default function Login() {
  const router = useRouter();
  const {handleUserAuth} = useContext(AuthContext);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const inputSenhaRef = useRef<TextInput>(null);

  const {
    control,
    handleSubmit
  } = useForm<LoginDataForm>({
    resolver: yupResolver(LoginSchema)
  });

  async function handleLogin(data: LoginDataForm) {
    setIsSubmitting(true);
    try {
      const postData: IPostLogin = {
        email: data.login,
        senha: data.senha,
      }

      const result = await postLogin(postData);

      if (result) {
        handleUserAuth({
          token: result.access_token,
          nome: result.user?.nome,
          sobrenome: result.user?.sobrenome,
          email: result.user?.email,
          telefone: result.user?.telefone,
          dataNascimento: result.user?.data_nascimento,
          bio: "",
          id: result.user?.id,
          imagem: result.user?.avatar_url,
        });
        router.push('/home');
      }
    } catch (error: any) {
      Toast.show({ type: 'error', text1: 'Erro no login', text2: error?.message ?? "Tente novamente mais tarde." });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <BackgroundGradient className='items-center justify-center'>
        <View className='w-96 flex items-center justify-center bg-white/80 rounded-2xl p-5'>
          <Image
            style={{
              width: 90,
              height: 110,
              objectFit: "contain",
            }}
            source={require('@/assets/images/skillbox.png')}
            className='mb-4'
          />
          <ControlledInput
            control={control}
            label='Login'
            name='login'
            placeholder='@email.com'
            className='mb-4'
            returnKeyType='next'
            keyboardType='email-address'
            onSubmitEditing={() => inputSenhaRef?.current?.focus()}
          />
          <ControlledInput
            ref={inputSenhaRef}
            control={control}
            label='Senha'
            name='senha'
            type='password'
            placeholder='********'
            
          />
          <Pressable className='my-4'>
            <Text className="text-link">Esqueceu a senha?</Text>
          </Pressable>
          <CustomButton
            title='Entrar'
            onPress={handleSubmit(handleLogin)}
            isLoading={isSubmitting}
            className="w-full mb-2"
          />

          <View className="flex-row items-center w-full my-4">
            <View className="flex-1 border-b border-gray opacity-50" />
            <Text className="mx-4 text-gray">Ou login com</Text>
            <View className="flex-1 border-b border-gray opacity-50" />
          </View>
          <View className="flex-row w-full justify-around my-4">
            <IconButton>
              <GoogleIcon width={24} height={24} />
            </IconButton>
            {/* <IconButton>
              <AppleIcon width={24} height={24} />
            </IconButton> */}
            <IconButton>
              <FacebookIcon width={24} height={24} />
            </IconButton>
            <IconButton>
              <LinkedinIcon width={24} height={24} />
            </IconButton>
          </View>
          
          <View className="flex-row justify-center items-center w-full my-2">
            <Text className="text-gray flex items-center justify-center">Não tem uma conta? </Text>
            <Pressable onPress={() => router.push('/register')}>
              <Text className="text-link">Criar conta</Text>
            </Pressable>
          </View>
        </View>
      </BackgroundGradient>
      <Toast />
    </>
  );
}