import { ControlledInput } from "@/components/ControlledInput";
import { ControlledSelect } from "@/components/ControlledSelect";
import { CustomButton, HeaderList, SelectOption } from "@/components/ui";
import { ImageUploader } from "@/components/ui/ImageUploader";
import { AuthContext } from "@/contexts/authContext";
import { UsuarioSchema } from "@/data/shemas/usuarioSchema";
import { CadastroUsuarioDataForm, TypeNivelFormacao } from "@/interfaces/cadastroUsuario";
import { getUsuarioAuth, putUsuario } from "@/services/modules/usuarioService";
import { convertDateToIso, convertIsoToDate } from "@/utils/date";
import { customToastError } from "@/utils/toast";
import { Ionicons } from "@expo/vector-icons";
import { yupResolver } from "@hookform/resolvers/yup";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useContext, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { BackHandler, KeyboardAvoidingView, Platform, Pressable, SafeAreaView, ScrollView, Text, TextInput, View } from "react-native";
import Toast from "react-native-toast-message";

const optionsNivelFormacao: SelectOption[] = [
  { label: 'Fundamental', value: 'fundamental' },
  { label: 'Médio', value: 'medio' },
  { label: 'Técnico', value: 'tecnico' },
  { label: 'Graduação', value: 'graduacao' },
  { label: 'Pós graduação', value: 'pos_graduacao' },
  { label: 'Mestrado', value: 'mestrado' },
  { label: 'Doutorado', value: 'doutorado' },
];

const initialOptionsAreas: SelectOption[] = [
  { label: 'Tecnologia', value: 'tecnologia' },
  { label: 'Saúde', value: 'saude' },
  { label: 'Engenharia', value: 'engenharia' },
  { label: 'Direito', value: 'direito' },
  { label: 'Educação', value: 'educacao' },
  { label: 'Design', value: 'design' },
  { label: 'Comunicação', value: 'comunicacao' },
  { label: 'Finanças', value: 'financas' },
  { label: 'Artes', value: 'artes' },
  { label: 'Negócios & Produto', value: 'negocios_produto' },
  { label: 'Recursos Humanos', value: 'recursos_humanos' },
  { label: 'Desenvolvimento Pessoal', value: 'desenvolvimento_pessoal' },
];

const defaultValuesCadastroUsuario: CadastroUsuarioDataForm = {
  nome: "",
  sobrenome: "",
  email: "",
  localizacao: "",
  dataNascimento: "",
  telefone: "",
  nivelFormacao: "fundamental",
  instituicao: "",
  objetivoProfissional: "",
  areaSelecionada: undefined,
  bio: "",
  linkedin: "",
  github: "",
  site: "",
  imagem: undefined,
}

export default function CadastroUsuario() {
  const router = useRouter();
  const { userAuth, handleUserAuth } = useContext(AuthContext);
  const [image, setImage] = useState<string | null>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  const inputSobrenomeRef = useRef<TextInput>(null);
  const inputEmailRef = useRef<TextInput>(null);
  const inputLocalizacaoRef = useRef<TextInput>(null);
  const inputDataNascimentoRef = useRef<TextInput>(null);
  const inputTelefoneRef = useRef<TextInput>(null);
  const inputObjetivoProfissionalRef = useRef<TextInput>(null);
  const inputLinkedinRef = useRef<TextInput>(null);
  const inputGithubRef = useRef<TextInput>(null);
  const inputSiteRef = useRef<TextInput>(null);

  const {
    control,
    setValue,
    reset,
    handleSubmit
  } = useForm<CadastroUsuarioDataForm>({
    defaultValues: defaultValuesCadastroUsuario,
    resolver: yupResolver(UsuarioSchema) as any,
  });

  function focusInput(nameInput: string) {
    switch (nameInput) {
      case 'sobrenome':
        inputSobrenomeRef?.current?.focus();
        break;
      case 'email':
        inputEmailRef?.current?.focus();
        break;
      case 'localizacao':
        inputLocalizacaoRef?.current?.focus();
        break;
      case 'dataNascimento':
        inputDataNascimentoRef?.current?.focus();
        break;
      case 'telefone':
        inputTelefoneRef?.current?.focus();
        break;
      case 'objetivoProfissional':
        inputObjetivoProfissionalRef?.current?.focus();
        break;
      case 'linkedin':
        inputLinkedinRef?.current?.focus();
        break;
      case 'github':
        inputGithubRef?.current?.focus();
        break;
      case 'site':
        inputSiteRef?.current?.focus();
        break;
      default:
        break;
    }
  }

  async function getUsuarioData() {
    setIsLoadingData(true);
    try {
      const result = await getUsuarioAuth();

      if (result) {
        reset({
          ...defaultValuesCadastroUsuario,
          nome: result.nome ?? "",
          sobrenome: result.sobrenome ?? "",
          dataNascimento: convertIsoToDate(result.dataNascimento),
          email: result.email ?? "",
          telefone: result.telefone ?? "",
          areaSelecionada: result.area_interesse ?? "",
          bio: result.bio ?? "",
          github: result.github ?? "",
          imagem: undefined,
          instituicao: result.instituicao ?? "",
          linkedin: result.linkedin ?? "",
          localizacao: result.localizacao ?? "",
          nivelFormacao: result.nivel_formacao as TypeNivelFormacao ?? "fundamental",
          objetivoProfissional: result.objetivo_profissional ?? "",
          site: result.site ?? ""
        });
        setImage(result.avatar ?? "");
      }
    } catch (error: any) {
      customToastError({
        text1: 'Erro no usuario',
        text2: error?.message ?? "Tente novamente mais tarde.",
      });
    } finally {
      setIsLoadingData(false);
    }
  }

  async function handleSubmitUsuario(data: CadastroUsuarioDataForm) {
    setIsSubmitting(true);
    try {
      const formDataUsuario = new FormData();
      formDataUsuario.append('nome', data.nome);
      formDataUsuario.append('sobrenome', data.sobrenome);
      formDataUsuario.append('email', data.email);
      formDataUsuario.append('telefone', data.telefone);
      formDataUsuario.append('dataNascimento', convertDateToIso(data.dataNascimento));
      if (data.imagem) {
        formDataUsuario.append('avatar', {
          uri: data.imagem.uri,
          name: data.imagem.fileName ?? data.imagem.uri.split('/').pop() ?? 'icone.jpg',
          type: (data.imagem as any).mimeType ?? 'image/jpeg',
        } as any);
      }
      formDataUsuario.append('bio', data.bio);
      formDataUsuario.append('localizacao', data.localizacao);
      formDataUsuario.append('nivel_formacao', data.nivelFormacao);
      formDataUsuario.append('instituicao', data.instituicao);
      formDataUsuario.append('objetivo_profissional', data.objetivoProfissional);
      formDataUsuario.append('area_interesse', data.areaSelecionada ?? "");
      formDataUsuario.append('linkedin', data.linkedin);
      formDataUsuario.append('github', data.github);
      formDataUsuario.append('site', data.site);

      const result = await putUsuario(formDataUsuario);

      if (result) {
        handleUserAuth({
          nome: data.nome,
          sobrenome: data.sobrenome,
          email: data.email,
          telefone: data.telefone,
          dataNascimento: result.dataNascimento,
          imagem: result.avatar_url,
          bio: data.bio,
          id: userAuth?.id ?? 0, 
          token: userAuth?.token ?? "",
        });
        Toast.show({
          type: 'success',
          text1: 'Sucesso!',
          text2: `Usuario editado com sucesso!`,
        });
        setTimeout(() => router.push('/usuario'), 300);
      }
    } catch (error: any) {
      customToastError({
        text2: error?.message ?? "Tente novamente mais tarde.",
        text1: "Erro no projeto",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

   const onBackPress = () => {
    router.push('/usuario');
    return true;
  };

  useFocusEffect(
    useCallback(() => {
      const backHandler = BackHandler.addEventListener('hardwareBackPress', onBackPress);

      getUsuarioData();

      return () => {
        backHandler.remove();
        reset(defaultValuesCadastroUsuario);
        scrollViewRef.current?.scrollTo({ y: 0, animated: false });
      };
    }, [userAuth, reset])
  );

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <View className='w-full flex flex-1 pt-10 px-8 pb-8'>
          <HeaderList
            onPressAdd={() => {
              //
            }}
            title="Perfil"
            onBack={onBackPress}
            disabledAdd
          />
          <ScrollView ref={scrollViewRef} className="mt-4" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20, paddingTop: 4, paddingHorizontal: 4 }} keyboardShouldPersistTaps="handled">
            <View className="w-full items-center mb-6 mt-6">
              <ImageUploader image={image} setImage={setImage} callbackFile={(image) => {
                setValue("imagem", image, {
                  shouldDirty: true,
                  shouldValidate: true,
                });
              }}
              />
              {!!image && (
                <Pressable onPress={() => {
                  setImage(null);
                  setValue("imagem", undefined, {
                    shouldDirty: true,
                    shouldValidate: true,
                  });
                }} className="flex flex-row items-center mt-2">
                  <Ionicons name="trash-outline" size={16} color="red" />
                  <Text className="text-red-500 ml-1">Remover imagem</Text>
                </Pressable>
              )}
            </View>

            <Text className="text-xl font-inter-bold mb-6 color-text">Informações pessoais</Text>
            <View>
              <ControlledInput
                control={control}
                label='Nome*'
                name='nome'
                placeholder='Nome'
                className='mb-4'
                returnKeyType='next'
                onSubmitEditing={() => focusInput('sobrenome')}
                isLoading={isLoadingData}
              />
              <ControlledInput
                ref={inputSobrenomeRef}
                control={control}
                label='Sobrenome*'
                name='sobrenome'
                placeholder='Sobrenome'
                className='mb-4'
                returnKeyType='next'
                onSubmitEditing={() => focusInput('email')}
                isLoading={isLoadingData}
              />
              <ControlledInput
                ref={inputEmailRef}
                control={control}
                label='Email*'
                name='email'
                placeholder='@email.com'
                keyboardType='email-address'
                className='mb-4'
                returnKeyType='next'
                onSubmitEditing={() => focusInput('localizacao')}
                isLoading={isLoadingData}
              />
              <ControlledInput
                ref={inputLocalizacaoRef}
                control={control}
                label='Localização (cidade/estado)'
                name='localizacao'
                placeholder='Localização'
                className='mb-4'
                returnKeyType='next'
                onSubmitEditing={() => focusInput('dataNascimento')}
                isLoading={isLoadingData}
              />
              <ControlledInput
                ref={inputDataNascimentoRef}
                control={control}
                label='Data de nascimento*'
                name='dataNascimento'
                placeholder='dd/mm/yyyy'
                className='mb-4'
                type='date'
                returnKeyType='next'
                onSubmitEditing={() => focusInput('telefone')}
                isLoading={isLoadingData}
              />
              <ControlledInput
                ref={inputTelefoneRef}
                control={control}
                label='Telefone*'
                name='telefone'
                placeholder='(00) 00000-0000'
                type='phone'
                mask='phone'
                className='mb-4'
                returnKeyType='next'
                isLoading={isLoadingData}
              />

              <Text className="text-xl font-inter-bold my-6 color-text">Perfil profissional / Acadêmico</Text>

              <ControlledSelect
                control={control}
                label='Nível de formação'
                name='nivelFormacao'
                placeholder='Fundamental'
                className='mb-4'
                returnKeyType='next'
                options={optionsNivelFormacao}
                isLoading={isLoadingData}
              />
              <ControlledInput
                control={control}
                label='Instituição de ensino'
                name='instituicao'
                placeholder='Instituição'
                className='mb-4'
                returnKeyType='next'
                onSubmitEditing={() => focusInput('objetivoProfissional')}
                isLoading={isLoadingData}
              />
              <ControlledInput
                ref={inputObjetivoProfissionalRef}
                control={control}
                label='Objetivo profissional'
                name='objetivoProfissional'
                placeholder='Objetivo profissional'
                className='mb-4'
                returnKeyType='next'
                multiline
                numberOfLines={4}
                textAlignVertical="top"
                isLoading={isLoadingData}
              />
              <ControlledSelect
                control={control}
                label='Área de interesse'
                name='areaSelecionada'
                placeholder='Área'
                className='mb-4'
                returnKeyType='next'
                options={initialOptionsAreas}
                isLoading={isLoadingData}
              />
              <ControlledInput
                control={control}
                label='Bio / sobre você'
                name='bio'
                placeholder='Bio'
                className='mb-4'
                returnKeyType='next'
                multiline
                numberOfLines={4}
                textAlignVertical="top"
                onSubmitEditing={() => focusInput('linkedin')}
                isLoading={isLoadingData}
              />

              <Text className="text-xl font-inter-bold my-6 color-text">Links pessoais / portifólio</Text>

              <ControlledInput
                ref={inputLinkedinRef}
                control={control}
                label='Linkedin'
                name='linkedin'
                placeholder='https://'
                className='mb-4'
                keyboardType="url"
                returnKeyType='next'
                onSubmitEditing={() => focusInput('github')}
                isLoading={isLoadingData}
              />
              <ControlledInput
                ref={inputGithubRef}
                control={control}
                label='Github'
                name='github'
                placeholder='https://'
                className='mb-4'
                returnKeyType='next'
                keyboardType="url"
                onSubmitEditing={() => focusInput('site')}
                isLoading={isLoadingData}
              />
              <ControlledInput
                ref={inputSiteRef}
                control={control}
                label='Site pessoal / Portifólio'
                name='site'
                placeholder='https://'
                className='mb-4'
                returnKeyType='next'
                keyboardType="url"
                isLoading={isLoadingData}
              />

              <CustomButton
                title='Salvar'
                onPress={handleSubmit(handleSubmitUsuario)}
                className="w-full mb-2 mt-auto"
                isLoading={isSubmitting}
              />
            </View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}