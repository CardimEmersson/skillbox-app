import AppleIcon from '@/assets/icons/apple.svg';
import FacebookIcon from '@/assets/icons/facebook.svg';
import GoogleIcon from '@/assets/icons/google.svg';
import LinkedinIcon from '@/assets/icons/linkedin.svg';
import { BackgroundGradient } from '@/components/BackgroundGradient';
import { ControlledInput } from '@/components/ControlledInput';
import { CustomButton } from '@/components/ui/CustomButton';
import { IconButton } from '@/components/ui/IconButton';
import { LoginSchema } from '@/data/shemas/loginSchema';
import { LoginDataForm } from '@/interfaces/login';
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "expo-router";
import { useForm } from 'react-hook-form';
import { Image, Pressable, Text, View } from "react-native";

export default function Login() {
  const router = useRouter();

  const {
    control
  } = useForm<LoginDataForm>({
    resolver: yupResolver(LoginSchema)
  });

  return (

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
        />
        <ControlledInput
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
          onPress={() => router.push('/home')}
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
          <IconButton>
            <AppleIcon width={24} height={24} />
          </IconButton>
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
  );
}