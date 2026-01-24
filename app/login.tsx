import FacebookIcon from '@/assets/icons/facebook.svg';
import GoogleIcon from '@/assets/icons/google.svg';
import LinkedinIcon from '@/assets/icons/linkedin.svg';
import { BackgroundGradient } from '@/components/BackgroundGradient';
import { ControlledInput } from '@/components/ControlledInput';
import { CustomButton } from '@/components/ui/CustomButton';
import { IconButton } from '@/components/ui/IconButton';
import { AuthContext } from '@/contexts/authContext';
import { LoginSchema } from '@/data/shemas/loginSchema';
import { IPostLogin, IPostLoginFacebook, IPostLoginGoogle, IPostLoginLinkedin, IPostLoginResponse, LoginDataForm } from '@/interfaces/login';
import { postLogin, postLoginFacebook, postLoginGoogle, postLoginLinkedin } from '@/services/modules/loginService';
import { customToastError } from '@/utils/toast';
import { yupResolver } from "@hookform/resolvers/yup";
import { makeRedirectUri, ResponseType, useAuthRequest } from 'expo-auth-session';
import * as Facebook from 'expo-auth-session/providers/facebook';
import * as Google from 'expo-auth-session/providers/google';
import { useRouter } from "expo-router";
import * as WebBrowser from 'expo-web-browser';
import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Image, Pressable, Text, TextInput, View } from "react-native";
import Toast from 'react-native-toast-message';

WebBrowser.maybeCompleteAuthSession();

export default function Login() {
  const router = useRouter();
  const { handleUserAuth } = useContext(AuthContext);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const inputSenhaRef = useRef<TextInput>(null);

  const [googleRequest, googleResponse, googlePromptAsync] = Google.useAuthRequest({
    androidClientId: process.env.EXPO_PUBLIC_ANDROID_CLIENT_ID,
    iosClientId: process.env.EXPO_PUBLIC_IOS_CLIENT_ID,
    webClientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID,
    redirectUri: makeRedirectUri({
      scheme: 'com.emersson.skillbox',
    }),
  });

  const [facebookRequest, facebookResponse, facebookPromptAsync] = Facebook.useAuthRequest({
    clientId: process.env.EXPO_PUBLIC_FACEBOOK_CLIENT_ID,
    redirectUri: makeRedirectUri({
      scheme: `fb${process.env.EXPO_PUBLIC_FACEBOOK_CLIENT_ID}`,
      path: 'authorize',
    }),
  });

  const linkedinRedirectUri = `https://auth.expo.io/@emersson/skillbox?returnUrl=${encodeURIComponent(
    makeRedirectUri({
      scheme: 'com.emersson.skillbox',
    })
  )}`;


  const [linkedinRequest, linkedinResponse, linkedinPromptAsync] = useAuthRequest(
    {
      clientId: process.env.EXPO_PUBLIC_LINKEDIN_CLIENT_ID!,
      scopes: ['openid', 'profile', 'email'],
      redirectUri: linkedinRedirectUri,
      responseType: ResponseType.Code,
    },
    {
      authorizationEndpoint: 'https://www.linkedin.com/oauth/v2/authorization',
      tokenEndpoint: 'https://www.linkedin.com/oauth/v2/accessToken',
    }
  );

  const {
    control,
    handleSubmit
  } = useForm<LoginDataForm>({
    resolver: yupResolver(LoginSchema)
  });

  function handleUserLogin(user: IPostLoginResponse) {
    handleUserAuth({
      token: user.access_token,
      nome: user.user?.nome,
      sobrenome: user.user?.sobrenome,
      email: user.user?.email,
      telefone: user.user?.telefone,
      dataNascimento: user.user?.data_nascimento,
      bio: "",
      id: user.user?.id,
      imagem: user.user?.avatar_url,
    });
    router.push('/home');
  }

  async function handleLogin(data: LoginDataForm) {
    setIsSubmitting(true);
    try {
      const postData: IPostLogin = {
        email: data.login,
        senha: data.senha,
      }

      const result = await postLogin(postData);

      if (result) {
        handleUserLogin(result);
      }
    } catch (error: any) {
      customToastError({
        text1: 'Erro no login',
        text2: error?.message ?? "Tente novamente mais tarde.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  const handleGoogleLogin = useCallback(async (googleToken: string) => {
    setIsSubmitting(true);
    try {
      const postData: IPostLoginGoogle = {
        token: googleToken
      }

      const result = await postLoginGoogle(postData);
      
      if (result) {
        handleUserLogin(result);
      }
    } catch (error: any) {
      customToastError({
        text1: 'Erro no login',
        text2: error?.message ?? "Tente novamente mais tarde.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  const handleFacebookLogin = useCallback(async (accessToken: string) => {
    setIsSubmitting(true);
    try {
      const postData: IPostLoginFacebook = {
        token: accessToken
      }

      const result = await postLoginFacebook(postData);

      if (result) {
        handleUserLogin(result);
      }
    } catch (error: any) {
      customToastError({
        text1: 'Erro no login Facebook',
        text2: error?.message ?? "Tente novamente mais tarde.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  const handleLinkedinLogin = useCallback(async (code: string) => {
    setIsSubmitting(true);
    try {
      const postData: IPostLoginLinkedin = {
        code: code
      }

      const result = await postLoginLinkedin(postData);

      if (result) {
        handleUserLogin(result);
      }
    } catch (error: any) {
      customToastError({
        text1: 'Erro no login LinkedIn',
        text2: error?.message ?? "Tente novamente mais tarde.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  useEffect(() => {
    if (googleResponse?.type === 'success') {
      const { authentication } = googleResponse;
      authentication?.accessToken && handleGoogleLogin(authentication?.accessToken ?? "");
    }
  }, [googleResponse]);

  useEffect(() => {
    if (facebookResponse?.type === 'success') {
      const { authentication } = facebookResponse;
      authentication?.accessToken && handleFacebookLogin(authentication?.accessToken ?? "");
    }
  }, [facebookResponse]);

  useEffect(() => {
    if (linkedinResponse?.type === 'success') {
      const { code } = linkedinResponse.params;
      code && handleLinkedinLogin(code);
    }
  }, [linkedinResponse]);

  return (
    <>
      <BackgroundGradient className='items-center justify-center'>
        <View className='w-[90%] max-w-96 flex items-center justify-center bg-white/80 rounded-2xl p-5'>
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
          <View className='flex flex-row items-center  w-full justify-center px-2 my-4'>
            <Pressable className='w-[45%]' onPress={() => router.push('/forgot-password')}>
              <Text className="text-link text-center leading-6">Esqueceu a senha?</Text>
            </Pressable>
            <Pressable className='w-[45%]' onPress={() => router.push('/reset-password')}>
              <Text className="text-link text-center leading-6">Redefinir senha</Text>
            </Pressable>
          </View>
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
            <IconButton disabled={!googleRequest || isSubmitting} onPress={() => googlePromptAsync()}>
              <GoogleIcon width={24} height={24} />
            </IconButton>
            {/* <IconButton>
              <AppleIcon width={24} height={24} />
            </IconButton> */}
            <IconButton disabled={!facebookRequest || isSubmitting} onPress={() => facebookPromptAsync()}>
              <FacebookIcon width={24} height={24} />
            </IconButton>
            <IconButton disabled={!linkedinRequest || isSubmitting} onPress={() => linkedinPromptAsync()}>
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