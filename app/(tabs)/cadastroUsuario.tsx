import { ControlledAutocomplete } from "@/components/ControlledAutocomplete";
import { ControlledInput } from "@/components/ControlledInput";
import { ControlledSelect } from "@/components/ControlledSelect";
import { BadgeClose, CustomButton, HeaderList, SelectOption } from "@/components/ui";
import { ImageUploader } from "@/components/ui/ImageUploader";
import { AuthContext } from "@/comtexts/authContext";
import { UsuarioSchema } from "@/data/shemas/usuarioSchema";
import { CadastroUsuarioDataForm, IPutUsuario, TypeNivelFormacao } from "@/interfaces/cadastroUsuario";
import { getUsuarioById, putUsuario } from "@/services/modules/usuarioService";
import { Ionicons } from "@expo/vector-icons";
import { yupResolver } from "@hookform/resolvers/yup";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useContext, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { KeyboardAvoidingView, Platform, Pressable, SafeAreaView, ScrollView, Text, TextInput, View } from "react-native";
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
  areasUtilizadas: [],
  bio: "",
  linkedin: "",
  github: "",
  site: "",
  imagem: "",
}

export default function CadastroUsuario() {
  const router = useRouter();
  const { userAuth } = useContext(AuthContext);
  const [image, setImage] = useState<string | null>("");
  const [optionsAreas, setOptionsAreas] = useState<SelectOption[]>(initialOptionsAreas);
  const [inputValueArea, setInputValueArea] = useState('');
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
    watch,
    getValues,
    setValue,
    reset,
    handleSubmit
  } = useForm<CadastroUsuarioDataForm>({
    defaultValues: defaultValuesCadastroUsuario,
    resolver: yupResolver(UsuarioSchema) as any,
  });

  const areasUtilizadasNomes = useMemo(() => {
    return getValues().areasUtilizadas.map(areaValue => {
      const foundArea = optionsAreas.find(option => option.value === areaValue);
      return foundArea ? foundArea.label : '';
    }).filter(Boolean);
  }, [watch('areasUtilizadas'), optionsAreas]);

  function handleAddNovaArea(novaArea: string) {
    const findedArea = optionsAreas?.find((area) => area.label.toLowerCase() === novaArea.toLowerCase())
    if (findedArea) return findedArea;

    const novaOpcao: SelectOption = {
      label: novaArea,
      value: novaArea.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
    };

    setOptionsAreas(prev => [...prev, novaOpcao]);
    return novaOpcao;
  }

  function onAddArea() {
    if (watch().areaSelecionada) {
      const areaSelecionada: string = getValues().areaSelecionada ?? "";
      const findedArea = getValues().areasUtilizadas.find((categoria) => categoria === watch().areaSelecionada);

      if (!findedArea) {
        setValue("areasUtilizadas", [...getValues().areasUtilizadas, areaSelecionada], {
          shouldDirty: true,
          shouldValidate: true,
        });
      }
      setInputValueArea('');
    }
    setValue("areaSelecionada", undefined, {
      shouldDirty: true,
      shouldValidate: true,
    });
  }

  function onRemoveArea(area: string) {
    const filteredAreas = getValues().areasUtilizadas.filter((item) => item !== area);
    setValue("areasUtilizadas", filteredAreas, {
      shouldDirty: true,
      shouldValidate: true,
    });
  }

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

  async function getUsuarioByIdData(idUsuario: string) {
    setIsLoadingData(true);
    try {
      const result = await getUsuarioById(idUsuario);

      if (result) {
        reset({
          ...defaultValuesCadastroUsuario,
          nome: result.nome ?? "",
          sobrenome: result.sobrenome ?? "",
          dataNascimento: result.dataNascimento ?? "",
          email: result.email ?? "",
          telefone: result.telefone ?? "",
          areasUtilizadas: result.areasUtilizadas ?? [],
          bio: result.bio ?? "",
          github: result.github ?? "",
          imagem: result.imagem ?? "",
          instituicao: result.instituicao ?? "",
          linkedin: result.linkedin ?? "",
          localizacao: result.localizacao ?? "",
          nivelFormacao: result.nivelFormacao as TypeNivelFormacao ?? "fundamental",
          objetivoProfissional: result.objetivoProfissional ?? "",
          site: result.site ?? ""
        });
      }
    } catch (error: any) {
      Toast.show({ type: 'error', text1: 'Erro no usuario', text2: error?.message ?? "Tente novamente mais tarde." });
    } finally {
      setIsLoadingData(false);
    }
  }

  async function handleSubmitUsuario(data: CadastroUsuarioDataForm) {
    setIsSubmitting(true);
    try {

      const putData: IPutUsuario = {
        nome: data.nome,
        sobrenome: data.sobrenome,
        areasUtilizadas: [],
        bio: data.bio,
        dataNascimento: data.dataNascimento,
        email: data.email,
        github: data.github,
        imagem: "",
        instituicao: data.instituicao,
        linkedin: data.linkedin,
        localizacao: data.localizacao,
        nivelFormacao: data.nivelFormacao,
        objetivoProfissional: data.objetivoProfissional,
        site: data.site,
        telefone: data.telefone,
        senha: userAuth?.senha ?? "",
      };

      const result = await putUsuario(userAuth?.id ?? "", putData);

      if (result) {
        Toast.show({
          type: 'success',
          text1: 'Sucesso!',
          text2: `Usuario editado com sucesso!`,
        });
        setTimeout(() => router.push('/usuario'), 300);
      }
    } catch (error: any) {
      Toast.show({ type: 'error', text1: 'Erro no projeto', text2: error?.message ?? "Tente novamente mais tarde." });
    } finally {
      setIsSubmitting(false);
    }
  }

  useFocusEffect(
    useCallback(() => {
      getUsuarioByIdData(userAuth?.id ?? "");

      return () => {
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
            onBack={() => {
              router.push('/usuario')
            }}
            disabledAdd
          />
          <ScrollView ref={scrollViewRef} className="mt-4" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20, paddingTop: 4, paddingHorizontal: 4 }}>
            <View className="w-full items-center mb-6 mt-6">
              <ImageUploader image={image} setImage={setImage} />
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
              <View className="flex flex-row items-center justify-between mb-4 w-full">
                <ControlledAutocomplete
                  control={control}
                  label='Área de interesse'
                  name='areaSelecionada'
                  placeholder='Área'
                  className='w-3/4'
                  options={optionsAreas}
                  onAddOption={handleAddNovaArea}
                  handleInputValue={setInputValueArea}
                  inputValue={inputValueArea}
                  isLoading={isLoadingData}
                />
                <Pressable className="w-1/4 flex items-center justify-center" onPress={onAddArea}>
                  <Ionicons name="add-circle" size={40} color="black" />
                </Pressable>
              </View>
              <View className="flex flex-row w-full flex-wrap">
                {watch('areasUtilizadas')?.map((areaValue, index) => (
                  <BadgeClose
                    key={`${areaValue}-${index}`}
                    name={areasUtilizadasNomes[index]}
                    onPress={() => {
                      onRemoveArea(areaValue);
                    }}
                  />
                ))}
              </View>
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